-- =====================================================================
-- Origem de cada campo do produto: regra ou manual
-- =====================================================================
-- Guarda a lista de campos que foram preenchidos pelo motor de regras.
-- Campo editado à mão SAI da lista e passa a ser intocável.
--
-- É o que permite o botão "Revisão": limpar só o que veio de regra,
-- reaplicar as regras ativas e recalcular a situação — sem destruir
-- classificação manual. Sem isso não há como distinguir as duas origens.
--
-- ⚠️ Banco COMPARTILHADO (ctntlgvoefdbjxvfkahp): aplicar pelo SQL Editor,
-- NÃO por `supabase db push`.
-- =====================================================================

ALTER TABLE concremprodutos_produtos
  ADD COLUMN IF NOT EXISTS campos_regra TEXT[] NOT NULL DEFAULT '{}';

COMMENT ON COLUMN concremprodutos_produtos.campos_regra IS
  'Campos preenchidos pelo motor de regras. Edição manual remove o campo da lista. Usado pelo botão Revisão.';

-- Verificação:
-- SELECT column_name, data_type, column_default
--   FROM information_schema.columns
--  WHERE table_name = 'concremprodutos_produtos' AND column_name = 'campos_regra';
