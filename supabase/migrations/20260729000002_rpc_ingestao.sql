-- =====================================================================
-- Reconstrução — Etapa 5: RPC de INGESTÃO (set-based, incremental, com lock).
-- =====================================================================
-- Lê concrem_pedidos_venda + concrem_pedidos_status (numero_pedido = chave real
-- confirmada), filtra elegíveis (concremprodutos_status_elegiveis.elegivel),
-- faz unnest de dados_tabela->'itens', extrai código=id / descrição=produto /
-- unidade=un, consolida por CÓDIGO em produtos_descobertos + variantes, registra
-- log_extracao e execucoes, e avança a marca d'água (updated_at).
--
-- Concorrência: pg_try_advisory_lock impede execução simultânea. Idempotente:
-- re-rodar com a mesma marca d'água não duplica (ON CONFLICT por código/variante).
-- SECURITY DEFINER + search_path fixo; EXECUTE só service_role (backend).
-- LEITURA de concrem_* é read-only; PREÇO nunca é lido/gravado.
-- Normalização autoritativa é a função TS (na classificação); aqui só uma
-- normalização leve para exibição/busca (sem unaccent p/ não exigir extensão).
-- =====================================================================

CREATE OR REPLACE FUNCTION concremprodutos_norm_leve(txt TEXT)
RETURNS TEXT LANGUAGE sql IMMUTABLE AS $$
  SELECT btrim(regexp_replace(upper(coalesce(txt, '')), '\s+', ' ', 'g'));
$$;

CREATE OR REPLACE FUNCTION concremprodutos_ingerir_pedidos(p_incremental BOOLEAN DEFAULT true)
RETURNS concremprodutos_execucoes
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_lock_key BIGINT := hashtextextended('concremprodutos_ingestao', 0);
  v_desde    TIMESTAMPTZ;
  v_ate      TIMESTAMPTZ;
  v_exec     concremprodutos_execucoes;
  v_novos    INTEGER := 0;
  v_atualiz  INTEGER := 0;
BEGIN
  -- 1) Trava de concorrência (não bloqueante).
  IF NOT pg_try_advisory_lock(v_lock_key) THEN
    RAISE EXCEPTION 'Ingestão já em execução (advisory lock ocupado).';
  END IF;

  INSERT INTO concremprodutos_execucoes (inicio, versao_motor) VALUES (now(), 'ingestao-v1')
  RETURNING * INTO v_exec;

  -- 2) Marca d'água (incremental por updated_at).
  SELECT ultimo_updated_at INTO v_desde FROM concremprodutos_sync_estado WHERE id = 1;
  IF NOT p_incremental THEN v_desde := NULL; END IF;

  -- 3) Pipeline: elegíveis → itens → consolidado por código.
  CREATE TEMP TABLE tmp_itens ON COMMIT DROP AS
  WITH elegiveis AS (
    SELECT v.id AS pedido_uuid, v.numero_pedido, v.updated_at, v.dados_tabela
    FROM concrem_pedidos_venda v
    JOIN concrem_pedidos_status s
      ON s.numero_pedido = v.numero_pedido AND s.excluido_em IS NULL
    JOIN concremprodutos_status_elegiveis e
      ON e.status = s.status_atual AND e.elegivel = true
    WHERE (v_desde IS NULL OR v.updated_at > v_desde)
      AND jsonb_typeof(v.dados_tabela -> 'itens') = 'array'
  )
  SELECT
    e.pedido_uuid,
    e.numero_pedido,
    e.updated_at,
    nullif(btrim(it ->> 'id'), '')       AS codigo,
    coalesce(it ->> 'produto', '')        AS descricao,
    nullif(btrim(it ->> 'un'), '')        AS unidade
  FROM elegiveis e,
       LATERAL jsonb_array_elements(e.dados_tabela -> 'itens') AS it
  WHERE nullif(btrim(it ->> 'id'), '') IS NOT NULL
     OR nullif(it ->> 'produto', '') IS NOT NULL;   -- ignora item sem código E sem descrição

  SELECT max(updated_at) INTO v_ate FROM tmp_itens;

  -- 4) Consolidação por código (só itens com código).
  CREATE TEMP TABLE tmp_agg ON COMMIT DROP AS
  SELECT
    codigo,
    mode() WITHIN GROUP (ORDER BY descricao)         AS descricao_principal,
    min(updated_at)                                   AS primeira,
    max(updated_at)                                   AS ultima,
    count(DISTINCT numero_pedido)                     AS q_pedidos,
    count(*)                                          AS q_ocorr,
    (array_agg(pedido_uuid ORDER BY updated_at))[1]   AS primeiro_pedido,
    count(DISTINCT concremprodutos_norm_leve(descricao)) > 1 AS tem_conflito
  FROM tmp_itens
  WHERE codigo IS NOT NULL
  GROUP BY codigo;

  -- 5) Upsert em produtos_descobertos (novos entram PENDENTE_CLASSIFICACAO).
  WITH up AS (
    INSERT INTO concremprodutos_produtos_descobertos AS d
      (codigo, descricao_principal, descricao_normalizada, hash_descricao,
       primeiro_pedido_id, primeira_ocorrencia, ultima_ocorrencia,
       quantidade_pedidos, quantidade_ocorrencias, status_classificacao, tem_conflito)
    SELECT
      a.codigo, a.descricao_principal, concremprodutos_norm_leve(a.descricao_principal),
      md5(concremprodutos_norm_leve(a.descricao_principal)),
      a.primeiro_pedido::text, a.primeira, a.ultima, a.q_pedidos, a.q_ocorr,
      CASE WHEN a.tem_conflito THEN 'CLASSIFICADO_COM_CONFLITO' ELSE 'PENDENTE_CLASSIFICACAO' END,
      a.tem_conflito
    FROM tmp_agg a
    ON CONFLICT (codigo) DO UPDATE SET
      descricao_principal   = EXCLUDED.descricao_principal,
      descricao_normalizada = EXCLUDED.descricao_normalizada,
      hash_descricao        = EXCLUDED.hash_descricao,
      ultima_ocorrencia     = GREATEST(d.ultima_ocorrencia, EXCLUDED.ultima_ocorrencia),
      quantidade_pedidos    = GREATEST(d.quantidade_pedidos, EXCLUDED.quantidade_pedidos),
      quantidade_ocorrencias= EXCLUDED.quantidade_ocorrencias,
      tem_conflito          = EXCLUDED.tem_conflito,
      -- só reabre para reclassificar se a descrição mudou (hash diferente)
      status_classificacao  = CASE
        WHEN d.hash_descricao IS DISTINCT FROM EXCLUDED.hash_descricao
          THEN 'PENDENTE_CLASSIFICACAO' ELSE d.status_classificacao END,
      updated_at            = now()
    RETURNING (xmax = 0) AS inserido
  )
  SELECT count(*) FILTER (WHERE inserido), count(*) FILTER (WHERE NOT inserido)
    INTO v_novos, v_atualiz FROM up;

  -- 6) Variantes de descrição (todas, com contagem) — histórico preservado.
  INSERT INTO concremprodutos_variantes_descricao AS vv
    (produto_descoberto_id, descricao, descricao_normalizada, quantidade_ocorrencias, primeira_ocorrencia, ultima_ocorrencia)
  SELECT d.id, t.descricao, concremprodutos_norm_leve(t.descricao), count(*), min(t.updated_at), max(t.updated_at)
  FROM tmp_itens t
  JOIN concremprodutos_produtos_descobertos d ON d.codigo = t.codigo
  WHERE t.codigo IS NOT NULL
  GROUP BY d.id, t.descricao
  ON CONFLICT (produto_descoberto_id, descricao_normalizada) DO UPDATE SET
    quantidade_ocorrencias = concremprodutos_variantes_descricao.quantidade_ocorrencias + EXCLUDED.quantidade_ocorrencias,
    ultima_ocorrencia = GREATEST(concremprodutos_variantes_descricao.ultima_ocorrencia, EXCLUDED.ultima_ocorrencia),
    updated_at = now();

  -- 7) Enfileira os pendentes para classificação (Etapa 4/5 executará o motor).
  INSERT INTO concremprodutos_fila_classificacao (produto_descoberto_id, status)
  SELECT id, 'PENDENTE' FROM concremprodutos_produtos_descobertos
  WHERE status_classificacao IN ('PENDENTE_CLASSIFICACAO', 'CLASSIFICADO_COM_CONFLITO')
  ON CONFLICT (produto_descoberto_id) DO UPDATE SET status = 'PENDENTE', processar_apos = now();

  -- 8) Log de extração por pedido.
  INSERT INTO concremprodutos_log_extracao
    (execucao_id, pedido_id, hash_dados_tabela, itens_encontrados, itens_validos)
  SELECT v_exec.id, numero_pedido, md5(string_agg(coalesce(codigo,'')||coalesce(descricao,''), '|')),
         count(*), count(*) FILTER (WHERE codigo IS NOT NULL OR descricao <> '')
  FROM tmp_itens GROUP BY numero_pedido;

  -- 9) Avança marca d'água + fecha execução.
  IF v_ate IS NOT NULL THEN
    UPDATE concremprodutos_sync_estado
      SET ultimo_updated_at = v_ate, atualizado_em = now() WHERE id = 1;
  END IF;

  UPDATE concremprodutos_execucoes SET
    fim = now(),
    pedidos_lidos = (SELECT count(DISTINCT numero_pedido) FROM tmp_itens),
    produtos_encontrados = (SELECT count(DISTINCT codigo) FROM tmp_itens WHERE codigo IS NOT NULL),
    produtos_novos = v_novos,
    produtos_atualizados = v_atualiz
  WHERE id = v_exec.id
  RETURNING * INTO v_exec;

  PERFORM pg_advisory_unlock(v_lock_key);
  RETURN v_exec;
EXCEPTION WHEN OTHERS THEN
  PERFORM pg_advisory_unlock(v_lock_key);
  RAISE;
END $$;

REVOKE ALL ON FUNCTION concremprodutos_ingerir_pedidos(BOOLEAN) FROM PUBLIC, anon, authenticated;
-- EXECUTE concedido só ao service_role (backend). O frontend nunca chama direto.
GRANT EXECUTE ON FUNCTION concremprodutos_ingerir_pedidos(BOOLEAN) TO service_role;
