// =============================================================================
// CÓPIA Deno de src/lib/normalizacao.ts (mantida em PARIDADE pelo teste
// src/test/paridade-edge.test.ts). Não editar uma sem a outra.
// Módulo puro (sem APIs de Deno) — por isso o teste em Node consegue importá-lo.
// =============================================================================

export interface DescricaoNormalizada {
  original: string;
  normalizada: string;
  tokens: string[];
}

export type Aliases = Record<string, string>;

const removerAcentos = (s: string): string =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '');

export function normalizarDescricao(input: unknown, aliases: Aliases = {}): DescricaoNormalizada {
  const original = typeof input === 'string' ? input : '';

  let s = removerAcentos(original).toUpperCase();
  s = s.replace(/(\d)\s*[X×]\s*(\d)/g, '$1X$2');
  s = s.replace(/(\d)\s*(CM|MM)\b/g, '$1$2');
  s = s.replace(/[;|/\\]+/g, ' ').replace(/\s+/g, ' ').trim();

  if (Object.keys(aliases).length > 0) {
    s = s.split(' ').map((tok) => aliases[tok] ?? tok).join(' ');
  }

  const normalizada = s;
  const tokens = normalizada.split(/[^A-Z0-9,.]+/).filter(Boolean);
  return { original, normalizada, tokens };
}

export function hashDescricao(s: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16).padStart(8, '0');
}
