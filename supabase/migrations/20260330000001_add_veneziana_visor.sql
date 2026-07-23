ALTER TABLE concremprodutos_produtos
  ADD COLUMN IF NOT EXISTS veneziana TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS visor     TEXT DEFAULT NULL;

INSERT INTO concremprodutos_opcoes_classificacao (campo, valor) VALUES
  ('veneziana', 'Sim'), ('veneziana', 'Não'),
  ('visor',     'Sim'), ('visor',     'Não')
ON CONFLICT (campo, valor) DO NOTHING;
