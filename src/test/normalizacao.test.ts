import { describe, it, expect } from 'vitest';
import { normalizarDescricao, hashDescricao } from '@/lib/normalizacao';

describe('normalizarDescricao', () => {
  it('preserva o original e gera versão maiúscula sem acento', () => {
    const r = normalizarDescricao('Rodapé Innovazione Branco');
    expect(r.original).toBe('Rodapé Innovazione Branco'); // valor exibido intocado
    expect(r.normalizada).toBe('RODAPE INNOVAZIONE BRANCO');
  });

  it('remove cedilha e acentos na versão de comparação', () => {
    expect(normalizarDescricao('DOBRADIÇA').normalizada).toBe('DOBRADICA');
  });

  it('padroniza separador de dimensão e cola unidade (amostra real)', () => {
    const r = normalizarDescricao('PORTA INNOVAZIONE LISA SARRAFO 3MM UV BRANCO C/ VENEZIANA 210x70x3,5CM');
    expect(r.normalizada).toContain('210X70X3,5CM');
    expect(r.normalizada).not.toContain('/'); // "C/" vira separador → espaço
  });

  it('colapsa espaços e produz tokens', () => {
    const r = normalizarDescricao('KIT   PORTA   CORRER');
    expect(r.normalizada).toBe('KIT PORTA CORRER');
    expect(r.tokens).toEqual(['KIT', 'PORTA', 'CORRER']);
  });

  it('aplica aliases cadastrados (palavra inteira)', () => {
    const r = normalizarDescricao('LS SARRAFO', { LS: 'LISA' });
    expect(r.normalizada).toBe('LISA SARRAFO');
  });

  it('entrada não-string não quebra', () => {
    expect(normalizarDescricao(null).normalizada).toBe('');
    expect(normalizarDescricao(123 as unknown).original).toBe('');
  });

  it('hash é estável e muda com o conteúdo', () => {
    expect(hashDescricao('ABC')).toBe(hashDescricao('ABC'));
    expect(hashDescricao('ABC')).not.toBe(hashDescricao('ABD'));
  });
});
