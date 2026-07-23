-- =====================================================================
-- Arquitetura de segurança — Fase 3: RLS das tabelas de catálogo/regras
-- =====================================================================
-- Fecha o buraco crítico: hoje todas essas tabelas têm policy
-- `allow_all ... USING(true) WITH CHECK(true)`, ou seja, qualquer portador da
-- chave anon (pública no bundle) LÊ e ESCREVE todo o catálogo.
--
-- Decisão portal-safe (Cérebro — Hierarquia N1 + Padrões Supabase §10):
--   - LEITURA (SELECT): permanece aberta a anon + authenticated. Motivo: a
--     tabela concremprodutos_produtos é lida pelo portal do representante
--     (AppRepresentantes), possivelmente via chave anon. Apertar a leitura
--     depende de confirmar como o portal acessa o catálogo — decisão registrada
--     como PENDENTE (ver CLAUDE.md). NÃO reduzimos a leitura nesta fase para
--     não quebrar o portal.
--   - ESCRITA (INSERT/UPDATE/DELETE): deixa de existir para anon.
--       * produtos  -> admin OU editor (classificação)  [concremprodutos_can_edit()]
--       * catálogo/regras -> apenas admin               [concremprodutos_is_admin()]
--
-- Depende da Fase 2 (funções helper). Aplicação remota EXIGE autorização e a
-- confirmação de que o portal continua lendo (teste de não-regressão).
-- =====================================================================

-- Remove as policies permissivas antigas -----------------------------------
DROP POLICY IF EXISTS "allow_all_categorias"    ON concremprodutos_categorias;
DROP POLICY IF EXISTS "allow_all_subcategorias" ON concremprodutos_subcategorias;
DROP POLICY IF EXISTS "allow_all_produtos"      ON concremprodutos_produtos;
DROP POLICY IF EXISTS "allow_all_regras"        ON concremprodutos_regras_classificacao;
DROP POLICY IF EXISTS "allow_all"               ON concremprodutos_opcoes_classificacao;
DROP POLICY IF EXISTS "allow_all"               ON concremprodutos_regras_atributo;

-- Garante RLS habilitada (idempotente) -------------------------------------
ALTER TABLE concremprodutos_categorias          ENABLE ROW LEVEL SECURITY;
ALTER TABLE concremprodutos_subcategorias       ENABLE ROW LEVEL SECURITY;
ALTER TABLE concremprodutos_produtos            ENABLE ROW LEVEL SECURITY;
ALTER TABLE concremprodutos_regras_classificacao ENABLE ROW LEVEL SECURITY;
ALTER TABLE concremprodutos_opcoes_classificacao ENABLE ROW LEVEL SECURITY;
ALTER TABLE concremprodutos_regras_atributo     ENABLE ROW LEVEL SECURITY;

-- =====================================================================
-- LEITURA pública (anon + authenticated) — preserva o portal
-- =====================================================================
DROP POLICY IF EXISTS "catalogo_select_publico" ON concremprodutos_categorias;
CREATE POLICY "catalogo_select_publico" ON concremprodutos_categorias
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "catalogo_select_publico" ON concremprodutos_subcategorias;
CREATE POLICY "catalogo_select_publico" ON concremprodutos_subcategorias
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "catalogo_select_publico" ON concremprodutos_produtos;
CREATE POLICY "catalogo_select_publico" ON concremprodutos_produtos
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "catalogo_select_publico" ON concremprodutos_regras_classificacao;
CREATE POLICY "catalogo_select_publico" ON concremprodutos_regras_classificacao
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "catalogo_select_publico" ON concremprodutos_opcoes_classificacao;
CREATE POLICY "catalogo_select_publico" ON concremprodutos_opcoes_classificacao
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "catalogo_select_publico" ON concremprodutos_regras_atributo;
CREATE POLICY "catalogo_select_publico" ON concremprodutos_regras_atributo
  FOR SELECT TO anon, authenticated USING (true);

-- =====================================================================
-- ESCRITA em PRODUTOS — admin OU editor (classificação)
-- =====================================================================
DROP POLICY IF EXISTS "produtos_insert_edit" ON concremprodutos_produtos;
CREATE POLICY "produtos_insert_edit" ON concremprodutos_produtos
  FOR INSERT TO authenticated WITH CHECK (concremprodutos_can_edit());

DROP POLICY IF EXISTS "produtos_update_edit" ON concremprodutos_produtos;
CREATE POLICY "produtos_update_edit" ON concremprodutos_produtos
  FOR UPDATE TO authenticated
  USING (concremprodutos_can_edit()) WITH CHECK (concremprodutos_can_edit());

DROP POLICY IF EXISTS "produtos_delete_edit" ON concremprodutos_produtos;
CREATE POLICY "produtos_delete_edit" ON concremprodutos_produtos
  FOR DELETE TO authenticated USING (concremprodutos_can_edit());

-- =====================================================================
-- ESCRITA em CATÁLOGO e REGRAS — apenas admin
-- =====================================================================
-- Helper de macro para as 5 tabelas administrativas via DO block.
DO $$
DECLARE
  t TEXT;
  tabelas TEXT[] := ARRAY[
    'concremprodutos_categorias',
    'concremprodutos_subcategorias',
    'concremprodutos_regras_classificacao',
    'concremprodutos_opcoes_classificacao',
    'concremprodutos_regras_atributo'
  ];
BEGIN
  FOREACH t IN ARRAY tabelas LOOP
    EXECUTE format('DROP POLICY IF EXISTS "%s_insert_admin" ON %I;', t, t);
    EXECUTE format(
      'CREATE POLICY "%s_insert_admin" ON %I FOR INSERT TO authenticated WITH CHECK (concremprodutos_is_admin());',
      t, t);

    EXECUTE format('DROP POLICY IF EXISTS "%s_update_admin" ON %I;', t, t);
    EXECUTE format(
      'CREATE POLICY "%s_update_admin" ON %I FOR UPDATE TO authenticated USING (concremprodutos_is_admin()) WITH CHECK (concremprodutos_is_admin());',
      t, t);

    EXECUTE format('DROP POLICY IF EXISTS "%s_delete_admin" ON %I;', t, t);
    EXECUTE format(
      'CREATE POLICY "%s_delete_admin" ON %I FOR DELETE TO authenticated USING (concremprodutos_is_admin());',
      t, t);
  END LOOP;
END $$;

-- Nota de desempenho (Cérebro — Padrões Supabase §10): as funções helper usam
-- (SELECT auth.uid()) e são STABLE; ainda assim, se o volume crescer, avaliar
-- índice em concremprodutos_usuarios(auth_id) — já criado na Fase 2.
