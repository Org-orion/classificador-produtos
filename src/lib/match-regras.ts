/**
 * Casamento das regras de atributo (`concremprodutos_regras_atributo`) contra a
 * descrição do produto. Extraído da tela para poder ser testado.
 */

export type TipoMatch = 'contem' | 'nao_contem' | 'comeca_com' | 'termina_com' | 'exato';

const escapaRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * O critério aparece na descrição INICIANDO uma palavra.
 *
 * Com critério "AL" (sigla de alizar):
 *   • acha  "…210X70(BAT12CM AL5x8,5CM)" → sigla colada na medida, como o catálogo escreve
 *   • acha  "ALIZAR LACCA TOUCH…"
 *   • ignora "METAL", "GERAL", "CRISTAL" → aqui "AL" não inicia palavra
 *
 * Não se exige fronteira DEPOIS do critério de propósito: exigir quebraria o
 * padrão "AL5x8,5CM" do KIT PORTA, em que a sigla vem colada no número.
 */
export function iniciaPalavra(descricao: string, criterio: string) {
  if (!criterio) return false;
  const prefixo = /^[A-Za-z0-9]/.test(criterio) ? '\\b' : '';
  return new RegExp(prefixo + escapaRegex(criterio), 'i').test(descricao);
}

/**
 * A regra casa com a descrição?
 *
 * `contem` segue sendo substring simples — as regras já cadastradas dependem
 * disso (critério "230x" acha "210X230X80", "CORR" acha "CORRER"). Só o
 * `nao_contem` usa o casamento por início de palavra, porque negar exige
 * precisão: um "AL" no meio de "METAL" deixaria o produto pendente para sempre.
 */
export function casaRegraAtributo(descricao: string, criterio: string, tipoMatch: string) {
  const desc = descricao.toUpperCase();
  const crit = criterio.toUpperCase().trim();
  switch (tipoMatch as TipoMatch) {
    case 'contem':      return desc.includes(crit);
    case 'nao_contem':  return !iniciaPalavra(desc, crit);
    case 'comeca_com':  return desc.startsWith(crit);
    case 'termina_com': return desc.endsWith(crit);
    case 'exato':       return desc === crit;
    default:            return false;
  }
}
