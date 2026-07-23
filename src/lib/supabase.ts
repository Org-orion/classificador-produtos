import { supabase } from '@/integrations/supabase/client';

export { supabase };

export async function fetchAllProdutos(filters?: {
  busca?: string;
  tipo_produto?: string;
  movimento?: string;
  enchimento?: string;
  revestimento?: string;
  categoria_id?: string;
  situacao?: string;
}) {
  let all: any[] = [];
  let from = 0;
  const PAGE = 1000;

  while (true) {
    let query = supabase
      .from('concremprodutos_produtos')
      .select('*')
      .range(from, from + PAGE - 1)
      .order('created_at', { ascending: false });

    if (filters?.tipo_produto) query = query.eq('tipo_produto', filters.tipo_produto);
    if (filters?.movimento) query = query.eq('movimento', filters.movimento);
    if (filters?.enchimento) query = query.eq('enchimento', filters.enchimento);
    if (filters?.revestimento) query = query.eq('revestimento', filters.revestimento);
    if (filters?.categoria_id) query = query.eq('categoria_id', filters.categoria_id);
    if (filters?.situacao) query = query.eq('situacao', filters.situacao);
    if (filters?.busca) {
      query = query.or(`codigo.ilike.%${filters.busca}%,descricao.ilike.%${filters.busca}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    if (!data || data.length === 0) break;
    all = [...all, ...data];
    if (data.length < PAGE) break;
    from += PAGE;
  }
  return all;
}

export async function fetchAllCategorias() {
  const { data, error } = await supabase
    .from('concremprodutos_categorias')
    .select('*')
    .order('nome');
  if (error) throw error;
  return data || [];
}

export async function fetchAllSubcategorias() {
  const { data, error } = await supabase
    .from('concremprodutos_subcategorias')
    .select('*')
    .order('nome');
  if (error) throw error;
  return data || [];
}

export async function fetchAllRegras() {
  const { data, error } = await supabase
    .from('concremprodutos_regras_classificacao')
    .select('*')
    .order('prioridade', { ascending: false });
  if (error) throw error;
  return data || [];
}
