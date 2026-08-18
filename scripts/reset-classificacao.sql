-- =====================================================================
-- RESET da classificação — operação de uma vez só
-- =====================================================================
-- Zera os campos preenchíveis por regra em TODOS os produtos e devolve
-- todo mundo para 'pendente', para que "Aplicar Regras" refaça a
-- classificação do zero e registre a origem de cada campo em
-- `campos_regra`. A partir daí o botão "Revisão" passa a funcionar.
--
-- ⚠️ DESTRUTIVO E SEM UNDO. Só faz sentido porque toda a classificação
--    atual veio de regra. Se houver ajuste manual no meio, ele se perde.
--
-- ⚠️ FAÇA BACKUP ANTES (Supabase → Database → Backups, ou um dump).
--
-- ⚠️ Enquanto os produtos estiverem pendentes, a view de publicação fica
--    vazia — o portal do representante não vê nenhum produto até o
--    "Aplicar Regras" terminar. Rode em janela combinada.
--
-- Pré-requisito: migration 20260805000000_origem_campos.sql aplicada.
-- =====================================================================

-- ---------------------------------------------------------------------
-- PASSO 1 — o que existe hoje (só consulta, rode antes e guarde o número)
-- ---------------------------------------------------------------------
-- SELECT situacao, count(*) FROM concremprodutos_produtos GROUP BY situacao;
-- SELECT count(*) AS com_tipo FROM concremprodutos_produtos WHERE tipo_produto IS NOT NULL;

-- ---------------------------------------------------------------------
-- PASSO 2 — `tipo_produto` é reposto por regra?
-- ---------------------------------------------------------------------
-- O reset NÃO limpa tipo_produto de propósito: ele é a chave de tudo (define
-- quais campos se aplicam, e quais medidas o parser lê). Nos produtos vindos
-- de importação ele foi preenchido pelo parser, que NÃO roda no "Aplicar
-- Regras" — limpar deixaria o produto sem tipo e sem quem o repusesse.
--
-- Se a consulta abaixo devolver 0, mantenha como está.
--
-- SELECT count(*) FROM concremprodutos_regras_atributo
--  WHERE campo = 'tipo_produto' AND ativo;

-- ---------------------------------------------------------------------
-- PASSO 3 — o reset
-- ---------------------------------------------------------------------
UPDATE concremprodutos_produtos
   SET movimento     = NULL,
       enchimento    = NULL,
       revestimento  = NULL,
       linha         = NULL,
       perfil        = NULL,
       cor           = NULL,
       protect_plus  = NULL,
       veneziana     = NULL,
       visor         = NULL,
       altura_cm     = NULL,
       largura_cm    = NULL,
       espessura_cm  = NULL,
       batente_cm    = NULL,
       alizar_l      = NULL,
       alizar_a      = NULL,
       alizar_e      = NULL,
       categoria_id     = NULL,
       subcategoria_id  = NULL,
       campos_regra  = '{}',
       situacao      = 'pendente';

-- Preservados de propósito: codigo, descricao, unidade, codigo_barras, preco,
-- tipo_produto, ativo.

-- ---------------------------------------------------------------------
-- PASSO 4 — conferir e reclassificar
-- ---------------------------------------------------------------------
-- SELECT situacao, count(*) FROM concremprodutos_produtos GROUP BY situacao;
--   → tudo deve estar 'pendente'
--
-- Agora, na tela: Classificação → Aplicar Regras (aba aberta até terminar).
-- Ao fim, `campos_regra` estará preenchido e o botão Revisão fica útil.
