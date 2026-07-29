// =============================================================================
// Configuração ÚNICA da ordem operacional dos status de pedido.
// Espelha o `pedidoStatusFlow` do faturamento (fonte de verdade do fluxo).
// Elegível para ingestão no classificador = ordem >= 12 (em_carregamento em diante).
//
// NOTA (banco compartilhado): a versão administrável desta lista viverá em
// `concremprodutos_status_elegiveis` (Etapa 3 migration). Esta constante é o
// espelho no código; testes garantem que as duas não divirjam silenciosamente.
// PROIBIDO comparar status alfabeticamente ou espalhar listas soltas pelo app.
// =============================================================================

export interface StatusDef {
  order: number;
  value: string;
  label: string;
}

/** Ordem operacional dos status (espelho de faturamento/pedidoStatusFlow.ts). */
export const STATUS_FLOW: readonly StatusDef[] = [
  { order: 1,  value: 'aguardando_avaliacao',   label: 'Aguardando Avaliação' },
  { order: 2,  value: 'aguardando_mapeamento',  label: 'Aguardando Mapeamento' },
  { order: 3,  value: 'mapeamento_concluido',   label: 'Mapeamento Concluído' },
  { order: 4,  value: 'aguardando_ferragem',    label: 'Aguardando Ferragem' },
  { order: 5,  value: 'ferragem_recebida',      label: 'Ferragem Recebida' },
  { order: 6,  value: 'liberado_comercial',     label: 'Liberado Comercial' },
  { order: 7,  value: 'aguardando_gerencia',    label: 'Aguardando Gerência' },
  { order: 8,  value: 'confirmado_gerencia',    label: 'Confirmado Gerência' },
  { order: 9,  value: 'liberado_producao',      label: 'Liberado Produção' },
  { order: 10, value: 'em_producao',            label: 'Em Produção' },
  { order: 11, value: 'producao_finalizada',    label: 'Produção Finalizada' },
  { order: 12, value: 'em_carregamento',        label: 'Em Carregamento' },
  { order: 13, value: 'despachado',             label: 'Despachado' },
  { order: 14, value: 'faturado',               label: 'Faturado' },
  { order: 15, value: 'em_entrega',             label: 'Em Rota' },
  { order: 16, value: 'parcialmente_entregue',  label: 'Parcialmente Entregue' },
  { order: 17, value: 'entregue',               label: 'Entregue' },
  { order: 18, value: 'aguardando_pagamento',   label: 'Aguardando Pagamento' },
  { order: 19, value: 'finalizado',             label: 'Finalizado' },
];

/** A partir de qual ordem um pedido é elegível para o classificador. */
export const ORDEM_MINIMA_ELEGIVEL = 12;

const byValue = new Map(STATUS_FLOW.map((s) => [s.value, s] as const));

/** Ordem do status; 0 se desconhecido (nunca elegível). */
export function ordemStatus(status: string | null | undefined): number {
  if (!status) return 0;
  return byValue.get(status.trim())?.order ?? 0;
}

/** Lista canônica de status elegíveis (ordem >= 12). */
export const STATUS_ELEGIVEIS: readonly string[] = STATUS_FLOW
  .filter((s) => s.order >= ORDEM_MINIMA_ELEGIVEL)
  .map((s) => s.value);

/** Um pedido com este status atual é elegível para ingestão? */
export function isStatusElegivel(status: string | null | undefined): boolean {
  const o = ordemStatus(status);
  return o >= ORDEM_MINIMA_ELEGIVEL;
}
