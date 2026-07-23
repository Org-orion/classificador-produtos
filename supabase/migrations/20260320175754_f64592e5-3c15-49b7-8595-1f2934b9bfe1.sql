
-- Categorias principais
CREATE TABLE concremprodutos_categorias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  descricao TEXT,
  cor TEXT DEFAULT '#6B7280',
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Subcategorias
CREATE TABLE concremprodutos_subcategorias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  categoria_id UUID NOT NULL REFERENCES concremprodutos_categorias(id) ON DELETE CASCADE,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Produtos
CREATE TABLE concremprodutos_produtos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo TEXT,
  descricao TEXT NOT NULL,
  unidade TEXT,
  codigo_barras TEXT,
  preco NUMERIC(15,2),
  tipo_produto TEXT,
  movimento TEXT,
  linha TEXT,
  perfil TEXT,
  enchimento TEXT,
  revestimento TEXT,
  cor TEXT,
  altura_cm NUMERIC(8,2),
  largura_cm NUMERIC(8,2),
  espessura_cm NUMERIC(8,2),
  batente_cm NUMERIC(8,2),
  batente_tipo TEXT,
  alizar_l NUMERIC(8,2),
  alizar_a NUMERIC(8,2),
  alizar_e NUMERIC(8,2),
  tem_bandeira BOOLEAN DEFAULT false,
  tem_visor BOOLEAN DEFAULT false,
  tem_veneziana BOOLEAN DEFAULT false,
  categoria_id UUID REFERENCES concremprodutos_categorias(id),
  subcategoria_id UUID REFERENCES concremprodutos_subcategorias(id),
  situacao TEXT DEFAULT 'pendente' CHECK (situacao IN ('pendente', 'classificado')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Regras de classificação
CREATE TABLE concremprodutos_regras_classificacao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo TEXT NOT NULL CHECK (tipo IN ('codigo', 'descricao')),
  criterio TEXT NOT NULL,
  categoria_id UUID REFERENCES concremprodutos_categorias(id),
  subcategoria_id UUID REFERENCES concremprodutos_subcategorias(id),
  prioridade INTEGER DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Usuários
CREATE TABLE concremprodutos_usuarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  nome TEXT NOT NULL,
  senha_hash TEXT NOT NULL,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE concremprodutos_categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE concremprodutos_subcategorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE concremprodutos_produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE concremprodutos_regras_classificacao ENABLE ROW LEVEL SECURITY;
ALTER TABLE concremprodutos_usuarios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow_all_categorias" ON concremprodutos_categorias FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_subcategorias" ON concremprodutos_subcategorias FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_produtos" ON concremprodutos_produtos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_regras" ON concremprodutos_regras_classificacao FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_usuarios" ON concremprodutos_usuarios FOR ALL USING (true) WITH CHECK (true);

-- Unique index on codigo for upsert
CREATE UNIQUE INDEX idx_concremprodutos_produtos_codigo ON concremprodutos_produtos(codigo) WHERE codigo IS NOT NULL;

-- Trigger updated_at
CREATE OR REPLACE FUNCTION concremprodutos_update_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_concremprodutos_produtos_updated_at
  BEFORE UPDATE ON concremprodutos_produtos
  FOR EACH ROW EXECUTE FUNCTION concremprodutos_update_updated_at();

CREATE TRIGGER trg_concremprodutos_regras_updated_at
  BEFORE UPDATE ON concremprodutos_regras_classificacao
  FOR EACH ROW EXECUTE FUNCTION concremprodutos_update_updated_at();

-- Admin user
-- Senha removida do repositório por segurança (era texto puro). Definir a senha
-- por método seguro (Supabase Auth / Edge Function) — ver Cérebro — Segurança.
INSERT INTO concremprodutos_usuarios (email, nome, senha_hash)
VALUES ('adailton@infinitybi.com.br', 'Adailton', 'DEFINIR_SENHA_POR_METODO_SEGURO');
