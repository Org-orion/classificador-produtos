-- =====================================================================
-- Etapa 6: view de publicação para o app dos representantes.
-- =====================================================================
-- Expõe SOMENTE produtos publicados (situacao='classificado') com as MESMAS
-- colunas que o app já lê hoje (src/services/produtos.ts) — troca de fonte fica
-- 1 linha no app: .from('concremprodutos_produtos') -> a view.
-- NÃO expõe `preco` (preservado na tabela, intocado). security_invoker=on faz a
-- view respeitar a RLS da tabela base (leitura pública já permitida ao portal).
--
-- ⚠️ Mudança de comportamento: hoje o app lê TODOS os produtos; pela view passa
-- a ver só os 'classificado'. Testar "pendente não aparece / aprovado aparece"
-- antes de trocar a fonte do app (Etapa 6, com autorização).
-- =====================================================================

CREATE OR REPLACE VIEW concremprodutos_catalogo_representantes
WITH (security_invoker = on) AS
SELECT
  id, codigo, descricao, unidade, tipo_produto, movimento, enchimento, linha, perfil,
  revestimento, cor, altura_cm, largura_cm, espessura_cm, batente_cm,
  protect_plus, veneziana, visor, situacao
FROM concremprodutos_produtos
WHERE situacao = 'classificado';

GRANT SELECT ON concremprodutos_catalogo_representantes TO anon, authenticated;
