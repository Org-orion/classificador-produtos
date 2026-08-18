-- =====================================================================
-- Impede opção de classificação repetida no mesmo campo
-- =====================================================================
-- A tela já bloqueia a duplicata na hora de salvar, mas isso não protege
-- contra dois admins salvando ao mesmo tempo nem contra INSERT via SQL.
-- O índice é a garantia de verdade.
--
-- Compara em caixa alta: "Branco" e "BRANCO" passam a colidir. Acento
-- continua distinguindo ("Colméia" ≠ "Colmeia") — a tela é mais rigorosa que
-- o índice e também ignora acento.
--
-- ⚠️ Banco COMPARTILHADO (ctntlgvoefdbjxvfkahp): aplicar pelo SQL Editor,
-- NÃO por `supabase db push`.
-- =====================================================================

-- PASSO 1 — rode isto ANTES. Se voltar alguma linha, existem duplicatas e a
-- criação do índice vai falhar; apague as sobrando e rode de novo até vir vazio.
--
--   SELECT campo, upper(valor) AS valor_norm, count(*) AS qtd, array_agg(id) AS ids
--     FROM concremprodutos_opcoes_classificacao
--    GROUP BY campo, upper(valor)
--   HAVING count(*) > 1
--    ORDER BY qtd DESC;

-- PASSO 2 — a trava
CREATE UNIQUE INDEX IF NOT EXISTS ux_concremprodutos_opcoes_campo_valor
  ON concremprodutos_opcoes_classificacao (campo, upper(valor));

-- Verificação: deve listar o índice
-- SELECT indexname FROM pg_indexes
--  WHERE tablename = 'concremprodutos_opcoes_classificacao';
