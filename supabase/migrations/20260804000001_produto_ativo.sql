-- =====================================================================
-- Inativação de produtos (produtos antigos / fora de linha)
-- =====================================================================
-- `situacao` responde "já foi classificado?"; `ativo` responde "ainda é
-- usado?". São eixos diferentes: um produto pode estar classificado e fora
-- de linha. Por isso uma coluna nova, e não um terceiro valor em `situacao`
-- (que tem CHECK IN ('pendente','classificado')).
--
-- Produto inativo:
--   • sai da tela de classificação (filtro "Uso" começa em "Ativos");
--   • não conta como incompleto nem entra no Aplicar Regras;
--   • deixa de ser publicado para o portal do representante (view abaixo).
--
-- ⚠️ Banco COMPARTILHADO (ctntlgvoefdbjxvfkahp): aplicar pelo SQL Editor,
-- NÃO por `supabase db push`.
-- =====================================================================

ALTER TABLE concremprodutos_produtos
  ADD COLUMN IF NOT EXISTS ativo BOOLEAN NOT NULL DEFAULT true;

COMMENT ON COLUMN concremprodutos_produtos.ativo IS
  'false = produto fora de linha: não aparece na classificação nem é publicado ao portal.';

-- A tela filtra por ativo + situacao; índice parcial cobre o caminho quente.
CREATE INDEX IF NOT EXISTS idx_concremprodutos_produtos_ativo
  ON concremprodutos_produtos (situacao)
  WHERE ativo;

-- ---------------------------------------------------------------------
-- Publicação: produto inativo não vai mais para o portal.
-- (mesma lista de colunas da Etapa 6 — só a cláusula WHERE muda)
-- ---------------------------------------------------------------------
CREATE OR REPLACE VIEW concremprodutos_catalogo_representantes
WITH (security_invoker = on) AS
SELECT
  id, codigo, descricao, unidade, tipo_produto, movimento, enchimento, linha, perfil,
  revestimento, cor, altura_cm, largura_cm, espessura_cm, batente_cm,
  protect_plus, veneziana, visor, situacao
FROM concremprodutos_produtos
WHERE situacao = 'classificado'
  AND ativo;

GRANT SELECT ON concremprodutos_catalogo_representantes TO anon, authenticated;

-- Verificação:
-- SELECT ativo, count(*) FROM concremprodutos_produtos GROUP BY ativo;
-- SELECT count(*) FROM concremprodutos_catalogo_representantes;
