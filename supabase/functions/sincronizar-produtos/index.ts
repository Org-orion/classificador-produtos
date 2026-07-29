import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { normalizarDescricao } from './normalizacao.ts';
import { classificar, type Regra } from './motor.ts';

// =============================================================================
// Edge Function `sincronizar-produtos` (administrativa). Fluxo backend:
//   1. valida admin (JWT do Supabase Auth) → usa service_role para o resto
//   2. RPC concremprodutos_ingerir_pedidos (ingestão set-based + lock + incremental)
//   3. processa a fila em LOTE: normaliza (mesma função do app) + classifica (motor)
//   4. grava classificações, atualiza descobertos, registra logs com correlation_id
// NÃO publica no catálogo (isso é Etapa 6). NÃO toca preço.
// Deploy via CLI (bundla os arquivos irmãos): supabase functions deploy sincronizar-produtos
// =============================================================================

const BATCH = 200;
const VERSAO_MOTOR = 'motor-v1';

const ALLOWED = (Deno.env.get('ALLOWED_ORIGINS') ?? '').split(',').map((s) => s.trim()).filter(Boolean);
function cors(origin: string | null): Record<string, string> {
  const o = !origin ? (ALLOWED[0] ?? '*') : ALLOWED.length === 0 ? origin : (ALLOWED.includes(origin) ? origin : ALLOWED[0]);
  return { 'Access-Control-Allow-Origin': o, 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Vary': 'Origin' };
}
function json(body: unknown, status: number, origin: string | null): Response {
  return new Response(JSON.stringify(body), { status, headers: { ...cors(origin), 'Content-Type': 'application/json' } });
}
function service() {
  const url = Deno.env.get('SUPABASE_URL'); const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!url || !key) throw new Error('SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY ausentes.');
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

Deno.serve(async (req) => {
  const origin = req.headers.get('Origin');
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors(origin) });
  if (req.method !== 'POST') return json({ error: 'Método não permitido.' }, 405, origin);

  const db = service();

  // 1) Admin only.
  const jwt = (req.headers.get('Authorization') || '').replace(/^Bearer\s+/i, '').trim();
  const { data: u, error: uErr } = await db.auth.getUser(jwt);
  if (uErr || !u?.user) return json({ error: 'Sessão inválida.' }, 401, origin);
  const { data: perfil } = await db.from('concremprodutos_usuarios')
    .select('papel, ativo').eq('auth_user_id', u.user.id).maybeSingle();
  if (!perfil || !perfil.ativo || perfil.papel !== 'admin') {
    return json({ error: 'Acesso restrito a administradores.' }, 403, origin);
  }

  const body = await req.json().catch(() => ({}));
  const correlationId = crypto.randomUUID();

  try {
    // 2) Ingestão (set-based, com advisory lock dentro da RPC).
    const { data: exec, error: ingErr } = await db.rpc('concremprodutos_ingerir_pedidos', {
      p_incremental: body?.incremental !== false,
    });
    if (ingErr) throw ingErr;

    // 3) Carrega regras ativas.
    const { data: regrasRaw } = await db.from('concremprodutos_regras_v2')
      .select('id, nome, familia, condicoes_json, resultados_json, prioridade, confianca, interromper_processamento, ativo')
      .eq('ativo', true);
    const regras: Regra[] = (regrasRaw ?? []).map((r) => ({
      id: r.id, nome: r.nome, familia: r.familia,
      condicoes: r.condicoes_json, resultados: r.resultados_json,
      prioridade: r.prioridade, confianca: Number(r.confianca),
      interromper: r.interromper_processamento, ativo: r.ativo,
    }));

    // 4) Fila em lote.
    const { data: fila } = await db.from('concremprodutos_fila_classificacao')
      .select('id, produto_descoberto_id')
      .eq('status', 'PENDENTE').lte('processar_apos', new Date().toISOString())
      .limit(BATCH);

    let classificados = 0;
    for (const item of fila ?? []) {
      const { data: d } = await db.from('concremprodutos_produtos_descobertos')
        .select('id, codigo, descricao_principal').eq('id', item.produto_descoberto_id).maybeSingle();
      if (!d) continue;

      const t0 = performance.now();
      const descricao = normalizarDescricao(d.descricao_principal);
      const r = classificar({ codigo: d.codigo, descricao }, regras, { versaoMotor: VERSAO_MOTOR });
      const dur = Math.round(performance.now() - t0);

      // grava classificação (histórico — sempre novo registro)
      const { data: cls } = await db.from('concremprodutos_classificacoes').insert({
        produto_descoberto_id: d.id, familia: r.familia, atributos_json: r.atributos,
        confianca_global: r.confianca_global, origem: r.origem_global,
        evidencias_json: r.evidencias, versao_motor: VERSAO_MOTOR,
        regra_ids: r.regras_aplicadas, aprovado: false,
      }).select('id').maybeSingle();

      // atualiza descoberto
      await db.from('concremprodutos_produtos_descobertos').update({
        status_classificacao: r.status, confianca_global: r.confianca_global,
        tem_conflito: r.conflitos.length > 0, updated_at: new Date().toISOString(),
      }).eq('id', d.id);

      // log de classificação
      const { data: logc } = await db.from('concremprodutos_log_classificacao').insert({
        correlation_id: correlationId, execucao_id: exec?.id, produto_id: d.id, codigo: d.codigo,
        descricao_original: d.descricao_principal, descricao_normalizada: descricao.normalizada,
        familia_resultante: r.familia, confianca_global: r.confianca_global, status_resultante: r.status,
        versao_motor: VERSAO_MOTOR, regras_aplicadas: r.regras_aplicadas, regras_rejeitadas: r.regras_rejeitadas,
        evidencias: r.evidencias, conflitos: r.conflitos, motivo_bloqueio: r.motivo_bloqueio, duracao_ms: dur,
      }).select('id').maybeSingle();

      // log por atributo
      const linhasAttr = Object.entries(r.atributos).map(([atributo, a]) => ({
        correlation_id: correlationId, log_classificacao_id: logc?.id, atributo,
        valor: a.valor, confianca: a.confianca, origem: a.origem, regra_id: a.regra_id,
        evidencias: a.evidencias,
      }));
      if (linhasAttr.length) await db.from('concremprodutos_log_atributo').insert(linhasAttr);

      await db.from('concremprodutos_fila_classificacao').update({
        status: 'CONCLUIDO', finalizado_em: new Date().toISOString(),
      }).eq('id', item.id);
      classificados++;
    }

    return json({ ok: true, correlation_id: correlationId, execucao: exec, classificados, restantes: (fila?.length ?? 0) === BATCH }, 200, origin);
  } catch (e) {
    console.error('sincronizar-produtos error:', e);
    const msg = e instanceof Error ? e.message : 'Falha na sincronização.';
    // mensagem de lock é segura de mostrar
    const isLock = /advisory lock/i.test(msg);
    return json({ error: isLock ? 'Já existe uma sincronização em andamento.' : 'Falha na sincronização.' }, isLock ? 409 : 500, origin);
  }
});
