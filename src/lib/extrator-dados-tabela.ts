// =============================================================================
// Extrator robusto de `dados_tabela` (jsonb) de concrem_pedidos_venda.
// Estrutura real confirmada (Etapa 1): { "itens": [ { id, produto, un, qtd, ... } ] }
//   - código   = item.id
//   - descrição = item.produto
//   - unidade   = item.un
// Regras:
//   - tolera campos opcionais e nomes alternativos;
//   - ignora itens SEM código E SEM descrição;
//   - preserva a descrição original e gera a normalizada;
//   - registra erros de estrutura SEM interromper toda a execução;
//   - nunca usa/retorna valores de preço.
// =============================================================================

import { normalizarDescricao, type Aliases, type DescricaoNormalizada } from './normalizacao';

export interface ItemExtraido {
  codigo: string | null;
  descricaoOriginal: string;
  descricao: DescricaoNormalizada;
  unidade: string | null;
}

export interface ErroExtracao {
  motivo: string;
  indice?: number;
}

export interface ResultadoExtracao {
  itens: ItemExtraido[];
  erros: ErroExtracao[];
  /** Quantidade bruta de itens encontrados no array (antes de filtrar). */
  totalBruto: number;
}

const CHAVES_CODIGO = ['id', 'codigo', 'cod', 'id_produto', 'codigo_produto'];
const CHAVES_DESCRICAO = ['produto', 'descricao', 'nome', 'descricao_produto', 'nome_produto', 'item'];
const CHAVES_UNIDADE = ['un', 'unidade', 'und', 'unid'];

function pick(obj: Record<string, unknown>, keys: string[]): string | null {
  for (const k of keys) {
    const v = obj[k];
    if (typeof v === 'string' && v.trim()) return v.trim();
    if (typeof v === 'number' && Number.isFinite(v)) return String(v);
  }
  return null;
}

/** Localiza o array de itens dentro de `dados_tabela` (tolerante). */
function acharItens(valor: unknown): unknown[] | null {
  if (valor == null) return null;
  if (typeof valor === 'string') {
    try {
      return acharItens(JSON.parse(valor));
    } catch {
      return null;
    }
  }
  if (Array.isArray(valor)) return valor;
  if (typeof valor === 'object') {
    const obj = valor as Record<string, unknown>;
    for (const k of ['itens', 'items', 'produtos']) {
      if (Array.isArray(obj[k])) return obj[k] as unknown[];
    }
  }
  return null;
}

/**
 * Extrai itens de um `dados_tabela`. Nunca lança; erros ficam em `erros`.
 */
export function extrairItensDadosTabela(dadosTabela: unknown, aliases: Aliases = {}): ResultadoExtracao {
  const itens: ItemExtraido[] = [];
  const erros: ErroExtracao[] = [];

  const arr = acharItens(dadosTabela);
  if (!arr) {
    erros.push({ motivo: 'estrutura_invalida: array de itens não encontrado' });
    return { itens, erros, totalBruto: 0 };
  }

  arr.forEach((raw, indice) => {
    try {
      if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
        erros.push({ motivo: 'item_nao_objeto', indice });
        return;
      }
      const obj = raw as Record<string, unknown>;
      const codigo = pick(obj, CHAVES_CODIGO);
      const descricaoOriginal = pick(obj, CHAVES_DESCRICAO) ?? '';
      const unidade = pick(obj, CHAVES_UNIDADE);

      // Ignora itens sem código E sem descrição.
      if (!codigo && !descricaoOriginal) {
        erros.push({ motivo: 'sem_codigo_e_sem_descricao', indice });
        return;
      }

      itens.push({
        codigo,
        descricaoOriginal,
        descricao: normalizarDescricao(descricaoOriginal, aliases),
        unidade,
      });
    } catch (e) {
      erros.push({ motivo: `erro_item: ${e instanceof Error ? e.message : 'desconhecido'}`, indice });
    }
  });

  return { itens, erros, totalBruto: arr.length };
}
