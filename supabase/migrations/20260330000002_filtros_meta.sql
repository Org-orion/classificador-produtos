-- ============================================================
-- Retorna a configuração completa de filtros para consumo
-- por aplicações externas.
--
-- Uso:
--   GET /rest/v1/rpc/concremprodutos_get_filtros
--   ou: supabase.rpc('concremprodutos_get_filtros')
--
-- Retorno: JSON array, um objeto por filtro:
--   {
--     "field":       nome da coluna na tabela de produtos,
--     "label":       rótulo de exibição,
--     "type":        "select" | "numeric" | "composite",
--     "applies_to":  array de tipo_produto, ou ["all"],
--     "options":     array de strings (vazio = dinâmico via produtos)
--   }
--
-- Para filtros com options=[], busque os valores distintos em:
--   SELECT DISTINCT <field> FROM concremprodutos_produtos
--   WHERE <field> IS NOT NULL
-- ============================================================

CREATE OR REPLACE FUNCTION concremprodutos_get_filtros()
RETURNS JSON
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  WITH opcoes AS (
    SELECT campo, ARRAY_AGG(valor ORDER BY valor) AS vals
    FROM concremprodutos_opcoes_classificacao
    WHERE ativo = true
    GROUP BY campo
  )
  SELECT JSON_AGG(f ORDER BY f.ordem)
  FROM (
    VALUES
      -- ── Tipo ────────────────────────────────────────────────
      (1,  'tipo_produto',  'Tipo',          'select',    ARRAY['all']::text[],
           (SELECT vals FROM opcoes WHERE campo = 'tipo_produto')),

      -- ── Atributos: todos exceto ALIZAR e BATENTE ────────────
      (2,  'movimento',     'Movimento',     'select',
           ARRAY['KIT PORTA','PORTA','FOLHA'],
           (SELECT vals FROM opcoes WHERE campo = 'movimento')),

      (3,  'enchimento',    'Enchimento',    'select',
           ARRAY['KIT PORTA','PORTA','FOLHA'],
           (SELECT vals FROM opcoes WHERE campo = 'enchimento')),

      (4,  'revestimento',  'Revestimento',  'select',
           ARRAY['KIT PORTA','PORTA','FOLHA','ALIZAR'],
           (SELECT vals FROM opcoes WHERE campo = 'revestimento')),

      (5,  'linha',         'Linha',         'select',
           ARRAY['KIT PORTA','PORTA','FOLHA'],
           (SELECT vals FROM opcoes WHERE campo = 'linha')),

      (6,  'perfil',        'Liso/Frisado',  'select',
           ARRAY['KIT PORTA','PORTA','FOLHA'],
           (SELECT vals FROM opcoes WHERE campo = 'perfil')),

      (7,  'cor',           'Cor',           'select',
           ARRAY['KIT PORTA','PORTA','FOLHA','ALIZAR'],
           ARRAY[]::text[]),   -- dinâmico: SELECT DISTINCT cor FROM produtos

      (8,  'protect_plus',  'Protect+',      'select',
           ARRAY['KIT PORTA','PORTA','FOLHA'],
           ARRAY['Sim','Não']),

      (9,  'veneziana',     'Veneziana',     'select',
           ARRAY['KIT PORTA','PORTA','FOLHA'],
           ARRAY['Sim','Não']),

      (10, 'visor',         'Visor',         'select',
           ARRAY['KIT PORTA','PORTA','FOLHA'],
           ARRAY['Sim','Não']),

      -- ── Dimensões ────────────────────────────────────────────
      (11, 'altura_cm',     'Altura (cm)',   'numeric',
           ARRAY['KIT PORTA','PORTA','FOLHA','ALIZAR'],
           ARRAY[]::text[]),   -- dinâmico

      (12, 'largura_cm',    'Largura (cm)',  'numeric',
           ARRAY['all']::text[],
           ARRAY[]::text[]),   -- dinâmico

      (13, 'espessura_cm',  'Espessura (cm)','numeric',
           ARRAY['all']::text[],
           ARRAY[]::text[]),   -- dinâmico

      -- ── Batente e Alizar: só KIT PORTA ───────────────────────
      (14, 'batente_cm',    'Batente (cm)',  'numeric',
           ARRAY['KIT PORTA'],
           ARRAY[]::text[]),   -- dinâmico

      -- Alizar é composto: filtrar por alizar_l+alizar_a juntos
      -- Format de exibição: "{alizar_l}x{alizar_a}"
      (15, 'alizar',        'Alizar',        'composite',
           ARRAY['KIT PORTA'],
           ARRAY[]::text[]),   -- dinâmico via: SELECT DISTINCT alizar_l, alizar_a FROM produtos

      -- ── Status ───────────────────────────────────────────────
      (16, 'situacao',      'Status',        'select',
           ARRAY['all']::text[],
           ARRAY['pendente','classificado'])

  ) AS f(ordem, field, label, type, applies_to, options)
$$;

-- Política de acesso (anon pode chamar)
GRANT EXECUTE ON FUNCTION concremprodutos_get_filtros() TO anon, authenticated;
