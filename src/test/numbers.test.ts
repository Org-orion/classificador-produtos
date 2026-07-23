import { describe, it, expect } from 'vitest';

import { formatPtNumber, normalizePtNumberText, parsePtNumber } from '../lib/numbers';

describe('numbers', () => {
  it('parsePtNumber aceita vírgula e ponto', () => {
    expect(parsePtNumber('3,5')).toBe(3.5);
    expect(parsePtNumber('3.5')).toBe(3.5);
    expect(parsePtNumber('')).toBe(null);
    expect(parsePtNumber('abc')).toBe(null);
  });

  it('normalizePtNumberText normaliza para string numérica', () => {
    expect(normalizePtNumberText(' 210 ')).toBe('210');
    expect(normalizePtNumberText('3,5')).toBe('3.5');
    expect(normalizePtNumberText('x')).toBe(null);
  });

  it('formatPtNumber formata com vírgula', () => {
    expect(formatPtNumber(null)).toBe('');
    expect(formatPtNumber(3.5)).toBe('3,5');
    expect(formatPtNumber(210)).toBe('210');
  });
});

