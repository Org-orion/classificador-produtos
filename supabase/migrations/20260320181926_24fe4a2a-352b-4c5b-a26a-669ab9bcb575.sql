-- Opções de classificação (campo + valores possíveis)
CREATE TABLE concremprodutos_opcoes_classificacao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campo TEXT NOT NULL,
  valor TEXT NOT NULL,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(campo, valor)
);

-- Regras de atributo (padrões de texto para preencher campos automaticamente)
CREATE TABLE concremprodutos_regras_atributo (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campo TEXT NOT NULL,
  valor TEXT NOT NULL,
  tipo_match TEXT NOT NULL DEFAULT 'contem' CHECK (tipo_match IN ('contem', 'comeca_com', 'exato', 'termina_com')),
  criterio TEXT NOT NULL,
  prioridade INTEGER DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE concremprodutos_opcoes_classificacao ENABLE ROW LEVEL SECURITY;
ALTER TABLE concremprodutos_regras_atributo ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow_all" ON concremprodutos_opcoes_classificacao FOR ALL USING (true);
CREATE POLICY "allow_all" ON concremprodutos_regras_atributo FOR ALL USING (true);

CREATE TRIGGER set_updated_at_regras_atributo
  BEFORE UPDATE ON concremprodutos_regras_atributo
  FOR EACH ROW EXECUTE FUNCTION concremprodutos_update_updated_at();

INSERT INTO concremprodutos_opcoes_classificacao (campo, valor) VALUES
  ('tipo_produto', 'KIT PORTA'), ('tipo_produto', 'FOLHA'),
  ('movimento', 'GIRO'), ('movimento', 'CORRER'), ('movimento', 'PIVÔ'), ('movimento', 'DUPLA'),
  ('enchimento', 'Sólida'), ('enchimento', 'Semi-oca'), ('enchimento', 'Sarrafo 3mm'), ('enchimento', 'Sarrafo 6mm'),
  ('revestimento', 'UV'), ('revestimento', 'Lacca Touch'), ('revestimento', 'Natura'),
  ('linha', 'Innovazione'), ('linha', 'Essenziale'),
  ('perfil', 'LS'), ('perfil', 'CC');