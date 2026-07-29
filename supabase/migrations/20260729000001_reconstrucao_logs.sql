-- =====================================================================
-- Reconstrução do catálogo — Etapa 3: LOGS append-only + auditoria. ADITIVA.
-- =====================================================================
-- Imutabilidade real (Cérebro — Observabilidade §10): RLS (admin LÊ; escrita só
-- service_role) + REVOKE UPDATE/DELETE de anon/authenticated. Correção = novo
-- registro, nunca update. `correlation_id` costura o fluxo. PROIBIDO em log:
-- senha/token/service_role/env/PII desnecessária/PREÇO (teste garante).
-- =====================================================================

-- Log de sincronização do conhecimento (Etapa 7 popula; tabela já criada aqui)
CREATE TABLE IF NOT EXISTS concremprodutos_log_sync (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  correlation_id   UUID,
  execucao_id      UUID,
  documento        TEXT,
  caminho          TEXT,
  hash_anterior    TEXT,
  hash_novo        TEXT,
  versao_anterior  TEXT,
  versao_nova      TEXT,
  status_validacao TEXT,
  regras_compiladas INTEGER,
  erros            TEXT,
  inicio           TIMESTAMPTZ,
  fim              TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Log de extração dos pedidos
CREATE TABLE IF NOT EXISTS concremprodutos_log_extracao (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  correlation_id    UUID,
  execucao_id       UUID,
  pedido_id         TEXT,
  status_pedido     TEXT,
  hash_dados_tabela TEXT,
  itens_encontrados INTEGER,
  itens_validos     INTEGER,
  itens_rejeitados  INTEGER,
  motivos_rejeicao  JSONB,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_cle_corr ON concremprodutos_log_extracao (correlation_id);

-- Log de classificação do produto
CREATE TABLE IF NOT EXISTS concremprodutos_log_classificacao (
  id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  correlation_id           UUID,
  execucao_id              UUID,
  produto_id               UUID,
  codigo                   TEXT,
  pedido_origem_id         TEXT,
  descricao_original       TEXT,
  descricao_normalizada    TEXT,
  familia_resultante       TEXT,
  confianca_global         NUMERIC(4,3),
  status_resultante        TEXT,
  versao_motor             TEXT,
  snapshot_conhecimento_id UUID,
  regras_aplicadas         JSONB,
  regras_rejeitadas        JSONB,
  evidencias               JSONB,
  conflitos                JSONB,
  motivo_bloqueio          TEXT,
  duracao_ms               INTEGER,
  created_at               TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_clc_codigo ON concremprodutos_log_classificacao (codigo, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_clc_corr ON concremprodutos_log_classificacao (correlation_id);

-- Log de decisão por atributo
CREATE TABLE IF NOT EXISTS concremprodutos_log_atributo (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  correlation_id    UUID,
  log_classificacao_id UUID REFERENCES concremprodutos_log_classificacao(id) ON DELETE CASCADE,
  atributo          TEXT,
  valor             TEXT,
  confianca         NUMERIC(4,3),
  origem            TEXT,
  regra_id          TEXT,
  documento_origem  TEXT,
  versao_documento  TEXT,
  evidencias        JSONB,
  conflitos         JSONB,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Log de publicação (auditoria de negócio)
CREATE TABLE IF NOT EXISTS concremprodutos_log_publicacao (
  id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  correlation_id           UUID,
  produto_id               UUID,
  classificacao_id         UUID,
  status_anterior          TEXT,
  status_novo              TEXT,
  confianca                NUMERIC(4,3),
  snapshot_conhecimento_id UUID,
  publicado_em             TIMESTAMPTZ,
  origem                   TEXT,
  created_at               TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Auditoria manual (revisão humana)
CREATE TABLE IF NOT EXISTS concremprodutos_auditoria_manual (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  correlation_id   UUID,
  usuario_id       UUID,
  produto_id       UUID,
  acao             TEXT,
  valor_anterior   JSONB,
  valor_novo       JSONB,
  justificativa    TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_cam_produto ON concremprodutos_auditoria_manual (produto_id, created_at DESC);

-- ---------------------------------------------------------------------
-- Imutabilidade: RLS (admin lê; escrita via service_role) + revogar UPDATE/DELETE
-- ---------------------------------------------------------------------
DO $$
DECLARE t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'concremprodutos_log_sync','concremprodutos_log_extracao','concremprodutos_log_classificacao',
    'concremprodutos_log_atributo','concremprodutos_log_publicacao','concremprodutos_auditoria_manual'
  ] LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY;', t);
    -- Só admin LÊ; sem policy de escrita => cliente não insere/atualiza/apaga.
    EXECUTE format('DROP POLICY IF EXISTS "%s_select_admin" ON %I;', t, t);
    EXECUTE format('CREATE POLICY "%s_select_admin" ON %I FOR SELECT TO authenticated USING (concremprodutos_is_admin());', t, t);
    -- Append-only à prova de cliente: revoga UPDATE/DELETE (service_role ignora RLS, mas
    -- não é alvo destes GRANTs pois usa BYPASSRLS; a inserção de logs é feita por ele).
    EXECUTE format('REVOKE UPDATE, DELETE ON TABLE %I FROM anon, authenticated;', t);
    EXECUTE format('REVOKE INSERT ON TABLE %I FROM anon, authenticated;', t);
  END LOOP;
END $$;

-- NOTA: correções de auditoria criam NOVO registro (nunca UPDATE). Hash encadeado
-- de evidência de adulteração para log_publicacao/auditoria_manual pode ser
-- adicionado quando o risco exigir (Observabilidade §10) — avaliar na Etapa 7.
