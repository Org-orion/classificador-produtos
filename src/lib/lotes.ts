/**
 * Utilidades de gravação em massa.
 *
 * O motor de regras roda no navegador e, numa carga grande, o custo é o número
 * de idas ao banco — não o processamento. Estas funções existem para transformar
 * "um UPDATE por produto" em "um UPDATE por conjunto de produtos".
 */

/** Divide em lotes de tamanho fixo (limite de ids por `in(...)`). */
export function emLotes<T>(itens: T[], tamanho: number): T[][] {
  const lotes: T[][] = [];
  for (let i = 0; i < itens.length; i += tamanho) lotes.push(itens.slice(i, i + tamanho));
  return lotes;
}

export interface GrupoAtualizacao<T> {
  updates: Record<string, unknown>;
  itens: T[];
}

/**
 * Agrupa itens que recebem exatamente a mesma atualização.
 *
 * As medidas se repetem muito no catálogo (vários KIT PORTA com
 * `BAT15CM AL5x8,5CM`), então poucos payloads distintos cobrem milhares de
 * produtos. Itens cujo cálculo não gera nenhuma mudança ficam de fora.
 */
export function agruparPorAtualizacao<T>(
  itens: T[],
  calcular: (item: T) => Record<string, unknown>,
): GrupoAtualizacao<T>[] {
  const grupos = new Map<string, GrupoAtualizacao<T>>();
  for (const item of itens) {
    const updates = calcular(item);
    if (Object.keys(updates).length === 0) continue;
    // chave estável: mesmas colunas e mesmos valores, independente da ordem
    const chave = JSON.stringify(Object.entries(updates).sort(([a], [b]) => a.localeCompare(b)));
    const grupo = grupos.get(chave);
    if (grupo) grupo.itens.push(item);
    else grupos.set(chave, { updates, itens: [item] });
  }
  return [...grupos.values()];
}
