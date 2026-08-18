import { describe, it, expect } from 'vitest';
import { marcarRegra, marcarManual, veioDeRegra, limparCamposDeRegra } from '@/lib/origem';

describe('marcarRegra', () => {
  it('acrescenta sem repetir e mantém ordem estável', () => {
    expect(marcarRegra([], ['cor'])).toEqual(['cor']);
    expect(marcarRegra(['cor'], ['cor'])).toEqual(['cor']);
    expect(marcarRegra(['movimento'], ['cor'])).toEqual(['cor', 'movimento']);
  });

  it('lista nula (produto de base antiga) é tratada como vazia', () => {
    expect(marcarRegra(null, ['cor'])).toEqual(['cor']);
    expect(marcarRegra(undefined, ['cor'])).toEqual(['cor']);
  });

  it('ignora campo que não é preenchível por regra', () => {
    expect(marcarRegra([], ['preco', 'descricao', 'cor'])).toEqual(['cor']);
  });
});

describe('marcarManual', () => {
  it('remove os campos editados à mão', () => {
    expect(marcarManual(['cor', 'movimento'], ['cor'])).toEqual(['movimento']);
  });

  it('remover campo que não está na lista não quebra nada', () => {
    expect(marcarManual(['cor'], ['visor'])).toEqual(['cor']);
    expect(marcarManual(null, ['cor'])).toEqual([]);
  });

  it('editar à mão um campo de regra o torna intocável pela revisão', () => {
    const depoisDaRegra = marcarRegra([], ['cor', 'movimento']);
    const depoisDaMao = marcarManual(depoisDaRegra, ['cor']);
    expect(veioDeRegra(depoisDaMao, 'cor')).toBe(false);
    expect(veioDeRegra(depoisDaMao, 'movimento')).toBe(true);
    expect(limparCamposDeRegra(depoisDaMao)).toEqual({ campos_regra: [], movimento: null });
  });
});

describe('limparCamposDeRegra', () => {
  it('zera a lista e anula cada campo de regra', () => {
    expect(limparCamposDeRegra(['cor', 'alizar_l'])).toEqual({
      campos_regra: [], cor: null, alizar_l: null,
    });
  });

  it('produto sem nada de regra é ignorado pela revisão', () => {
    expect(limparCamposDeRegra([])).toBeNull();
    expect(limparCamposDeRegra(null)).toBeNull();
  });
});
