-- =====================================================================
-- Regra de atributo "não contém" (match negativo)
-- =====================================================================
-- Permite dizer "se a descrição NÃO tem tal texto, então o campo vale X".
-- Caso de uso que motivou: KIT PORTA cuja descrição não traz "AL" não tem
-- alizar; sem isso o produto ficava eternamente incompleto, porque não havia
-- como declarar a AUSÊNCIA de uma característica — só a presença.
--
-- Convenção para medidas: valor 0 significa "não tem" (0 é um valor
-- preenchido, então o produto deixa de contar como incompleto).
--
-- ⚠️ Banco COMPARTILHADO (ctntlgvoefdbjxvfkahp): aplicar pelo SQL Editor,
-- NÃO por `supabase db push`.
-- =====================================================================

ALTER TABLE concremprodutos_regras_atributo
  DROP CONSTRAINT IF EXISTS concremprodutos_regras_atributo_tipo_match_check;

ALTER TABLE concremprodutos_regras_atributo
  ADD CONSTRAINT concremprodutos_regras_atributo_tipo_match_check
  CHECK (tipo_match IN ('contem', 'comeca_com', 'exato', 'termina_com', 'nao_contem'));

-- Verificação: deve listar os 5 tipos aceitos
-- SELECT pg_get_constraintdef(oid) FROM pg_constraint
--  WHERE conname = 'concremprodutos_regras_atributo_tipo_match_check';
