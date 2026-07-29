-- =====================================================================
-- Reconstrução do catálogo — Etapa 3 (fundação de dados). ADITIVA.
-- =====================================================================
-- Banco COMPARTILHADO (S2). Aplicar pelo SQL Editor (não db push).
-- Nada é removido do modelo atual; tudo prefixado concremprodutos_*.
-- Reusa helpers da arquitetura de segurança: concremprodutos_is_admin(),
-- concremprodutos_can_edit(). Escrita destas tabelas é feita pelo backend
-- (service_role, que ignora RLS); o cliente autenticado LÊ (admin/editor).
-- Ref.: PLANO-RECONSTRUCAO-CATALOGO.md, Cérebro (Supabase §10/§18, Config §10).
-- =====================================================================

-- ---------------------------------------------------------------------
-- Config administrável: famílias canônicas (5) + status elegíveis
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS concremprodutos_familias (
  valor      TEXT PRIMARY KEY,          -- canônico interno (KIT_PORTA, PORTA, ...)
  label      TEXT NOT NULL,             -- exibição (KIT PORTA, PORTA, ALISAR, BATENTE, RODAPÉ)
  ordem      INTEGER NOT NULL DEFAULT 0,
  ativo      BOOLEAN NOT NULL DEFAULT true
);
INSERT INTO concremprodutos_familias (valor, label, ordem) VALUES
  ('KIT_PORTA', 'KIT PORTA', 1),
  ('PORTA',     'PORTA',     2),
  ('ALISAR',    'ALISAR',    3),
  ('BATENTE',   'BATENTE',   4),
  ('RODAPE',    'RODAPÉ',    5)
ON CONFLICT (valor) DO NOTHING;

-- Espelho ADMINISTRÁVEL da ordem de status (fonte: pedidoStatusFlow do faturamento).
-- Elegível = ordem >= 12 (em_carregamento em diante).
CREATE TABLE IF NOT EXISTS concremprodutos_status_elegiveis (
  status    TEXT PRIMARY KEY,
  ordem     INTEGER NOT NULL,
  elegivel  BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO concremprodutos_status_elegiveis (status, ordem, elegivel) VALUES
  ('aguardando_avaliacao',1,false),('aguardando_mapeamento',2,false),
  ('mapeamento_concluido',3,false),('aguardando_ferragem',4,false),
  ('ferragem_recebida',5,false),('liberado_comercial',6,false),
  ('aguardando_gerencia',7,false),('confirmado_gerencia',8,false),
  ('liberado_producao',9,false),('em_producao',10,false),
  ('producao_finalizada',11,false),('em_carregamento',12,true),
  ('despachado',13,true),('faturado',14,true),('em_entrega',15,true),
  ('parcialmente_entregue',16,true),('entregue',17,true),
  ('aguardando_pagamento',18,true),('finalizado',19,true)
ON CONFLICT (status) DO NOTHING;

-- ---------------------------------------------------------------------
-- Produtos descobertos (consolidados por código) + variantes de descrição
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS concremprodutos_produtos_descobertos (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo                TEXT NOT NULL UNIQUE,          -- itens[].id (chave de consolidação)
  descricao_principal   TEXT NOT NULL,
  descricao_normalizada TEXT NOT NULL,
  hash_descricao        TEXT,
  primeiro_pedido_id    TEXT,
  primeira_ocorrencia   TIMESTAMPTZ,
  ultima_ocorrencia     TIMESTAMPTZ,
  quantidade_pedidos    INTEGER NOT NULL DEFAULT 0,
  quantidade_ocorrencias INTEGER NOT NULL DEFAULT 0,
  status_classificacao  TEXT NOT NULL DEFAULT 'DESCOBERTO'
    CHECK (status_classificacao IN (
      'DESCOBERTO','PENDENTE_CLASSIFICACAO','CLASSIFICADO_COM_CONFLITO',
      'PENDENTE_REVISAO','APROVADO_AUTOMATICAMENTE','APROVADO_MANUALMENTE',
      'PUBLICADO','BLOQUEADO','INATIVO')),
  confianca_global      NUMERIC(4,3),
  tem_conflito          BOOLEAN NOT NULL DEFAULT false,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_cpd_status ON concremprodutos_produtos_descobertos (status_classificacao);

CREATE TABLE IF NOT EXISTS concremprodutos_variantes_descricao (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  produto_descoberto_id UUID NOT NULL REFERENCES concremprodutos_produtos_descobertos(id) ON DELETE CASCADE,
  descricao             TEXT NOT NULL,
  descricao_normalizada TEXT NOT NULL,
  quantidade_ocorrencias INTEGER NOT NULL DEFAULT 1,
  primeira_ocorrencia   TIMESTAMPTZ,
  ultima_ocorrencia     TIMESTAMPTZ,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (produto_descoberto_id, descricao_normalizada)
);

-- ---------------------------------------------------------------------
-- Classificações (histórico — nunca sobrescreve) + regras v2 + fila + execuções
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS concremprodutos_classificacoes (
  id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  produto_descoberto_id    UUID NOT NULL REFERENCES concremprodutos_produtos_descobertos(id) ON DELETE CASCADE,
  familia                  TEXT REFERENCES concremprodutos_familias(valor),
  atributos_json           JSONB NOT NULL DEFAULT '{}'::jsonb, -- {atributo:{valor,confianca,origem,evidencias,regra_id}}
  confianca_global         NUMERIC(4,3),
  origem                   TEXT,   -- REGRA_CODIGO | REGRA_DESCRICAO | PARSER | SIMILARIDADE | IA | MANUAL
  evidencias_json          JSONB,
  versao_motor             TEXT,
  regra_ids                TEXT[],
  snapshot_conhecimento_id UUID,   -- FK adicionada na Etapa 7 (kb_snapshots)
  aprovado                 BOOLEAN NOT NULL DEFAULT false,
  aprovado_por             UUID,
  aprovado_em              TIMESTAMPTZ,
  created_at               TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_cpc_produto ON concremprodutos_classificacoes (produto_descoberto_id, created_at DESC);

CREATE TABLE IF NOT EXISTS concremprodutos_regras_v2 (
  id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome                     TEXT NOT NULL,
  familia                  TEXT REFERENCES concremprodutos_familias(valor),
  condicoes_json           JSONB NOT NULL,
  resultados_json          JSONB NOT NULL,
  prioridade               INTEGER NOT NULL DEFAULT 0,
  confianca                NUMERIC(4,3) NOT NULL DEFAULT 0.0,
  interromper_processamento BOOLEAN NOT NULL DEFAULT false,
  ativo                    BOOLEAN NOT NULL DEFAULT true,
  versao                   INTEGER NOT NULL DEFAULT 1,
  -- origem rastreável (preenchida na compilação a partir do vault — Etapa 7)
  documento_origem         TEXT,
  secao_origem             TEXT,
  hash_origem              TEXT,
  created_at               TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at               TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_crv2_ativo_prio ON concremprodutos_regras_v2 (ativo, prioridade DESC);

CREATE TABLE IF NOT EXISTS concremprodutos_fila_classificacao (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  produto_descoberto_id UUID NOT NULL REFERENCES concremprodutos_produtos_descobertos(id) ON DELETE CASCADE,
  status                TEXT NOT NULL DEFAULT 'PENDENTE'
    CHECK (status IN ('PENDENTE','PROCESSANDO','CONCLUIDO','ERRO')),
  tentativas            INTEGER NOT NULL DEFAULT 0,
  erro                  TEXT,
  processar_apos        TIMESTAMPTZ NOT NULL DEFAULT now(),
  iniciado_em           TIMESTAMPTZ,
  finalizado_em         TIMESTAMPTZ,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (produto_descoberto_id)
);
CREATE INDEX IF NOT EXISTS idx_cfc_status ON concremprodutos_fila_classificacao (status, processar_apos);

CREATE TABLE IF NOT EXISTS concremprodutos_execucoes (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inicio                TIMESTAMPTZ NOT NULL DEFAULT now(),
  fim                   TIMESTAMPTZ,
  pedidos_lidos         INTEGER NOT NULL DEFAULT 0,
  produtos_encontrados  INTEGER NOT NULL DEFAULT 0,
  produtos_novos        INTEGER NOT NULL DEFAULT 0,
  produtos_atualizados  INTEGER NOT NULL DEFAULT 0,
  produtos_aprovados    INTEGER NOT NULL DEFAULT 0,
  produtos_revisao      INTEGER NOT NULL DEFAULT 0,
  produtos_com_erro     INTEGER NOT NULL DEFAULT 0,
  versao_motor          TEXT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Marca d'água do incremental (linha única).
CREATE TABLE IF NOT EXISTS concremprodutos_sync_estado (
  id                 INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  ultimo_updated_at  TIMESTAMPTZ,
  ultimo_pedido_id   TEXT,
  atualizado_em      TIMESTAMPTZ NOT NULL DEFAULT now()
);
INSERT INTO concremprodutos_sync_estado (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- updated_at por trigger (reusa a função já existente no projeto).
DO $$
DECLARE t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'concremprodutos_produtos_descobertos','concremprodutos_variantes_descricao','concremprodutos_regras_v2'
  ] LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS trg_%s_updated_at ON %I;', t, t);
    EXECUTE format('CREATE TRIGGER trg_%s_updated_at BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION concremprodutos_update_updated_at();', t, t);
  END LOOP;
END $$;

-- ---------------------------------------------------------------------
-- RLS: cliente autenticado admin/editor LÊ; escrita só backend (service_role).
-- Config (familias/status) legível por qualquer autenticado; escrita = admin.
-- ---------------------------------------------------------------------
DO $$
DECLARE t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'concremprodutos_produtos_descobertos','concremprodutos_variantes_descricao',
    'concremprodutos_classificacoes','concremprodutos_regras_v2',
    'concremprodutos_fila_classificacao','concremprodutos_execucoes','concremprodutos_sync_estado'
  ] LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY;', t);
    EXECUTE format('DROP POLICY IF EXISTS "%s_select_edit" ON %I;', t, t);
    EXECUTE format('CREATE POLICY "%s_select_edit" ON %I FOR SELECT TO authenticated USING (concremprodutos_can_edit());', t, t);
    -- sem policies de INSERT/UPDATE/DELETE p/ cliente => default deny (escrita via service_role)
  END LOOP;

  FOREACH t IN ARRAY ARRAY['concremprodutos_familias','concremprodutos_status_elegiveis'] LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY;', t);
    EXECUTE format('DROP POLICY IF EXISTS "%s_select_auth" ON %I;', t, t);
    EXECUTE format('CREATE POLICY "%s_select_auth" ON %I FOR SELECT TO authenticated USING (true);', t, t);
    EXECUTE format('DROP POLICY IF EXISTS "%s_write_admin" ON %I;', t, t);
    EXECUTE format('CREATE POLICY "%s_write_admin" ON %I FOR ALL TO authenticated USING (concremprodutos_is_admin()) WITH CHECK (concremprodutos_is_admin());', t, t);
  END LOOP;
END $$;
