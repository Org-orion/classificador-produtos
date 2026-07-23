-- ============================================================
-- Script consolidado para configurar o novo banco do zero
-- Execute no Supabase Dashboard → SQL Editor do novo projeto
-- ============================================================

-- ── Tabelas ──────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS concremprodutos_categorias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  descricao TEXT,
  cor TEXT DEFAULT '#6B7280',
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS concremprodutos_subcategorias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  categoria_id UUID NOT NULL REFERENCES concremprodutos_categorias(id) ON DELETE CASCADE,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS concremprodutos_produtos (
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
  protect_plus TEXT DEFAULT NULL,
  veneziana TEXT DEFAULT NULL,
  visor TEXT DEFAULT NULL,
  situacao TEXT DEFAULT 'pendente' CHECK (situacao IN ('pendente', 'classificado')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS concremprodutos_regras_classificacao (
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

CREATE TABLE IF NOT EXISTS concremprodutos_usuarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  nome TEXT NOT NULL,
  senha_hash TEXT NOT NULL,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS concremprodutos_opcoes_classificacao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campo TEXT NOT NULL,
  valor TEXT NOT NULL,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(campo, valor)
);

CREATE TABLE IF NOT EXISTS concremprodutos_regras_atributo (
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

-- ── Índice único para upsert de produtos ─────────────────────

CREATE UNIQUE INDEX IF NOT EXISTS idx_concremprodutos_produtos_codigo
  ON concremprodutos_produtos(codigo) WHERE codigo IS NOT NULL;

-- ── Trigger updated_at ────────────────────────────────────────

CREATE OR REPLACE FUNCTION concremprodutos_update_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_concremprodutos_produtos_updated_at') THEN
    CREATE TRIGGER trg_concremprodutos_produtos_updated_at
      BEFORE UPDATE ON concremprodutos_produtos
      FOR EACH ROW EXECUTE FUNCTION concremprodutos_update_updated_at();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_concremprodutos_regras_updated_at') THEN
    CREATE TRIGGER trg_concremprodutos_regras_updated_at
      BEFORE UPDATE ON concremprodutos_regras_classificacao
      FOR EACH ROW EXECUTE FUNCTION concremprodutos_update_updated_at();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_updated_at_regras_atributo') THEN
    CREATE TRIGGER set_updated_at_regras_atributo
      BEFORE UPDATE ON concremprodutos_regras_atributo
      FOR EACH ROW EXECUTE FUNCTION concremprodutos_update_updated_at();
  END IF;
END $$;

-- ── RLS ───────────────────────────────────────────────────────

ALTER TABLE concremprodutos_categorias           ENABLE ROW LEVEL SECURITY;
ALTER TABLE concremprodutos_subcategorias        ENABLE ROW LEVEL SECURITY;
ALTER TABLE concremprodutos_produtos             ENABLE ROW LEVEL SECURITY;
ALTER TABLE concremprodutos_regras_classificacao ENABLE ROW LEVEL SECURITY;
ALTER TABLE concremprodutos_usuarios             ENABLE ROW LEVEL SECURITY;
ALTER TABLE concremprodutos_opcoes_classificacao ENABLE ROW LEVEL SECURITY;
ALTER TABLE concremprodutos_regras_atributo      ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'allow_all_categorias') THEN
    CREATE POLICY "allow_all_categorias" ON concremprodutos_categorias FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'allow_all_subcategorias') THEN
    CREATE POLICY "allow_all_subcategorias" ON concremprodutos_subcategorias FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'allow_all_produtos') THEN
    CREATE POLICY "allow_all_produtos" ON concremprodutos_produtos FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'allow_all_regras') THEN
    CREATE POLICY "allow_all_regras" ON concremprodutos_regras_classificacao FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'allow_all_usuarios') THEN
    CREATE POLICY "allow_all_usuarios" ON concremprodutos_usuarios FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'allow_all' AND tablename = 'concremprodutos_opcoes_classificacao') THEN
    CREATE POLICY "allow_all" ON concremprodutos_opcoes_classificacao FOR ALL USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'allow_all' AND tablename = 'concremprodutos_regras_atributo') THEN
    CREATE POLICY "allow_all" ON concremprodutos_regras_atributo FOR ALL USING (true);
  END IF;
END $$;

-- ── Dados iniciais: opções de classificação (perfil já atualizado) ─────────

INSERT INTO concremprodutos_opcoes_classificacao (campo, valor) VALUES
  ('tipo_produto', 'KIT PORTA'),
  ('tipo_produto', 'FOLHA'),
  ('movimento',    'GIRO'),
  ('movimento',    'CORRER'),
  ('movimento',    'PIVÔ'),
  ('movimento',    'DUPLA'),
  ('enchimento',   'Sólida'),
  ('enchimento',   'Semi-oca'),
  ('enchimento',   'Sarrafo 3mm'),
  ('enchimento',   'Sarrafo 6mm'),
  ('revestimento', 'UV'),
  ('revestimento', 'Lacca Touch'),
  ('revestimento', 'Natura'),
  ('linha',        'Innovazione'),
  ('linha',        'Essenziale'),
  ('perfil',       'LISA'),
  ('perfil',       'FRISADA'),
  ('protect_plus', 'Sim'),
  ('protect_plus', 'Não'),
  ('veneziana',    'Sim'),
  ('veneziana',    'Não'),
  ('visor',        'Sim'),
  ('visor',        'Não')
ON CONFLICT (campo, valor) DO NOTHING;

-- ── Usuário admin ─────────────────────────────────────────────
-- Senha removida do repositório por segurança (era texto puro). Definir por
-- método seguro (Supabase Auth / Edge Function) — ver Cérebro — Segurança.

INSERT INTO concremprodutos_usuarios (email, nome, senha_hash, ativo)
VALUES ('adailton@infinitybi.com.br', 'Adailton', 'DEFINIR_SENHA_POR_METODO_SEGURO', true)
ON CONFLICT (email) DO NOTHING;

-- ── Regras de atributo ────────────────────────────────────────
-- campo: nome do campo na tabela de produtos
-- criterio: texto a buscar na descrição do produto
-- valor: valor a preencher no campo
-- tipo_match: 'contem' | 'comeca_com' | 'exato' | 'termina_com'

INSERT INTO concremprodutos_regras_atributo (campo, tipo_match, criterio, valor, prioridade, ativo) VALUES
  ('altura_cm',    'contem',     '210',        '210',          0, true),
  ('cor',          'contem',     'FENDI',       'FENDI',        0, true),
  ('cor',          'contem',     'URBAN',       'URBAN',        0, true),
  ('enchimento',   'contem',     'SARR. 3MM',   'Sarrafo 3mm',  0, true),
  ('enchimento',   'contem',     'SOLIDA',      'Sólida',       0, true),
  ('espessura_cm', 'contem',     '3,5CM',       '3.5',          0, true),
  ('largura_cm',   'contem',     'x90x',        '90',           0, true),
  ('largura_cm',   'contem',     'x60',         '60',           0, true),
  ('largura_cm',   'contem',     'x100x',       '100',          0, true),
  ('linha',        'contem',     'INNOV',       'Innovazione',  0, true),
  ('linha',        'contem',     'ESSENZ',      'Essenziale',   0, true),
  ('movimento',    'contem',     'CORRER',      'CORRER',       0, true),
  ('perfil',       'contem',     'LS',          'LISA',         0, true),
  ('revestimento', 'contem',     'LACCA TOUCH', 'Lacca Touch',  0, true),
  ('tipo_produto', 'comeca_com', 'KIT PORTA',   'KIT PORTA',    0, true),
  ('tipo_produto', 'comeca_com', 'PORTA',       'PORTA',        0, true),
  ('tipo_produto', 'comeca_com', 'BATENTE',     'BATENTE',      0, true),
  ('tipo_produto', 'comeca_com', 'ALIZAR',      'ALIZAR',       0, true);

-- ============================================================
-- Pronto! As tabelas de categorias, subcategorias e
-- regras de classificação estão vazias — use o script
-- migrate-db.mjs para copiar os dados do banco antigo,
-- ou cadastre pelo Admin.
-- ============================================================
