import { describe, it, expect } from 'vitest';
import { normalizarDescricao as libNorm } from '@/lib/normalizacao';
import { classificar as libClass, type Regra } from '@/lib/motor-classificacao';
// Cópias Deno usadas pela Edge Function (puras, sem APIs de Deno):
import { normalizarDescricao as edgeNorm } from '../../supabase/functions/sincronizar-produtos/normalizacao';
import { classificar as edgeClass } from '../../supabase/functions/sincronizar-produtos/motor';

// Garante que a cópia Deno da Edge Function produz EXATAMENTE o mesmo resultado
// que src/lib — evita divergência entre o preview do app e o backend.
const VETORES = [
  'PORTA INNOVAZIONE LISA SARRAFO 3MM UV BRANCO C/ VENEZIANA 210x70x3,5CM',
  'ALIZAR LACCA TOUCH BIANCO MTX PROTECT + 224x5,0x8,5x1,0CM LAM. 3MM MDF S',
  'KIT PORTA CORRER INNOV. LS SARR. 3MM',
  'RODAPÉ INNOVAZIONE BRANCO',
  'DOBRADIÇA VIA FABRICA PADRÃO LEVE',
];

const REGRAS: Regra[] = [
  { id: 'kit', nome: 'kit', familia: 'KIT_PORTA', prioridade: 10, confianca: 1, interromper: true, ativo: true,
    condicoes: { operador: 'AND', itens: [{ campo: 'descricao_normalizada', operador: 'CONTAINS', valor: 'KIT PORTA' }] },
    resultados: { familia: 'KIT_PORTA' } },
  { id: 'porta', nome: 'porta', familia: 'PORTA', prioridade: 5, confianca: 1, interromper: false, ativo: true,
    condicoes: { operador: 'AND', itens: [{ campo: 'descricao_normalizada', operador: 'CONTAINS', valor: 'PORTA' }] },
    resultados: { familia: 'PORTA' } },
];

describe('paridade Edge (Deno) × src/lib', () => {
  it('normalizarDescricao produz o mesmo resultado', () => {
    for (const v of VETORES) {
      expect(edgeNorm(v)).toEqual(libNorm(v));
    }
  });

  it('classificar produz o mesmo resultado', () => {
    for (const v of VETORES) {
      const produto = { codigo: 'X', descricao: libNorm(v) };
      expect(edgeClass(produto, REGRAS)).toEqual(libClass(produto, REGRAS));
    }
  });
});
