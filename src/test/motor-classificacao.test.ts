import { describe, it, expect } from 'vitest';
import { classificar, type Regra } from '@/lib/motor-classificacao';
import { normalizarDescricao, hashDescricao } from '@/lib/normalizacao';

const prod = (codigo: string | null, desc: string) => ({ codigo, descricao: normalizarDescricao(desc) });

const regra = (over: Partial<Regra> & Pick<Regra, 'id' | 'condicoes' | 'resultados'>): Regra => ({
  nome: over.id, familia: null, prioridade: 0, confianca: 1, interromper: false, ativo: true, ...over,
});

const familiaContains = (id: string, termo: string, familia: string, extra: Partial<Regra> = {}): Regra =>
  regra({
    id, familia,
    condicoes: { operador: 'AND', itens: [{ campo: 'descricao_normalizada', operador: 'CONTAINS', valor: termo }] },
    resultados: { familia },
    ...extra,
  });

describe('motor-classificacao', () => {
  it('classifica cada uma das 5 famílias (caso 14)', () => {
    const regras = [
      familiaContains('r-kit', 'KIT PORTA', 'KIT_PORTA', { prioridade: 10 }),
      familiaContains('r-porta', 'PORTA', 'PORTA', { prioridade: 5 }),
      familiaContains('r-alisar', 'ALIZAR', 'ALISAR'),
      familiaContains('r-batente', 'BATENTE', 'BATENTE'),
      familiaContains('r-rodape', 'RODAPE', 'RODAPE'),
    ];
    const casos: Array<[string, string]> = [
      ['KIT PORTA INNOV LS SARRAFO', 'KIT_PORTA'],
      ['PORTA INNOVAZIONE LISA', 'PORTA'],
      ['ALIZAR LACCA TOUCH BIANCO', 'ALISAR'],
      ['BATENTE 3,5CM BRANCO', 'BATENTE'],
      ['RODAPÉ INNOVAZIONE BRANCO', 'RODAPE'],
    ];
    for (const [desc, esperado] of casos) {
      const r = classificar(prod('X', desc), regras);
      expect(r.familia).toBe(esperado);
      expect(r.status).toBe('APROVADO_AUTOMATICAMENTE'); // regra descrição → 0.98 ≥ 0.95
    }
  });

  it('regra de MAIOR prioridade vence, sem conflito (caso 7)', () => {
    const regras = [
      familiaContains('alta', 'PORTA', 'PORTA', { prioridade: 10 }),
      familiaContains('baixa', 'PORTA', 'KIT_PORTA', { prioridade: 1 }),
    ];
    const r = classificar(prod('X', 'PORTA LISA'), regras);
    expect(r.familia).toBe('PORTA');
    expect(r.conflitos).toHaveLength(0);
  });

  it('interromper trava o atributo contra regra inferior', () => {
    const regras = [
      familiaContains('alta', 'PORTA', 'PORTA', { prioridade: 10, interromper: true }),
      familiaContains('baixa', 'PORTA', 'KIT_PORTA', { prioridade: 5 }),
    ];
    const r = classificar(prod('X', 'PORTA LISA'), regras);
    expect(r.familia).toBe('PORTA');
  });

  it('termo PROIBIDO bloqueia o match (caso 8)', () => {
    const kit = regra({
      id: 'kit', familia: 'KIT_PORTA',
      condicoes: { operador: 'AND', itens: [
        { campo: 'descricao_normalizada', operador: 'CONTAINS', valor: 'KIT PORTA' },
        { campo: 'descricao_normalizada', operador: 'NOT_CONTAINS', valor: 'CORRER' },
      ] },
      resultados: { familia: 'KIT_PORTA' },
    });
    const r = classificar(prod('X', 'KIT PORTA CORRER INNOV'), [kit]);
    expect(r.regras_aplicadas).not.toContain('kit');
    expect(r.familia).toBeNull();
    expect(r.status).not.toBe('APROVADO_AUTOMATICAMENTE');
  });

  it('duas regras conflitantes (mesma prioridade, valores diferentes) → conflito (caso 9)', () => {
    const regras = [
      familiaContains('a', 'PORTA', 'PORTA', { prioridade: 5 }),
      familiaContains('b', 'PORTA', 'KIT_PORTA', { prioridade: 5 }),
    ];
    const r = classificar(prod('X', 'PORTA LISA'), regras);
    expect(r.status).toBe('CLASSIFICADO_COM_CONFLITO');
    expect(r.conflitos[0].atributo).toBe('familia');
    expect(r.conflitos[0].valores).toEqual(expect.arrayContaining(['PORTA', 'KIT_PORTA']));
  });

  it('confiança < 0.95 não aprova automaticamente (caso 10)', () => {
    const r = classificar(prod('X', 'PORTA LISA'), [familiaContains('r', 'PORTA', 'PORTA', { confianca: 0.9 })]);
    expect(r.confianca_global).toBeCloseTo(0.9, 5);
    expect(r.status).toBe('PENDENTE_REVISAO');
  });

  it('reusa classificação aprovada por código quando a descrição não muda (caso 12)', () => {
    const p = prod('47698', 'PORTA INNOVAZIONE LISA 210x70x3,5CM');
    const aprovada = {
      hash_descricao: hashDescricao(p.descricao.normalizada),
      familia: 'PORTA',
      atributos: { familia: { valor: 'PORTA', confianca: 1, origem: 'MANUAL' as const, evidencias: [], regra_id: null } },
    };
    const r = classificar(p, [], { aprovadaPorCodigo: aprovada });
    expect(r.origem_global).toBe('CODIGO_APROVADO');
    expect(r.status).toBe('APROVADO_AUTOMATICAMENTE');
    expect(r.regras_aplicadas).toHaveLength(0);
  });

  it('NÃO reusa quando a descrição mudou de forma relevante (caso 13)', () => {
    const aprovada = {
      hash_descricao: hashDescricao(normalizarDescricao('PORTA ANTIGA').normalizada),
      familia: 'PORTA',
      atributos: {},
    };
    const r = classificar(prod('47698', 'KIT PORTA NOVA CORRER'),
      [familiaContains('kit', 'KIT PORTA', 'KIT_PORTA')],
      { aprovadaPorCodigo: aprovada });
    expect(r.origem_global).not.toBe('CODIGO_APROVADO');
    expect(r.familia).toBe('KIT_PORTA');
  });

  it('valor fora das opções permitidas derruba a confiança (→ revisão)', () => {
    const regras = [
      familiaContains('r', 'PORTA', 'PORTA', { prioridade: 10 }),
      regra({ id: 'mov', condicoes: { operador: 'AND', itens: [{ campo: 'descricao_normalizada', operador: 'CONTAINS', valor: 'ZZZ' }] }, resultados: { movimento: 'ZZZ' } }),
    ];
    const p = prod('X', 'PORTA ZZZ');
    const r = classificar(p, regras, { opcoesPermitidas: { movimento: ['GIRO', 'CORRER'] }, atributosObrigatorios: ['familia', 'movimento'] });
    expect(r.atributos.movimento.confianca).toBe(0);
    expect(r.status).not.toBe('APROVADO_AUTOMATICAMENTE');
  });

  it('NUNCA expõe preço no resultado (caso 15)', () => {
    const r = classificar(prod('X', 'PORTA LISA'), [familiaContains('r', 'PORTA', 'PORTA')]);
    const s = JSON.stringify(r);
    expect(s).not.toMatch(/preco|valor_un|valor_total/i);
  });
});
