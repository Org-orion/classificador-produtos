// =============================================================================
// Motor de classificação (puro, testável). Camadas:
//  1. Classificação aprovada por código (reuso se a descrição não mudou) — 1.00
//  2/3. Regras determinísticas de código/descrição (condicoes_json)
//  4/5/6. Parser / Similaridade / IA — HOOKS (não implementados aqui; a
//         arquitetura permite, mas SIMILARIDADE(≤0.94) e IA(≤0.89) NUNCA aprovam
//         automaticamente por causa dos tetos de confiança).
//
// Corrige o bug de "regra inferior sobrescreve superior": as regras são avaliadas
// da MAIOR para a MENOR prioridade e um atributo já definido não é sobrescrito;
// `interromper` trava o atributo contra qualquer regra inferior.
//
// Confiança global = MENOR confiança entre os atributos OBRIGATÓRIOS.
// Conflito / obrigatório ausente / valor fora das opções → revisão/bloqueio.
// PREÇO não entra em nada aqui.
// =============================================================================

import { hashDescricao, type DescricaoNormalizada } from './normalizacao';

export type Origem =
  | 'CODIGO_APROVADO' | 'REGRA_CODIGO' | 'REGRA_DESCRICAO'
  | 'PARSER' | 'SIMILARIDADE' | 'IA' | 'MANUAL';

/** Teto de confiança por origem (spec da reconstrução). */
export const TETO_CONFIANCA: Record<Origem, number> = {
  CODIGO_APROVADO: 1.0,
  REGRA_CODIGO: 1.0,
  REGRA_DESCRICAO: 0.98,
  PARSER: 0.99,
  SIMILARIDADE: 0.94,
  IA: 0.89,
  MANUAL: 1.0,
};

export type OperadorCond =
  | 'CONTAINS' | 'NOT_CONTAINS' | 'STARTS_WITH' | 'ENDS_WITH'
  | 'EQUALS' | 'REGEX' | 'ALL_TERMS' | 'ANY_TERMS';

export type CampoAlvo = 'descricao_normalizada' | 'descricao_original' | 'codigo';

export interface CondicaoItem { campo: CampoAlvo; operador: OperadorCond; valor: string | string[]; }
export interface CondicaoGrupo { operador: 'AND' | 'OR'; itens: Array<CondicaoItem | CondicaoGrupo>; }

export interface Regra {
  id: string;
  nome: string;
  familia: string | null;
  condicoes: CondicaoGrupo;
  resultados: Record<string, string>;
  prioridade: number;
  confianca: number;
  interromper: boolean;
  ativo: boolean;
}

export interface AtributoClassificado {
  valor: string;
  confianca: number;
  origem: Origem;
  evidencias: string[];
  regra_id: string | null;
}

export type StatusClassificacao =
  | 'APROVADO_AUTOMATICAMENTE' | 'PENDENTE_REVISAO'
  | 'PENDENTE_CLASSIFICACAO' | 'CLASSIFICADO_COM_CONFLITO';

export interface Conflito { atributo: string; valores: string[]; regra_ids: string[]; }

export interface ProdutoParaClassificar {
  codigo: string | null;
  descricao: DescricaoNormalizada;
}

export interface ClassificacaoAprovada {
  hash_descricao: string;
  familia: string | null;
  atributos: Record<string, AtributoClassificado>;
}

export interface OpcoesClassificacao {
  aprovadaPorCodigo?: ClassificacaoAprovada;
  opcoesPermitidas?: Record<string, string[]>;
  atributosObrigatorios?: string[]; // default ['familia']
  versaoMotor?: string;
}

export interface ResultadoClassificacao {
  familia: string | null;
  atributos: Record<string, AtributoClassificado>;
  confianca_global: number;
  status: StatusClassificacao;
  origem_global: Origem | null;
  regras_aplicadas: string[];
  regras_rejeitadas: string[];
  conflitos: Conflito[];
  evidencias: string[];
  motivo_bloqueio: string | null;
}

const LIMIAR_APROVACAO = 0.95;
const LIMIAR_REVISAO = 0.85;

// --------------------------- avaliação de condições ---------------------------
function alvo(campo: CampoAlvo, p: ProdutoParaClassificar): string {
  if (campo === 'codigo') return (p.codigo ?? '').trim();
  if (campo === 'descricao_original') return p.descricao.original;
  return p.descricao.normalizada;
}

function comoLista(v: string | string[]): string[] {
  return Array.isArray(v) ? v : [v];
}

function avaliarItem(item: CondicaoItem, p: ProdutoParaClassificar): { ok: boolean; evidencias: string[] } {
  const texto = alvo(item.campo, p);
  const termos = comoLista(item.valor);
  switch (item.operador) {
    case 'CONTAINS':      return { ok: termos.every((t) => texto.includes(t)), evidencias: termos.filter((t) => texto.includes(t)) };
    case 'NOT_CONTAINS':  return { ok: termos.every((t) => !texto.includes(t)), evidencias: [] };
    case 'STARTS_WITH':   return { ok: termos.some((t) => texto.startsWith(t)), evidencias: termos.filter((t) => texto.startsWith(t)) };
    case 'ENDS_WITH':     return { ok: termos.some((t) => texto.endsWith(t)), evidencias: termos.filter((t) => texto.endsWith(t)) };
    case 'EQUALS':        return { ok: termos.some((t) => texto === t), evidencias: termos.filter((t) => texto === t) };
    case 'ALL_TERMS':     return { ok: termos.every((t) => texto.includes(t)), evidencias: termos.filter((t) => texto.includes(t)) };
    case 'ANY_TERMS':     return { ok: termos.some((t) => texto.includes(t)), evidencias: termos.filter((t) => texto.includes(t)) };
    case 'REGEX': {
      for (const t of termos) {
        try { if (new RegExp(t).test(texto)) return { ok: true, evidencias: [t] }; } catch { /* regex inválida = não casa */ }
      }
      return { ok: false, evidencias: [] };
    }
    default: return { ok: false, evidencias: [] };
  }
}

function isItem(c: CondicaoItem | CondicaoGrupo): c is CondicaoItem {
  return (c as CondicaoItem).operador !== 'AND' && (c as CondicaoItem).operador !== 'OR';
}

function avaliarGrupo(grupo: CondicaoGrupo, p: ProdutoParaClassificar): { ok: boolean; evidencias: string[] } {
  const evid: string[] = [];
  const resultados = grupo.itens.map((c) => (isItem(c) ? avaliarItem(c, p) : avaliarGrupo(c, p)));
  resultados.forEach((r) => evid.push(...r.evidencias));
  const ok = grupo.operador === 'AND' ? resultados.every((r) => r.ok) : resultados.some((r) => r.ok);
  return { ok, evidencias: evid };
}

/** Origem determinística de uma regra: REGRA_CODIGO se casa por código exato; senão REGRA_DESCRICAO. */
function origemDaRegra(cond: CondicaoGrupo): Origem {
  const usaCodigoExato = (c: CondicaoItem | CondicaoGrupo): boolean =>
    isItem(c) ? c.campo === 'codigo' && c.operador === 'EQUALS' : c.itens.some(usaCodigoExato);
  return usaCodigoExato(cond) ? 'REGRA_CODIGO' : 'REGRA_DESCRICAO';
}

// --------------------------------- motor ---------------------------------
export function classificar(
  produto: ProdutoParaClassificar,
  regras: Regra[],
  opcoes: OpcoesClassificacao = {},
): ResultadoClassificacao {
  const obrigatorios = opcoes.atributosObrigatorios ?? ['familia'];

  // Camada 1 — reuso por código aprovado, se a descrição não mudou.
  const aprovada = opcoes.aprovadaPorCodigo;
  if (aprovada && aprovada.hash_descricao === hashDescricao(produto.descricao.normalizada)) {
    return {
      familia: aprovada.familia,
      atributos: aprovada.atributos,
      confianca_global: 1.0,
      status: 'APROVADO_AUTOMATICAMENTE',
      origem_global: 'CODIGO_APROVADO',
      regras_aplicadas: [],
      regras_rejeitadas: [],
      conflitos: [],
      evidencias: [],
      motivo_bloqueio: null,
    };
  }

  // Camadas 2/3 — regras determinísticas (maior prioridade primeiro).
  const ativas = regras.filter((r) => r.ativo).sort((a, b) => b.prioridade - a.prioridade);
  const atributos: Record<string, AtributoClassificado> = {};
  const prioridadeDoAtributo: Record<string, number> = {};
  const travado: Record<string, boolean> = {};
  const conflitos: Conflito[] = [];
  const aplicadas: string[] = [];
  const rejeitadas: string[] = [];
  const evidenciasGlobais: string[] = [];

  for (const regra of ativas) {
    const av = avaliarGrupo(regra.condicoes, produto);
    if (!av.ok) { rejeitadas.push(regra.id); continue; }
    aplicadas.push(regra.id);
    evidenciasGlobais.push(...av.evidencias);
    const origem = origemDaRegra(regra.condicoes);
    const conf = Math.min(regra.confianca, TETO_CONFIANCA[origem]);

    for (const [attr, val] of Object.entries(regra.resultados)) {
      const atual = atributos[attr];
      if (!atual) {
        atributos[attr] = { valor: val, confianca: conf, origem, evidencias: av.evidencias, regra_id: regra.id };
        prioridadeDoAtributo[attr] = regra.prioridade;
        if (regra.interromper) travado[attr] = true;
        continue;
      }
      if (travado[attr]) continue;                 // regra superior/interromper vence
      if (atual.valor === val) continue;           // confirma o mesmo valor
      // valores divergentes:
      if (regra.prioridade === prioridadeDoAtributo[attr]) {
        // mesma prioridade + valor diferente = CONFLITO
        const existente = conflitos.find((c) => c.atributo === attr);
        if (existente) {
          if (!existente.valores.includes(val)) existente.valores.push(val);
          existente.regra_ids.push(regra.id);
        } else {
          conflitos.push({ atributo: attr, valores: [atual.valor, val], regra_ids: [atual.regra_id ?? '', regra.id] });
        }
      }
      // prioridade menor + valor diferente = ignorado (superior vence)
    }
  }

  const familia = atributos['familia']?.valor ?? null;

  // Opções permitidas: valor fora da lista zera a confiança do atributo (→ revisão).
  if (opcoes.opcoesPermitidas) {
    for (const [attr, at] of Object.entries(atributos)) {
      const permitidas = opcoes.opcoesPermitidas[attr];
      if (permitidas && !permitidas.includes(at.valor)) at.confianca = 0;
    }
  }

  // Confiança global = menor confiança entre os OBRIGATÓRIOS presentes.
  let confiancaGlobal = 1.0;
  let origemGlobal: Origem | null = null;
  let faltaObrigatorio = false;
  for (const attr of obrigatorios) {
    const at = atributos[attr];
    if (!at) { faltaObrigatorio = true; confiancaGlobal = 0; continue; }
    if (at.confianca <= confiancaGlobal) { confiancaGlobal = at.confianca; origemGlobal = at.origem; }
  }
  if (Object.keys(atributos).length === 0) confiancaGlobal = 0;

  // Status.
  let status: StatusClassificacao;
  let motivo: string | null = null;
  if (conflitos.length > 0) {
    status = 'CLASSIFICADO_COM_CONFLITO';
    motivo = `Conflito em: ${conflitos.map((c) => c.atributo).join(', ')}`;
  } else if (faltaObrigatorio || !familia) {
    status = confiancaGlobal >= LIMIAR_REVISAO ? 'PENDENTE_REVISAO' : 'PENDENTE_CLASSIFICACAO';
    motivo = 'Atributo obrigatório ausente';
  } else if (confiancaGlobal >= LIMIAR_APROVACAO) {
    status = 'APROVADO_AUTOMATICAMENTE';
  } else if (confiancaGlobal >= LIMIAR_REVISAO) {
    status = 'PENDENTE_REVISAO';
  } else {
    status = 'PENDENTE_CLASSIFICACAO';
  }

  return {
    familia,
    atributos,
    confianca_global: confiancaGlobal,
    status,
    origem_global: origemGlobal,
    regras_aplicadas: aplicadas,
    regras_rejeitadas: rejeitadas,
    conflitos,
    evidencias: [...new Set(evidenciasGlobais)],
    motivo_bloqueio: motivo,
  };
}
