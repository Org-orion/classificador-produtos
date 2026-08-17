import { describe, it, expect } from 'vitest';
import { emLotes, agruparPorAtualizacao } from '@/lib/lotes';

describe('emLotes', () => {
  it('divide na quantidade pedida e mantém o resto no último lote', () => {
    expect(emLotes([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
  });

  it('lista vazia não gera lote', () => {
    expect(emLotes([], 200)).toEqual([]);
  });

  it('lista menor que o lote sai inteira', () => {
    expect(emLotes([1, 2], 200)).toEqual([[1, 2]]);
  });
});

describe('agruparPorAtualizacao', () => {
  const kits = [
    { id: 'a', bat: 15, al: 5 },
    { id: 'b', bat: 15, al: 5 },   // mesmas medidas de 'a'
    { id: 'c', bat: 12, al: 5 },
    { id: 'd', bat: 15, al: 5 },
    { id: 'e', bat: null, al: null },  // nada a atualizar
  ];
  const calcular = (k: typeof kits[number]) => {
    const u: Record<string, unknown> = {};
    if (k.bat != null) u.batente_cm = k.bat;
    if (k.al != null) u.alizar_l = k.al;
    return u;
  };

  it('junta quem recebe a mesma atualização', () => {
    const grupos = agruparPorAtualizacao(kits, calcular);
    expect(grupos).toHaveLength(2);
    const g15 = grupos.find(g => g.updates.batente_cm === 15)!;
    expect(g15.itens.map(i => i.id)).toEqual(['a', 'b', 'd']);
    expect(grupos.find(g => g.updates.batente_cm === 12)!.itens.map(i => i.id)).toEqual(['c']);
  });

  it('deixa de fora quem não tem nada a atualizar', () => {
    const ids = agruparPorAtualizacao(kits, calcular).flatMap(g => g.itens.map(i => i.id));
    expect(ids).not.toContain('e');
  });

  it('a ordem das chaves no payload não separa grupos', () => {
    const grupos = agruparPorAtualizacao(
      [{ n: 1 }, { n: 2 }],
      ({ n }) => (n === 1 ? { a: 1, b: 2 } : { b: 2, a: 1 }),
    );
    expect(grupos).toHaveLength(1);
    expect(grupos[0].itens).toHaveLength(2);
  });

  it('valores diferentes na mesma coluna não se misturam', () => {
    const grupos = agruparPorAtualizacao([{ v: 1 }, { v: 2 }], ({ v }) => ({ col: v }));
    expect(grupos).toHaveLength(2);
  });

  it('lista vazia não gera grupo', () => {
    expect(agruparPorAtualizacao([], () => ({ a: 1 }))).toEqual([]);
  });
});
