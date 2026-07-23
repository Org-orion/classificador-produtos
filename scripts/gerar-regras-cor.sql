-- ============================================================
-- Gera todas as regras de atributo automaticamente
-- a partir das opções de classificação cadastradas.
--
-- Execute no Supabase SQL Editor.
-- Seguro rodar mais de uma vez (ON CONFLICT ignora duplicatas).
--
-- Campos cobertos:
--   cor         → contém o nome da cor
--   revestimento→ contém o nome do revestimento
--   enchimento  → contém o nome do enchimento
--   linha       → contém o nome da linha (INNOV. / ESSENZ.)
--   perfil      → contém " LS " ou " CC " (com espaços para evitar falsos positivos)
--   movimento   → começa_com o tipo de movimento
--   protect_plus→ contém "PROTECT+" → Sim  (Não é padrão, não precisa de regra)
--   veneziana   → contém "VENEZ."   → Sim
--   visor       → contém "C/ VISOR" → Sim
-- ============================================================

BEGIN;

-- ── COR ─────────────────────────────────────────────────────
INSERT INTO concremprodutos_regras_atributo
  (campo, valor, tipo_match, criterio, prioridade, ativo)
SELECT 'cor', valor, 'contem', valor, 0, true
FROM concremprodutos_opcoes_classificacao
WHERE campo = 'cor' AND ativo = true
ON CONFLICT DO NOTHING;

-- ── REVESTIMENTO ─────────────────────────────────────────────
INSERT INTO concremprodutos_regras_atributo
  (campo, valor, tipo_match, criterio, prioridade, ativo)
SELECT 'revestimento', valor, 'contem', valor, 0, true
FROM concremprodutos_opcoes_classificacao
WHERE campo = 'revestimento' AND ativo = true
ON CONFLICT DO NOTHING;

-- ── ENCHIMENTO ───────────────────────────────────────────────
-- Mapeamento especial: valor exibido ≠ texto na descrição
INSERT INTO concremprodutos_regras_atributo
  (campo, valor, tipo_match, criterio, prioridade, ativo)
VALUES
  ('enchimento', 'Sarrafo 3mm', 'contem', 'SARR. 3MM', 10, true),
  ('enchimento', 'Sarrafo 6mm', 'contem', 'SARR. 6MM', 10, true),
  ('enchimento', 'Semi-oca',    'contem', 'SEMI-OCA',  10, true),
  ('enchimento', 'Sólida',      'contem', 'SOLIDA',    10, true)
ON CONFLICT DO NOTHING;

-- ── LINHA ────────────────────────────────────────────────────
-- Mapeamento especial: abreviações na descrição
INSERT INTO concremprodutos_regras_atributo
  (campo, valor, tipo_match, criterio, prioridade, ativo)
VALUES
  ('linha', 'Innovazione', 'contem', 'INNOV.',  10, true),
  ('linha', 'Essenziale',  'contem', 'ESSENZ.', 10, true)
ON CONFLICT DO NOTHING;

-- ── PERFIL ───────────────────────────────────────────────────
-- Busca com espaços para evitar bater em "ALIZAR", "LACCA", etc.
INSERT INTO concremprodutos_regras_atributo
  (campo, valor, tipo_match, criterio, prioridade, ativo)
VALUES
  ('perfil', 'LISA',    'contem', ' LS ', 10, true),
  ('perfil', 'FRISADA', 'contem', ' CC ', 10, true)
ON CONFLICT DO NOTHING;

-- ── MOVIMENTO ────────────────────────────────────────────────
INSERT INTO concremprodutos_regras_atributo
  (campo, valor, tipo_match, criterio, prioridade, ativo)
VALUES
  ('movimento', 'CORRER', 'contem', 'CORRER', 10, true),
  ('movimento', 'PIVÔ',   'contem', 'PIVÔ',   10, true),
  ('movimento', 'PIVÔ',   'contem', 'PIVO',   10, true),
  ('movimento', 'DUPLA',  'contem', 'DUPLA',  10, true),
  ('movimento', 'GIRO',   'contem', 'GIRO',   10, true)
ON CONFLICT DO NOTHING;

-- ── PROTECT+ / VENEZIANA / VISOR (só Sim — Não é padrão) ────
INSERT INTO concremprodutos_regras_atributo
  (campo, valor, tipo_match, criterio, prioridade, ativo)
VALUES
  ('protect_plus', 'Sim', 'contem', 'PROTECT+',  10, true),
  ('veneziana',    'Sim', 'contem', 'VENEZ.',     10, true),
  ('visor',        'Sim', 'contem', 'C/ VISOR',   10, true)
ON CONFLICT DO NOTHING;

COMMIT;

-- ── Resumo do que foi criado ─────────────────────────────────
SELECT
  campo,
  COUNT(*) AS total_regras
FROM concremprodutos_regras_atributo
WHERE ativo = true
GROUP BY campo
ORDER BY campo;
