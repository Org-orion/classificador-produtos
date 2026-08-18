-- =====================================================================
-- Aplicabilidade de campo por tipo de produto
-- =====================================================================
-- Cada linha diz: "este campo NÃO se aplica a este tipo de produto".
-- Campo que não se aplica some da tela e nunca conta como pendência —
-- é o que faz um ALIZAR não ser cobrado por movimento.
--
-- Isso vivia fixo no código (src/lib/completude.ts), então só ALIZAR e
-- BATENTE estavam declarados e um RODAPE nunca fechava como classificado,
-- por ser cobrado por movimento, enchimento e linha. Vira dado para o
-- administrador declarar sozinho, inclusive para tipo que ainda não existe.
--
-- ⚠️ Banco COMPARTILHADO (ctntlgvoefdbjxvfkahp): aplicar pelo SQL Editor,
-- NÃO por `supabase db push`.
-- =====================================================================

CREATE TABLE IF NOT EXISTS concremprodutos_aplicabilidade (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo_produto  TEXT NOT NULL,
  campo         TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (tipo_produto, campo)
);

COMMENT ON TABLE concremprodutos_aplicabilidade IS
  'Linha presente = o campo NÃO se aplica ao tipo. Ausência = se aplica.';

ALTER TABLE concremprodutos_aplicabilidade ENABLE ROW LEVEL SECURITY;

-- Leitura junto com o resto do catálogo; escrita só admin (mesmo padrão das
-- demais tabelas de configuração — ver 20260723000001_rls_catalogo.sql).
DROP POLICY IF EXISTS "catalogo_select_publico" ON concremprodutos_aplicabilidade;
CREATE POLICY "catalogo_select_publico" ON concremprodutos_aplicabilidade
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "aplicabilidade_escrita_admin" ON concremprodutos_aplicabilidade;
CREATE POLICY "aplicabilidade_escrita_admin" ON concremprodutos_aplicabilidade
  FOR ALL TO authenticated
  USING (concremprodutos_is_admin())
  WITH CHECK (concremprodutos_is_admin());

GRANT SELECT ON concremprodutos_aplicabilidade TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON concremprodutos_aplicabilidade TO authenticated;

-- ---------------------------------------------------------------------
-- Seed: reproduz o que estava no código + o RODAPE que faltava
-- ---------------------------------------------------------------------
INSERT INTO concremprodutos_aplicabilidade (tipo_produto, campo)
VALUES
  -- ALIZAR: só revestimento, cor, altura, espessura e as medidas de alizar
  ('ALIZAR', 'movimento'), ('ALIZAR', 'enchimento'), ('ALIZAR', 'linha'),
  ('ALIZAR', 'perfil'), ('ALIZAR', 'protect_plus'), ('ALIZAR', 'veneziana'),
  ('ALIZAR', 'visor'), ('ALIZAR', 'largura_cm'), ('ALIZAR', 'batente_cm'),

  -- BATENTE: revestimento, cor, largura e espessura
  ('BATENTE', 'movimento'), ('BATENTE', 'enchimento'), ('BATENTE', 'linha'),
  ('BATENTE', 'perfil'), ('BATENTE', 'protect_plus'), ('BATENTE', 'veneziana'),
  ('BATENTE', 'visor'), ('BATENTE', 'altura_cm'), ('BATENTE', 'batente_cm'),
  ('BATENTE', 'alizar'),

  -- PORTA: a folha sozinha não leva batente nem alizar
  ('PORTA', 'batente_cm'), ('PORTA', 'alizar'),

  -- RODAPE: não abre, não tem enchimento nem linha de porta
  ('RODAPE', 'movimento'), ('RODAPE', 'enchimento'), ('RODAPE', 'linha'),
  ('RODAPE', 'batente_cm'), ('RODAPE', 'alizar')

ON CONFLICT (tipo_produto, campo) DO NOTHING;

-- KIT PORTA não entra: é cobrado por todos os campos.

-- Verificação:
-- SELECT tipo_produto, count(*) AS campos_que_nao_se_aplicam
--   FROM concremprodutos_aplicabilidade GROUP BY tipo_produto ORDER BY 1;
