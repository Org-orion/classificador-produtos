/**
 * Exemplo de como uma aplicação externa consome os filtros.
 *
 * 1) Busca a configuração de filtros (campos, labels, regras de visibilidade)
 * 2) Para filtros com options=[], busca os valores distintos dos produtos
 * 3) Para o filtro composto "alizar", combina alizar_l + alizar_a
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://SEU_PROJETO.supabase.co',
  'SUA_ANON_KEY'
);

// ── 1. Configuração de filtros ─────────────────────────────────────────────
const { data: filtros, error } = await supabase.rpc('concremprodutos_get_filtros');
if (error) throw error;

console.log('Filtros disponíveis:');
console.log(JSON.stringify(filtros, null, 2));

/*
  Exemplo de retorno:
  [
    { "field": "tipo_produto",  "label": "Tipo",          "type": "select",    "applies_to": ["all"],                               "options": ["ALIZAR","BATENTE","FOLHA","KIT PORTA","PORTA"] },
    { "field": "movimento",     "label": "Movimento",     "type": "select",    "applies_to": ["KIT PORTA","PORTA","FOLHA"],          "options": ["CORRER","DUPLA","GIRO","PIVÔ"] },
    { "field": "enchimento",    "label": "Enchimento",    "type": "select",    "applies_to": ["KIT PORTA","PORTA","FOLHA"],          "options": ["Sarrafo 3mm","Sarrafo 6mm","Semi-oca","Sólida"] },
    { "field": "revestimento",  "label": "Revestimento",  "type": "select",    "applies_to": ["KIT PORTA","PORTA","FOLHA","ALIZAR"], "options": ["Lacca Touch","Natura","UV"] },
    { "field": "linha",         "label": "Linha",         "type": "select",    "applies_to": ["KIT PORTA","PORTA","FOLHA"],          "options": ["Essenziale","Innovazione"] },
    { "field": "perfil",        "label": "Liso/Frisado",  "type": "select",    "applies_to": ["KIT PORTA","PORTA","FOLHA"],          "options": ["FRISADA","LISA"] },
    { "field": "cor",           "label": "Cor",           "type": "select",    "applies_to": ["KIT PORTA","PORTA","FOLHA","ALIZAR"], "options": [] },
    { "field": "protect_plus",  "label": "Protect+",      "type": "select",    "applies_to": ["KIT PORTA","PORTA","FOLHA"],          "options": ["Não","Sim"] },
    { "field": "veneziana",     "label": "Veneziana",     "type": "select",    "applies_to": ["KIT PORTA","PORTA","FOLHA"],          "options": ["Não","Sim"] },
    { "field": "visor",         "label": "Visor",         "type": "select",    "applies_to": ["KIT PORTA","PORTA","FOLHA"],          "options": ["Não","Sim"] },
    { "field": "altura_cm",     "label": "Altura (cm)",   "type": "numeric",   "applies_to": ["KIT PORTA","PORTA","FOLHA","ALIZAR"], "options": [] },
    { "field": "largura_cm",    "label": "Largura (cm)",  "type": "numeric",   "applies_to": ["all"],                               "options": [] },
    { "field": "espessura_cm",  "label": "Espessura (cm)","type": "numeric",   "applies_to": ["all"],                               "options": [] },
    { "field": "batente_cm",    "label": "Batente (cm)",  "type": "numeric",   "applies_to": ["KIT PORTA"],                         "options": [] },
    { "field": "alizar",        "label": "Alizar",        "type": "composite", "applies_to": ["KIT PORTA"],                         "options": [] },
    { "field": "situacao",      "label": "Status",        "type": "select",    "applies_to": ["all"],                               "options": ["classificado","pendente"] }
  ]
*/

// ── 2. Buscar valores dinâmicos para filtros com options=[] ────────────────
const camposDinamicos = filtros
  .filter(f => f.type !== 'composite' && f.options.length === 0 && f.field !== 'alizar')
  .map(f => f.field);

const { data: produtos } = await supabase
  .from('concremprodutos_produtos')
  .select(camposDinamicos.join(','));

for (const campo of camposDinamicos) {
  const valores = [...new Set(produtos.map(p => p[campo]).filter(Boolean))].sort();
  const filtro = filtros.find(f => f.field === campo);
  if (filtro) filtro.options = valores;
}

// ── 3. Valores dinâmicos para o filtro composto "alizar" ───────────────────
const { data: alizarRows } = await supabase
  .from('concremprodutos_produtos')
  .select('alizar_l,alizar_a')
  .not('alizar_l', 'is', null)
  .not('alizar_a', 'is', null);

const alizarOpts = [...new Set(
  alizarRows.map(r => `${String(r.alizar_l).replace('.', ',')}x${String(r.alizar_a).replace('.', ',')}`)
)].sort();

filtros.find(f => f.field === 'alizar').options = alizarOpts;

// ── 4. Montar filtros ativos para um tipo específico ───────────────────────
function getFiltrosParaTipo(tipo) {
  return filtros.filter(f =>
    f.applies_to.includes('all') || f.applies_to.includes(tipo)
  );
}

console.log('\nFiltros para KIT PORTA:');
getFiltrosParaTipo('KIT PORTA').forEach(f =>
  console.log(`  ${f.label} (${f.type}): ${f.options.slice(0, 5).join(', ')}${f.options.length > 5 ? '...' : ''}`)
);

console.log('\nFiltros para ALIZAR:');
getFiltrosParaTipo('ALIZAR').forEach(f =>
  console.log(`  ${f.label} (${f.type}): ${f.options.slice(0, 5).join(', ')}`)
);

console.log('\nFiltros para BATENTE:');
getFiltrosParaTipo('BATENTE').forEach(f =>
  console.log(`  ${f.label} (${f.type}): ${f.options.slice(0, 5).join(', ')}`)
);
