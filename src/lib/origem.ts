/**
 * Origem de cada campo do produto: preenchido por regra ou à mão.
 *
 * `produto.campos_regra` guarda os campos que o motor preencheu. Quem edita e
 * salva na tela remove o campo da lista — a partir daí ele é intocável, e nem
 * a Revisão nem uma nova rodada de regras mexem nele.
 */

/** Campos que o motor de regras pode preencher — e que a Revisão limpa. */
export const CAMPOS_DE_REGRA = [
  'tipo_produto', 'movimento', 'enchimento', 'revestimento', 'linha', 'perfil',
  'cor', 'protect_plus', 'veneziana', 'visor',
  'altura_cm', 'largura_cm', 'espessura_cm',
  'batente_cm', 'alizar_l', 'alizar_a', 'alizar_e',
] as const;

const CONHECIDOS = new Set<string>(CAMPOS_DE_REGRA);

const lista = (atual: string[] | null | undefined) => atual ?? [];

/** Registra que estes campos vieram de regra. Ordem estável, sem repetição. */
export function marcarRegra(atual: string[] | null | undefined, campos: string[]): string[] {
  const set = new Set(lista(atual));
  for (const c of campos) if (CONHECIDOS.has(c)) set.add(c);
  return [...set].sort();
}

/** Tira estes campos da lista: foram editados à mão e agora são intocáveis. */
export function marcarManual(atual: string[] | null | undefined, campos: string[]): string[] {
  const remover = new Set(campos);
  return lista(atual).filter(c => !remover.has(c)).sort();
}

export const veioDeRegra = (atual: string[] | null | undefined, campo: string) =>
  lista(atual).includes(campo);

/**
 * Payload que devolve o produto ao estado "sem classificação por regra":
 * limpa só os campos de origem regra e zera a lista. Devolve `null` quando não
 * há nada de regra — o produto é todo manual e a Revisão deve ignorá-lo.
 */
export function limparCamposDeRegra(atual: string[] | null | undefined): Record<string, unknown> | null {
  const campos = lista(atual).filter(c => CONHECIDOS.has(c));
  if (campos.length === 0) return null;
  const payload: Record<string, unknown> = { campos_regra: [] };
  for (const c of campos) payload[c] = null;
  return payload;
}
