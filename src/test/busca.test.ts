import { describe, it, expect } from 'vitest';
import { casaBusca, normalizaBusca } from '@/lib/busca';

const DESC = 'KIT PORTA ESSENZ. LS SARR. 3MM LACCA TOUCH BIANCO 210X70';
const CODIGO = '1002382';

describe('casaBusca', () => {
  it('termo vazio ou só espaço casa com tudo (filtro inerte)', () => {
    expect(casaBusca('', CODIGO, DESC)).toBe(true);
    expect(casaBusca('   ', CODIGO, DESC)).toBe(true);
  });

  it('acha por trecho da descrição, em qualquer caixa', () => {
    expect(casaBusca('lacca touch', CODIGO, DESC)).toBe(true);
    expect(casaBusca('BIANCO', CODIGO, DESC)).toBe(true);
    expect(casaBusca('210x70', CODIGO, DESC)).toBe(true);
  });

  it('acha pelo código', () => {
    expect(casaBusca('1002382', CODIGO, DESC)).toBe(true);
    expect(casaBusca('2382', CODIGO, DESC)).toBe(true);
  });

  it('ignora acento nos dois lados da comparação', () => {
    expect(casaBusca('colmeia', null, 'ENCHIMENTO COLMÉIA')).toBe(true);
    expect(casaBusca('COLMÉIA', null, 'ENCHIMENTO COLMEIA')).toBe(true);
    expect(casaBusca('melaminico', null, 'REVESTIMENTO MELAMÍNICO')).toBe(true);
  });

  it('não casa o que não está em nenhum campo', () => {
    expect(casaBusca('RODAPE', CODIGO, DESC)).toBe(false);
  });

  it('campo nulo não quebra', () => {
    expect(casaBusca('KIT', null, undefined, DESC)).toBe(true);
    expect(casaBusca('KIT', null, undefined)).toBe(false);
  });

  it('espaço nas pontas do termo é ignorado', () => {
    expect(casaBusca('  bianco  ', CODIGO, DESC)).toBe(true);
  });
});

describe('normalizaBusca', () => {
  it('sobe a caixa e remove acento', () => {
    expect(normalizaBusca('Colméia')).toBe('COLMEIA');
    expect(normalizaBusca('PIVÔ')).toBe('PIVO');
    expect(normalizaBusca('Melamínico')).toBe('MELAMINICO');
  });
});
