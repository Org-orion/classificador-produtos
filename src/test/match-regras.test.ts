import { describe, it, expect } from 'vitest';
import { casaRegraAtributo, iniciaPalavra } from '@/lib/match-regras';

// Descrições no formato real do catálogo: sigla colada na medida dentro dos
// parênteses — BAT15CM para batente, AL5X8,5CM para alizar.
const SEM_ALIZAR = 'KIT PORTA CORRER INNOV. LS SARR. 3MM UV CURUPIXA 210X80X3,5CM(BAT15CM)';
const COM_ALIZAR = 'KIT PORTA ESSENZ. LS SARR. 3MM LACCA TOUCH BIANCO 210X70(BAT12CM AL5X8,5CM)';

describe('casaRegraAtributo — não contém', () => {
  it('aplica quando a sigla não aparece na descrição', () => {
    expect(casaRegraAtributo(SEM_ALIZAR, 'AL', 'nao_contem')).toBe(true);
  });

  it('não aplica quando a sigla vem colada na medida (AL5X8,5CM)', () => {
    expect(casaRegraAtributo(COM_ALIZAR, 'AL', 'nao_contem')).toBe(false);
  });

  it('não aplica quando a descrição traz a palavra inteira (ALIZAR)', () => {
    expect(casaRegraAtributo('ALIZAR LACCA TOUCH BIANCO MTX 224X5,0X8,5X1,0CM', 'AL', 'nao_contem')).toBe(false);
  });

  it('ignora a sigla no meio de outra palavra — o ponto do casamento por palavra', () => {
    for (const d of ['RODAPE METAL ESCOVADO 15CM', 'PORTA GERAL CRISTAL', 'BATENTE NATURAL']) {
      expect(casaRegraAtributo(d, 'AL', 'nao_contem')).toBe(true);
    }
  });

  it('é indiferente à caixa do critério', () => {
    expect(casaRegraAtributo(COM_ALIZAR, 'al', 'nao_contem')).toBe(false);
  });

  it('não quebra com critério que tem caractere especial de regex', () => {
    expect(() => casaRegraAtributo(COM_ALIZAR, 'PROTECT +', 'nao_contem')).not.toThrow();
    expect(casaRegraAtributo('KIT PORTA ELO PROTECT + 210X70', 'PROTECT +', 'nao_contem')).toBe(false);
    expect(casaRegraAtributo('KIT PORTA ELO 210X70', '(AL', 'nao_contem')).toBe(true);
  });

  it('critério vazio não casa nada, então a regra aplicaria a tudo', () => {
    expect(iniciaPalavra(COM_ALIZAR, '')).toBe(false);
  });
});

describe('casaRegraAtributo — tipos existentes seguem por substring', () => {
  it('contem continua achando trecho no meio da palavra (regras já cadastradas dependem disso)', () => {
    expect(casaRegraAtributo('KIT PORTA CORRER 210X80', 'CORR', 'contem')).toBe(true);
    expect(casaRegraAtributo('KIT PORTA 210X230X80', '230x', 'contem')).toBe(true);
    // o mesmo critério, negado, exigiria início de palavra
    expect(casaRegraAtributo('RODAPE METAL', 'AL', 'contem')).toBe(true);
  });

  it('comeca_com, termina_com e exato', () => {
    expect(casaRegraAtributo(SEM_ALIZAR, 'KIT PORTA', 'comeca_com')).toBe(true);
    expect(casaRegraAtributo(SEM_ALIZAR, '(BAT15CM)', 'termina_com')).toBe(true);
    expect(casaRegraAtributo('PORTA', 'porta', 'exato')).toBe(true);
    expect(casaRegraAtributo('PORTA LISA', 'porta', 'exato')).toBe(false);
  });

  it('tipo desconhecido não casa', () => {
    expect(casaRegraAtributo(SEM_ALIZAR, 'AL', 'regex')).toBe(false);
  });
});
