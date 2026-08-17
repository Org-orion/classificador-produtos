/**
 * Busca textual das telas: ignora acento, caixa e espaço nas pontas.
 * "colmeia" acha "Colméia"; "kit porta" acha "KIT PORTA CORRER…".
 */

export const normalizaBusca = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase();

/**
 * O termo aparece em algum dos campos? Termo vazio casa com tudo, para o filtro
 * ficar inerte enquanto ninguém digitou nada.
 */
export function casaBusca(termo: string, ...campos: (string | null | undefined)[]) {
  const t = normalizaBusca(termo.trim());
  if (!t) return true;
  return campos.some(c => c && normalizaBusca(c).includes(t));
}
