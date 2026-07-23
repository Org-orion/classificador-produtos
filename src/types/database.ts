export interface Categoria {
  id: string;
  nome: string;
  descricao: string | null;
  cor: string;
  ativo: boolean;
  created_at: string;
}

export interface Subcategoria {
  id: string;
  nome: string;
  categoria_id: string;
  ativo: boolean;
  created_at: string;
}

export interface Produto {
  id: string;
  codigo: string | null;
  descricao: string;
  unidade: string | null;
  codigo_barras: string | null;
  preco: number | null;
  tipo_produto: string | null;
  movimento: string | null;
  linha: string | null;
  perfil: string | null;
  enchimento: string | null;
  revestimento: string | null;
  cor: string | null;
  altura_cm: number | null;
  largura_cm: number | null;
  espessura_cm: number | null;
  batente_cm: number | null;
  batente_tipo: string | null;
  alizar_l: number | null;
  alizar_a: number | null;
  alizar_e: number | null;
  protect_plus: string | null;
  veneziana: string | null;
  visor: string | null;
  tem_bandeira: boolean;
  tem_visor: boolean;
  tem_veneziana: boolean;
  categoria_id: string | null;
  subcategoria_id: string | null;
  situacao: string;
  created_at: string;
  updated_at: string;
}

export interface RegraClassificacao {
  id: string;
  tipo: string;
  criterio: string;
  categoria_id: string | null;
  subcategoria_id: string | null;
  prioridade: number;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface OpcaoClassificacao {
  id: string;
  campo: string;
  valor: string;
  ativo: boolean;
  created_at: string;
}

export interface RegraAtributo {
  id: string;
  campo: string;
  valor: string;
  tipo_match: string;
  criterio: string;
  prioridade: number;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export type PapelUsuario = 'admin' | 'editor';

export interface Usuario {
  id: string;
  email: string;
  nome: string;
  /** id do usuário no auth.users compartilhado (Supabase Auth). */
  auth_user_id: string | null;
  /** e-mail real de autenticação. */
  auth_email: string | null;
  papel: PapelUsuario;
  /** proprietário inicial do sistema — condição protegida. */
  proprietario: boolean;
  ativo: boolean;
  created_at: string;
}

/** Perfil do usuário autenticado, carregado após o login (Supabase Auth). */
export interface PerfilAtual {
  id: string;
  nome: string;
  email: string;
  papel: PapelUsuario;
  proprietario: boolean;
  ativo: boolean;
}
