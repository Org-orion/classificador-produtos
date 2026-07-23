ALTER TABLE concremprodutos_produtos
  ADD COLUMN IF NOT EXISTS protect_plus TEXT DEFAULT NULL;

INSERT INTO concremprodutos_opcoes_classificacao (campo, valor)
VALUES ('protect_plus', 'Sim'), ('protect_plus', 'Não')
ON CONFLICT (campo, valor) DO NOTHING;
