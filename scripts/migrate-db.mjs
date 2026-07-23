/**
 * Migração entre projetos Supabase
 *
 * Uso:
 *   node scripts/migrate-db.mjs \
 *     --src-url  https://PROJETO_ORIGEM.supabase.co \
 *     --src-key  <service_role_key_origem> \
 *     --dest-url https://PROJETO_DESTINO.supabase.co \
 *     --dest-key <service_role_key_destino>
 *
 * A origem lê do .env se --src-url / --src-key não forem passados.
 * Use a service_role key (Supabase Dashboard → Settings → API → service_role).
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// ── helpers ────────────────────────────────────────────────────────────────

function parseArgs() {
  const args = process.argv.slice(2);
  const map = {};
  for (let i = 0; i < args.length; i += 2) {
    map[args[i].replace(/^--/, '')] = args[i + 1];
  }
  return map;
}

function loadEnv() {
  try {
    const raw = readFileSync(resolve(process.cwd(), '.env'), 'utf-8');
    return Object.fromEntries(
      raw.split('\n')
        .filter(l => l.includes('='))
        .map(l => l.split('=').map(s => s.trim().replace(/^"|"$/g, '')))
    );
  } catch {
    return {};
  }
}

function log(msg) { process.stdout.write(msg + '\n'); }

// ── tabelas em ordem de inserção (respeita FK) ─────────────────────────────

const TABLES = [
  'concremprodutos_usuarios',
  'concremprodutos_categorias',
  'concremprodutos_subcategorias',
  'concremprodutos_opcoes_classificacao',
  'concremprodutos_regras_classificacao',
  'concremprodutos_regras_atributo',
  'concremprodutos_produtos',
];

// ── migração de uma tabela ─────────────────────────────────────────────────

async function migrateTable(src, dest, table) {
  log(`\n[${table}]`);

  // lê todos os registros da origem em páginas de 1000
  let all = [];
  let from = 0;
  const PAGE = 1000;
  while (true) {
    const { data, error } = await src.from(table).select('*').range(from, from + PAGE - 1);
    if (error) throw new Error(`Leitura de ${table}: ${error.message}`);
    if (!data || data.length === 0) break;
    all = [...all, ...data];
    if (data.length < PAGE) break;
    from += PAGE;
  }

  log(`  → ${all.length} registros lidos`);

  if (all.length === 0) {
    log('  → nada a migrar');
    return;
  }

  // apaga dados existentes no destino (para evitar conflito de PK)
  const { error: delErr } = await dest.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (delErr) log(`  ⚠ aviso ao limpar destino: ${delErr.message}`);

  // insere em lotes de 500
  const BATCH = 500;
  for (let i = 0; i < all.length; i += BATCH) {
    const batch = all.slice(i, i + BATCH);
    const { error: insErr } = await dest.from(table).insert(batch);
    if (insErr) throw new Error(`Inserção em ${table} (lote ${i / BATCH + 1}): ${insErr.message}`);
    log(`  → inseridos ${Math.min(i + BATCH, all.length)} / ${all.length}`);
  }

  log(`  ✓ concluído`);
}

// ── main ───────────────────────────────────────────────────────────────────

async function main() {
  const args = parseArgs();
  const env = loadEnv();

  const srcUrl  = args['src-url']  || env['VITE_SUPABASE_URL'];
  const srcKey  = args['src-key']  || env['VITE_SUPABASE_SERVICE_KEY'] || env['VITE_SUPABASE_PUBLISHABLE_KEY'];
  const destUrl = args['dest-url'];
  const destKey = args['dest-key'];

  if (!srcUrl || !srcKey)  { log('Erro: informe --src-url e --src-key (ou configure o .env)'); process.exit(1); }
  if (!destUrl || !destKey) { log('Erro: informe --dest-url e --dest-key'); process.exit(1); }

  log('Origem : ' + srcUrl);
  log('Destino: ' + destUrl);

  const src  = createClient(srcUrl,  srcKey,  { auth: { persistSession: false } });
  const dest = createClient(destUrl, destKey, { auth: { persistSession: false } });

  for (const table of TABLES) {
    await migrateTable(src, dest, table);
  }

  log('\n✅ Migração concluída!');
  log('\nAtualize o .env com as credenciais do novo projeto e reinicie a aplicação.');
}

main().catch(err => { log('\n❌ ' + err.message); process.exit(1); });
