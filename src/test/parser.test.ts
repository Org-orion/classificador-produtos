import { describe, it, expect } from 'vitest';

import { parseProduto } from '../lib/parser';

describe('parseProduto', () => {
  it('ignora prefixo "COD -" na descrição', () => {
    const withCode = '1000452 - KIT PORTA INNOV. LS SOLIDA UV BRANCO 210x62x3,5CM(Bat PET6,5CM)';
    const withoutCode = 'KIT PORTA INNOV. LS SOLIDA UV BRANCO 210x62x3,5CM(Bat PET6,5CM)';

    const a = parseProduto(withCode);
    const b = parseProduto(withoutCode);

    expect(a).toEqual(b);
    expect(a).toMatchObject({
      tipo_produto: 'KIT PORTA',
      movimento: null,
      linha: 'Innovazione',
      perfil: 'Liso',
      enchimento: 'Sólida',
      revestimento: 'UV',
      cor: 'BRANCO',
      altura_cm: 210,
      largura_cm: 62,
      espessura_cm: 3.5,
      batente_tipo: 'PET',
      batente_cm: 6.5,
    });
  });

  it('classifica tipo_produto PORTA/ALIZAR/BATENTE pelo início', () => {
    expect(parseProduto('PORTA LISA UV BRANCO 210x62x3,5CM').tipo_produto).toBe('PORTA');
    expect(parseProduto('ALIZAR LACCA TOUCH BIANCO MTX 224x5,0x5,5x1,0CM').tipo_produto).toBe('ALIZAR');
    expect(parseProduto('BATENTE PET 6,5CM').tipo_produto).toBe('BATENTE');
  });
});

