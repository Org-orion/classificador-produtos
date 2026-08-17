import { describe, it, expect } from 'vitest';
import { camposFaltando, situacaoCorreta } from '@/lib/completude';
import { Produto } from '@/types/database';

/** Produto com tudo vazio; cada teste preenche só o que interessa. */
function produto(over: Partial<Produto>): Produto {
  return {
    id: 'x', codigo: null, descricao: '', unidade: null, codigo_barras: null, preco: null,
    tipo_produto: null, movimento: null, linha: null, perfil: null, enchimento: null,
    revestimento: null, cor: null, altura_cm: null, largura_cm: null, espessura_cm: null,
    batente_cm: null, batente_tipo: null, alizar_l: null, alizar_a: null, alizar_e: null,
    protect_plus: null, veneziana: null, visor: null,
    tem_bandeira: false, tem_visor: false, tem_veneziana: false,
    categoria_id: null, subcategoria_id: null, situacao: 'pendente',
    created_at: '', updated_at: '',
    ...over,
  };
}

describe('ALIZAR — só exige revestimento, cor, altura, espessura e alizar', () => {
  // 1002355 ALIZAR LACCA TOUCH BIANCO MTX 224x5,0x8,5x1,0CM
  const completo = produto({
    tipo_produto: 'ALIZAR', revestimento: 'Lacca Touch', cor: 'BIANCO',
    altura_cm: 224, espessura_cm: 1, alizar_l: 5, alizar_a: 8.5,
  });

  it('fica classificado sem movimento, enchimento, linha, perfil nem largura', () => {
    expect(camposFaltando(completo)).toEqual([]);
    expect(situacaoCorreta(completo)).toBe('classificado');
  });

  it('sem a regulagem do alizar, segue pendente', () => {
    const p = produto({ ...completo, alizar_a: null });
    expect(camposFaltando(p)).toContain('alizar');
    expect(situacaoCorreta(p)).toBe('pendente');
  });

  it('medida 0 no alizar significa "não tem" e não pendura o produto', () => {
    const p = produto({ ...completo, alizar_l: 0, alizar_a: null });
    expect(camposFaltando(p)).toEqual([]);
    expect(situacaoCorreta(p)).toBe('classificado');
  });
});

describe('BATENTE — não exige altura nem os atributos de porta', () => {
  // 1002067 BATENTE ELO BRANCO C/ BORRACHA…
  const completo = produto({
    tipo_produto: 'BATENTE', revestimento: 'ELO', cor: 'BRANCO',
    largura_cm: 7.5, espessura_cm: 3,
  });

  it('fica classificado', () => {
    expect(camposFaltando(completo)).toEqual([]);
    expect(situacaoCorreta(completo)).toBe('classificado');
  });

  it('não exige a medida de batente (essa é do KIT PORTA)', () => {
    expect(camposFaltando(completo)).not.toContain('batente_cm');
  });

  it('sem cor, volta a pendente', () => {
    expect(situacaoCorreta(produto({ ...completo, cor: null }))).toBe('pendente');
  });
});

describe('KIT PORTA — exige tudo, incluindo batente e alizar', () => {
  const completo = produto({
    tipo_produto: 'KIT PORTA', movimento: 'GIRO', enchimento: 'Sarrafo 3mm',
    revestimento: 'Lacca Touch', linha: 'Essenziale', perfil: 'LISA', cor: 'BIANCO',
    protect_plus: 'Não', veneziana: 'Não', visor: 'Não',
    altura_cm: 210, largura_cm: 70, espessura_cm: 3.5,
    batente_cm: 12, alizar_l: 5, alizar_a: 8.5,
  });

  it('fica classificado', () => {
    expect(situacaoCorreta(completo)).toBe('classificado');
  });

  it('sem a medida do batente, segue pendente', () => {
    const p = produto({ ...completo, batente_cm: null });
    expect(camposFaltando(p)).toEqual(['batente_cm']);
    expect(situacaoCorreta(p)).toBe('pendente');
  });

  it('sem alizar declarado (nem medida, nem 0), segue pendente', () => {
    const p = produto({ ...completo, alizar_l: null, alizar_a: null });
    expect(camposFaltando(p)).toEqual(['alizar']);
  });
});

describe('produto sem tipo definido', () => {
  it('cobra todos os campos, porque sem o tipo não se sabe o que se aplica', () => {
    const faltando = camposFaltando(produto({}));
    expect(faltando).toContain('tipo_produto');
    expect(faltando).toContain('movimento');
    expect(faltando).toContain('altura_cm');
  });
});

describe('RODAPE — limitação conhecida das regras atuais', () => {
  it('exige atributos de porta (movimento, enchimento, linha) e por isso nunca fecha', () => {
    // 1001835 RODAPE LS RETO LACCA TOUCH URBAN — completo do ponto de vista do produto
    const p = produto({
      tipo_produto: 'RODAPE', revestimento: 'Lacca Touch', perfil: 'LISA', cor: 'URBAN',
      protect_plus: 'Não', veneziana: 'Não', visor: 'Não',
      altura_cm: 240, largura_cm: 7, espessura_cm: 0.8,
    });
    // Documenta o comportamento de hoje: só ALIZAR e BATENTE têm campos declarados
    // como "não se aplica". Se rodapé não deve movimento/enchimento/linha, isso
    // precisa ser declarado nas regras de aplicabilidade.
    expect(camposFaltando(p)).toEqual(['movimento', 'enchimento', 'linha']);
    expect(situacaoCorreta(p)).toBe('pendente');
  });
});
