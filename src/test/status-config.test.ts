import { describe, it, expect } from 'vitest';
import {
  STATUS_FLOW, STATUS_ELEGIVEIS, ORDEM_MINIMA_ELEGIVEL,
  isStatusElegivel, ordemStatus,
} from '@/lib/status-config';

describe('status-config', () => {
  it('em_carregamento é o corte (ordem 12) e é elegível', () => {
    expect(ordemStatus('em_carregamento')).toBe(ORDEM_MINIMA_ELEGIVEL);
    expect(isStatusElegivel('em_carregamento')).toBe(true);
  });

  it('status anteriores ao carregamento NÃO são elegíveis', () => {
    for (const s of ['aguardando_avaliacao', 'liberado_producao', 'em_producao', 'producao_finalizada']) {
      expect(isStatusElegivel(s)).toBe(false);
    }
  });

  it('status pós-carregamento são elegíveis', () => {
    for (const s of ['despachado', 'faturado', 'em_entrega', 'entregue', 'finalizado']) {
      expect(isStatusElegivel(s)).toBe(true);
    }
  });

  it('status desconhecido/nulo não é elegível (default deny)', () => {
    expect(isStatusElegivel('inexistente')).toBe(false);
    expect(isStatusElegivel(null)).toBe(false);
    expect(isStatusElegivel(undefined)).toBe(false);
    expect(ordemStatus('inexistente')).toBe(0);
  });

  it('a lista elegível é exatamente ordem >= 12 (8 status)', () => {
    expect(STATUS_ELEGIVEIS).toEqual(
      STATUS_FLOW.filter((s) => s.order >= 12).map((s) => s.value),
    );
    expect(STATUS_ELEGIVEIS).toHaveLength(8);
  });
});
