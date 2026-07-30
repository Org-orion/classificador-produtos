-- =====================================================================
-- Etapa 6: seed CONSERVADOR das 5 regras de família (regras_v2).
-- =====================================================================
-- Decisão #3: classificar SÓ o que a descrição diz explicitamente; nada
-- inventado. Confiança 0.90 de propósito → cai em PENDENTE_REVISAO (não
-- auto-publica): a família é identificada, mas passa por revisão humana antes
-- de ir ao catálogo. Regras finas (dimensões, revestimento, etc.) virão do
-- vault (Etapa 7). Precedência: KIT PORTA (interromper) vence PORTA.
-- Idempotente por `nome`.
-- =====================================================================

INSERT INTO concremprodutos_regras_v2 (nome, familia, condicoes_json, resultados_json, prioridade, confianca, interromper_processamento, documento_origem)
SELECT * FROM (VALUES
  ('seed:familia:KIT_PORTA', 'KIT_PORTA',
   '{"operador":"AND","itens":[{"campo":"descricao_normalizada","operador":"CONTAINS","valor":"KIT PORTA"}]}'::jsonb,
   '{"familia":"KIT_PORTA"}'::jsonb, 50, 0.90, true, 'seed'),
  ('seed:familia:PORTA', 'PORTA',
   '{"operador":"AND","itens":[{"campo":"descricao_normalizada","operador":"CONTAINS","valor":"PORTA"}]}'::jsonb,
   '{"familia":"PORTA"}'::jsonb, 40, 0.90, false, 'seed'),
  ('seed:familia:ALISAR', 'ALISAR',
   '{"operador":"AND","itens":[{"campo":"descricao_normalizada","operador":"ANY_TERMS","valor":["ALIZAR","ALISAR"]}]}'::jsonb,
   '{"familia":"ALISAR"}'::jsonb, 30, 0.90, false, 'seed'),
  ('seed:familia:BATENTE', 'BATENTE',
   '{"operador":"AND","itens":[{"campo":"descricao_normalizada","operador":"CONTAINS","valor":"BATENTE"}]}'::jsonb,
   '{"familia":"BATENTE"}'::jsonb, 30, 0.90, false, 'seed'),
  ('seed:familia:RODAPE', 'RODAPE',
   '{"operador":"AND","itens":[{"campo":"descricao_normalizada","operador":"CONTAINS","valor":"RODAPE"}]}'::jsonb,
   '{"familia":"RODAPE"}'::jsonb, 30, 0.90, false, 'seed')
) AS v(nome, familia, condicoes_json, resultados_json, prioridade, confianca, interromper_processamento, documento_origem)
WHERE NOT EXISTS (SELECT 1 FROM concremprodutos_regras_v2 r WHERE r.nome = v.nome);
