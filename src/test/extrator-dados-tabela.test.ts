import { describe, it, expect } from 'vitest';
import { extrairItensDadosTabela } from '@/lib/extrator-dados-tabela';

// Amostra REAL (Etapa 1) — estrutura { itens: [ { id, produto, un, qtd, valor_* } ] }
const amostraReal = {
  itens: [
    { id: '47698', produto: 'PORTA INNOVAZIONE LISA SARRAFO 3MM UV BRANCO C/ VENEZIANA 210x70x3,5CM', un: 'UN', qtd: 3, valor_un: 453.41, valor_total: 1564.32 },
    { id: '2001', produto: 'DOBRADIÇA VIA FABRICA PADRÃO LEVE Pino rev. Arred 3x2.1/2 - Ac', un: 'UND', qtd: 423, valor_un: 4.76 },
  ],
};

describe('extrairItensDadosTabela', () => {
  it('extrai código=id, descrição=produto, unidade=un', () => {
    const r = extrairItensDadosTabela(amostraReal);
    expect(r.totalBruto).toBe(2);
    expect(r.itens).toHaveLength(2);
    expect(r.itens[0].codigo).toBe('47698');
    expect(r.itens[0].descricaoOriginal).toContain('PORTA INNOVAZIONE');
    expect(r.itens[0].unidade).toBe('UN');
    expect(r.itens[0].descricao.normalizada).toContain('210X70X3,5CM');
  });

  it('não expõe nenhum valor de preço no resultado', () => {
    const r = extrairItensDadosTabela(amostraReal);
    const serial = JSON.stringify(r);
    expect(serial).not.toContain('453.41');
    expect(serial).not.toContain('valor_un');
    expect(serial).not.toContain('valor_total');
  });

  it('aceita dados_tabela como STRING JSON', () => {
    const r = extrairItensDadosTabela(JSON.stringify(amostraReal));
    expect(r.itens).toHaveLength(2);
  });

  it('ignora item sem código E sem descrição, registrando erro', () => {
    const r = extrairItensDadosTabela({ itens: [{ un: 'UN', qtd: 1 }] });
    expect(r.itens).toHaveLength(0);
    expect(r.erros.some((e) => e.motivo === 'sem_codigo_e_sem_descricao')).toBe(true);
  });

  it('mantém item que tem código mesmo sem descrição', () => {
    const r = extrairItensDadosTabela({ itens: [{ id: '999' }] });
    expect(r.itens).toHaveLength(1);
    expect(r.itens[0].codigo).toBe('999');
    expect(r.itens[0].descricao.normalizada).toBe('');
  });

  it('estrutura inválida não lança e registra erro', () => {
    for (const bad of [null, undefined, 'texto-solto', 42]) {
      const r = extrairItensDadosTabela(bad);
      expect(r.itens).toHaveLength(0);
      expect(r.erros.length).toBeGreaterThan(0);
    }
  });

  it('um item inválido não derruba os demais', () => {
    const r = extrairItensDadosTabela({ itens: [123, { id: '10', produto: 'PORTA' }, null] });
    expect(r.itens).toHaveLength(1);
    expect(r.itens[0].codigo).toBe('10');
    expect(r.erros.length).toBeGreaterThanOrEqual(2);
    expect(r.totalBruto).toBe(3);
  });
});
