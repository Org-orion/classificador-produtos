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

/** Campos que podem ser declarados como "não se aplica" a um tipo. */
export const CAMPOS_APLICAVEIS = [
  ...ATTR_FIELDS.filter(f => f !== 'tipo_produto'),
  ...DIM_FIELDS,
  'batente_cm',
  'alizar',
] as const;

/** tipo de produto → campos que NÃO se aplicam a ele. */
export type Aplicabilidade = Record<string, Set<string>>;

/**
 * Usado enquanto a tabela `concremprodutos_aplicabilidade` não carregou (ou não
 * existe, em base sem a migration 20260805000001). Reproduz o que estava fixo no
 * código, para o comportamento não mudar sozinho. A fonte de verdade é a tabela.
 */
export const APLICABILIDADE_PADRAO: Aplicabilidade = {
  ALIZAR: new Set(['movimento', 'enchimento', 'linha', 'perfil', 'protect_plus',
                   'veneziana', 'visor', 'largura_cm', 'batente_cm']),
  BATENTE: new Set(['movimento', 'enchimento', 'linha', 'perfil', 'protect_plus',
                    'veneziana', 'visor', 'altura_cm', 'batente_cm', 'alizar']),
  PORTA:  new Set(['batente_cm', 'alizar']),
  RODAPE: new Set(['batente_cm', 'alizar']),
};

const tipoDe = (tipo: string | null | undefined) => (tipo || '').toUpperCase().trim();

export const isBlank = (v: unknown) => v === null || v === undefined || v === '';

/** Produto fora de linha. `ativo` undefined (base sem a migration) = ativo. */
export const inativo = (p: Produto) => p.ativo === false;

/** O campo se aplica a este tipo de produto? */
export function seAplica(
  tipo: string | null | undefined,
  campo: string,
  apl: Aplicabilidade = APLICABILIDADE_PADRAO,
) {
  return !apl[tipoDe(tipo)]?.has(campo);
}

/**
 * Campos que ainda faltam preencher, considerando só o que se aplica ao tipo.
 * Medida com 0 conta como preenchida: 0 significa "não tem" (ver regras
 * "não contém" em lib/match-regras).
 */
export function camposFaltando(p: Produto, apl: Aplicabilidade = APLICABILIDADE_PADRAO): string[] {
  const tipo = p.tipo_produto;
  const campos = p as unknown as Record<string, unknown>;
  const faltando: string[] = [];

  for (const f of ATTR_FIELDS) {
    if (!seAplica(tipo, f, apl)) continue;
    if (isBlank(campos[f])) faltando.push(f);
  }
  for (const f of DIM_FIELDS) {
    if (!seAplica(tipo, f, apl)) continue;
    if (isBlank(campos[f])) faltando.push(f);
  }
  if (seAplica(tipo, 'batente_cm', apl) && isBlank(p.batente_cm)) faltando.push('batente_cm');
  if (seAplica(tipo, 'alizar', apl)) {
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
export const situacaoCorreta = (p: Produto, apl: Aplicabilidade = APLICABILIDADE_PADRAO) =>
  camposFaltando(p, apl).length === 0 ? 'classificado' : 'pendente';

/** Monta a aplicabilidade a partir das linhas da tabela. */
export function montarAplicabilidade(
  linhas: { tipo_produto: string; campo: string }[] | null | undefined,
): Aplicabilidade {
  if (!linhas?.length) return APLICABILIDADE_PADRAO;
  const apl: Aplicabilidade = {};
  for (const l of linhas) {
    const t = tipoDe(l.tipo_produto);
    (apl[t] ??= new Set()).add(l.campo);
  }
  return apl;
}
