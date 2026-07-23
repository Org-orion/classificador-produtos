-- Rename perfil values from legacy abbreviations (LS/CC) to user-facing labels (Liso/Frisado)

BEGIN;

UPDATE concremprodutos_produtos
SET perfil = CASE perfil
  WHEN 'LS' THEN 'Liso'
  WHEN 'CC' THEN 'Frisado'
  ELSE perfil
END
WHERE perfil IN ('LS', 'CC');

UPDATE concremprodutos_regras_atributo
SET valor = CASE valor
  WHEN 'LS' THEN 'Liso'
  WHEN 'CC' THEN 'Frisado'
  ELSE valor
END
WHERE campo = 'perfil' AND valor IN ('LS', 'CC');

INSERT INTO concremprodutos_opcoes_classificacao (campo, valor, ativo)
VALUES
  ('perfil', 'Liso', true),
  ('perfil', 'Frisado', true)
ON CONFLICT (campo, valor) DO NOTHING;

DELETE FROM concremprodutos_opcoes_classificacao
WHERE campo = 'perfil' AND valor IN ('LS', 'CC');

COMMIT;
