// =============================================================================
// Função ÚNICA de normalização de descrição.
// Regras (só transformações ESTRUTURAIS e seguras — nada de regra de negócio):
//  - preserva a descrição ORIGINAL (valor exibido nunca é alterado);
//  - versão normalizada: maiúsculas, sem acentos, espaços/pontuação padronizados,
//    separador de dimensão padronizado (x/×/X → 'X'), unidades cm/mm consistentes;
//  - aplica ALIASES cadastrados (dicionário) — vazio por padrão; abreviações de
//    domínio (LS, SARR, INNOV...) serão populadas pelo vault "01 - Dicionário"
//    (Etapa 7). NÃO inventamos expansões aqui.
//  - produz tokens para o motor de regras.
// Todas as regras do motor DEVEM usar esta função (fonte única de normalização).
// =============================================================================

export interface DescricaoNormalizada {
  /** Texto original, intocado (valor de exibição). */
  original: string;
  /** Texto normalizado para COMPARAÇÃO (não exibir ao usuário). */
  normalizada: string;
  /** Tokens derivados da versão normalizada. */
  tokens: string[];
}

/**
 * Aliases de normalização (abreviação → forma canônica). Vazio por padrão.
 * Preenchido a partir do dicionário aprovado (vault), nunca inventado no código.
 * Chaves e valores são comparados já em MAIÚSCULAS e sem acento.
 */
export type Aliases = Record<string, string>;

const removerAcentos = (s: string): string =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '');

/**
 * Normaliza uma descrição. `original` é preservado; `normalizada` e `tokens`
 * são derivados. Nunca lança — entrada não-string vira string vazia.
 */
export function normalizarDescricao(input: unknown, aliases: Aliases = {}): DescricaoNormalizada {
  const original = typeof input === 'string' ? input : '';

  let s = removerAcentos(original).toUpperCase();

  // Padroniza separador de dimensão entre números: 210x70 / 210 X 70 / 210×70 → 210X70
  s = s.replace(/(\d)\s*[X×]\s*(\d)/g, '$1X$2');

  // Unidades de medida coladas ao número: "210 CM" → "210CM"; idem MM.
  s = s.replace(/(\d)\s*(CM|MM)\b/g, '$1$2');

  // Pontuação/espaços: troca separadores por espaço, colapsa múltiplos espaços.
  s = s.replace(/[;|/\\]+/g, ' ').replace(/\s+/g, ' ').trim();

  // Aliases cadastrados (palavra inteira). Vazio por padrão.
  if (Object.keys(aliases).length > 0) {
    s = s
      .split(' ')
      .map((tok) => aliases[tok] ?? tok)
      .join(' ');
  }

  const normalizada = s;
  const tokens = normalizada.split(/[^A-Z0-9,.]+/).filter(Boolean);

  return { original, normalizada, tokens };
}

/** Hash simples e estável de uma string (FNV-1a 32-bit, hex). Detecta mudança
 *  de descrição sem depender de crypto no browser. */
export function hashDescricao(s: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16).padStart(8, '0');
}
