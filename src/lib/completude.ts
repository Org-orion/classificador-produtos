/**
 * Quais campos um produto precisa ter preenchido, e o que decorre disso.
 *
 * Esta é a regra que define o `situacao` do produto — e, por consequência, o que
 * a view de publicação entrega ao portal do representante (só 'classificado').
 * Fica em lib, e não na tela, para poder ser testada.
 */
import { Produto } from '@/types/database';

export const ATTR_FIELDS = [
  'tipo_produto', 'movimento', 'enchimento', 'revestimento', 'linha',
  'perfil', 'cor', 'protect_plus', 'veneziana', 'visor',
] as const;

export const DIM_FIELDS = ['altura_cm', 'largura_cm', 'espessura_cm'] as const;

export type AttrField = typeof ATTR_FIELDS[number];

// Campos que NÃO se aplicam a cada tipo de produto
// ALIZAR  → revestimento, cor + dimensões (alt×esp) + alizar (L×regulagem)
// BATENTE → revestimento, cor + dimensões (larg×esp)
// demais  → tudo
const HIDDEN_ATTR: Record<string, Set<string>> = {
  ALIZAR:  new Set(['movimento', 'enchimento', 'linha', 'perfil', 'protect_plus', 'veneziana', 'visor']),
  BATENTE: new Set(['movimento', 'enchimento', 'linha', 'perfil', 'protect_plus', 'veneziana', 'visor']),
};
const HIDDEN_DIM: Record<string, Set<string>> = {
  BATENTE: new Set(['altura_cm']),
  ALIZAR:  new Set(['largura_cm']),  // largura aparece no campo Alizar (L × regulagem)
};

const tipoDe = (tipo: string | null | undefined) => (tipo || '').toUpperCase().trim();

export const isBlank = (v: unknown) => v === null || v === undefined || v === '';

/** Produto fora de linha. `ativo` undefined (base sem a migration) = ativo. */
export const inativo = (p: Produto) => p.ativo === false;

export function attrVisible(tipo: string | null | undefined, field: string) {
  return !HIDDEN_ATTR[tipoDe(tipo)]?.has(field);
}
export function dimVisible(tipo: string | null | undefined, field: string) {
  return !HIDDEN_DIM[tipoDe(tipo)]?.has(field);
}
/** Alizar aparece no KIT PORTA (bat+alizar inclusos) e no ALIZAR (largura×regulagem). */
export function alizarColVisible(tipo: string | null | undefined) {
  const t = tipoDe(tipo);
  return t === 'KIT PORTA' || t === 'ALIZAR';
}
/** Batente é medida só do KIT PORTA. */
export function batenteColVisible(tipo: string | null | undefined) {
  return tipoDe(tipo) === 'KIT PORTA';
}

/**
 * Campos que ainda faltam preencher, considerando só o que se aplica ao tipo.
 * Medida com 0 conta como preenchida: 0 significa "não tem" (ver regras
 * "não contém" em lib/match-regras).
 */
export function camposFaltando(p: Produto): string[] {
  const tipo = p.tipo_produto;
  const campos = p as unknown as Record<string, unknown>;
  const faltando: string[] = [];

  for (const f of ATTR_FIELDS) {
    if (!attrVisible(tipo, f)) continue;
    if (isBlank(campos[f])) faltando.push(f);
  }
  for (const f of DIM_FIELDS) {
    if (!dimVisible(tipo, f)) continue;
    if (isBlank(campos[f])) faltando.push(f);
  }
  if (batenteColVisible(tipo) && isBlank(p.batente_cm)) faltando.push('batente_cm');
  if (alizarColVisible(tipo)) {
    // 0 em qualquer das duas medidas = "não tem alizar"; basta uma para não pendurar
    const semAlizar = p.alizar_l === 0 || p.alizar_a === 0;
    if (!semAlizar && (isBlank(p.alizar_l) || isBlank(p.alizar_a))) faltando.push('alizar');
  }
  return faltando;
}

/**
 * A situação é DERIVADA da completude: com todos os campos aplicáveis
 * preenchidos o produto está classificado; faltando algum, está pendente.
 * Antes o 'classificado' era gravado por quem clicava em Salvar ou por regra de
 * categoria, o que deixava produto completo constando como pendente.
 */
export const situacaoCorreta = (p: Produto) =>
  camposFaltando(p).length === 0 ? 'classificado' : 'pendente';
