import { describe, it, expect } from 'vitest';
import { parseProduto } from '@/lib/parser';

/**
 * Regressão do incidente de 2026-09-22: largura recebendo a espessura e altura
 * recebendo a largura em ~2.400 produtos, quebrando o mapeamento da Leroy.
 *
 * A leitura da descrição nunca esteve errada — o motor é que não a usava para
 * altura/largura/espessura da folha, deixando essas três medidas para as regras
 * de trecho, que são ambíguas ("x60" e "x3,5CM" casam com a mesma descrição).
 * Estes testes fixam a leitura por posição, que é a fonte correta.
 */
describe('medidas da folha lidas por posição', () => {
  const casos: [string, string, number, number, number][] = [
    ['52180',    'KIT PORTA LS SARR. 3MM UV BRANCO 210x80x3,5CM(Bat7,5CM AL7x8,5CM CAB.10CM)', 210, 80, 3.5],
    ['52144',    'KIT PORTA LS SARR. 3MM UV BRANCO 210x60x3,5CM(Bat7,5CM AL7x8,5CM CAB.10CM)', 210, 60, 3.5],
    ['14007111', 'KIT PORTA ELO BRANCO 210x80x3,5CM(Bat7,5CM AL5x8,5CM)',                      210, 80, 3.5],
    ['14007123', 'KIT PORTA ELO BRANCO 210x60x3,5CM(Bat7,5CM AL5x8,5CM)',                      210, 60, 3.5],
    ['36661',    'PORTA ARTENS ESSENZIALE LISA SARRAFO 3MM UV BRANCO 210x60x3,5CM',            210, 60, 3.5],
    ['36671',    'PORTA ARTENS ESSENZIALE LISA SARRAFO 3MM UV BRANCO 210x90x3,5CM',            210, 90, 3.5],
    ['36674',    'PORTA ARTENS ESSENZIALE LISA SARRAFO 3MM UV BRANCO 210x100x3,5CM',           210, 100, 3.5],
  ];

  for (const [codigo, descricao, altura, largura, espessura] of casos) {
    it(`${codigo} → ${altura} × ${largura} × ${espessura}`, () => {
      const p = parseProduto(descricao);
      expect(p.altura_cm).toBe(altura);
      expect(p.largura_cm).toBe(largura);
      expect(p.espessura_cm).toBe(espessura);
    });
  }

  it('a largura nunca é a espessura, mesmo com 3,5 no fim da descrição', () => {
    for (const [, descricao] of casos.map(c => [c[0], c[1]] as const)) {
      expect(parseProduto(descricao).largura_cm).not.toBe(3.5);
    }
  });

  it('a altura é a primeira medida, não a largura', () => {
    expect(parseProduto('PORTA … 210x100x3,5CM').altura_cm).toBe(210);
    expect(parseProduto('PORTA … 210x90x3,5CM').altura_cm).toBe(210);
  });

  it('o batente do kit não é confundido com as medidas da folha', () => {
    const p = parseProduto('KIT PORTA LS SARR. 3MM UV BRANCO 210x60x3,5CM(Bat7,5CM AL7x8,5CM CAB.10CM)');
    expect(p.batente_cm).toBe(7.5);
    expect(p.alizar_l).toBe(7);
    expect(p.alizar_a).toBe(8.5);
  });

  it('pivotante de 230 mantém a altura na primeira posição', () => {
    const p = parseProduto('KIT PORTA PIVÔ LS SARR. 3MM UV BRANCO 230x110x3,5CM(Bat15CM AL5x8,5CM)');
    expect(p.altura_cm).toBe(230);
    expect(p.largura_cm).toBe(110);
  });
});
