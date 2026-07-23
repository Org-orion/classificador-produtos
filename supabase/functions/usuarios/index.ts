import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// =============================================================================
// Edge Function `usuarios` — administrativa (Supabase Auth COMPARTILHADO).
// AUTOSSUFICIENTE: sem imports de ../_shared para permitir deploy colando este
// arquivo direto na dashboard do Supabase (a dashboard não sobe os _shared).
// Se preferir o CLI (`supabase functions deploy usuarios`), qualquer das formas
// funciona.
//
// Gerencia ACESSO/PAPEL de contas que JÁ existem no auth.users compartilhado:
// não cria contas nem define senhas (isso é do Supabase Auth / recovery).
// verify_jwt=true no gateway; aqui revalidamos que o chamador é ADMIN ATIVO.
// Ações: list | add | papel | toggle | delete. Toda escrita gera auditoria.
// =============================================================================

const TABELA = 'concremprodutos_usuarios';
const PAPEIS = ['admin', 'editor'] as const;
type Papel = (typeof PAPEIS)[number];

// ---- CORS (allowlist via ALLOWED_ORIGINS; senão reflete a origem) -----------
const ALLOWED = (Deno.env.get('ALLOWED_ORIGINS') ?? '')
  .split(',').map((s) => s.trim()).filter(Boolean);

function resolveOrigin(origin: string | null): string {
  if (!origin) return ALLOWED[0] ?? '*';
  if (ALLOWED.length === 0) return origin;
  return ALLOWED.includes(origin) ? origin : ALLOWED[0];
}
function corsHeaders(origin: string | null): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': resolveOrigin(origin),
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Vary': 'Origin',
  };
}
function json(body: unknown, status = 200, origin: string | null = null): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(origin), 'Content-Type': 'application/json' },
  });
}

// ---- Cliente service_role (USO EXCLUSIVO no servidor; ignora RLS) ------------
function serviceClient() {
  const url = Deno.env.get('SUPABASE_URL');
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!url || !serviceKey) throw new Error('SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY ausentes.');
  return createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
}

function normEmail(v: unknown): string {
  return typeof v === 'string' ? v.trim().toLowerCase() : '';
}

async function findAuthUserByEmail(db: ReturnType<typeof serviceClient>, email: string) {
  // Sem getUserByEmail no admin do GoTrue — pagina listUsers. Ok para o porte atual.
  for (let page = 1; page <= 20; page++) {
    const { data, error } = await db.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw error;
    const found = data.users.find((u) => (u.email ?? '').toLowerCase() === email);
    if (found) return found;
    if (data.users.length < 200) break;
  }
  return null;
}

async function audit(
  db: ReturnType<typeof serviceClient>,
  ator: { id: string; email: string | null },
  acao: string,
  entidadeId: string | null,
  antes: unknown,
  depois: unknown,
) {
  await db.from('concremprodutos_auditoria').insert({
    ator_id: ator.id, ator_email: ator.email, acao,
    entidade: TABELA, entidade_id: entidadeId,
    valor_anterior: antes ?? null, valor_novo: depois ?? null, origem: 'edge:usuarios',
  });
}

Deno.serve(async (req) => {
  const origin = req.headers.get('Origin');
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders(origin) });
  if (req.method !== 'POST') return json({ error: 'Método não permitido.' }, 405, origin);

  const db = serviceClient();

  // 1) Identidade via JWT do Supabase Auth.
  const jwt = (req.headers.get('Authorization') || '').replace(/^Bearer\s+/i, '').trim();
  const { data: userData, error: userErr } = await db.auth.getUser(jwt);
  const authUser = userData?.user;
  if (userErr || !authUser) {
    return json({ error: 'Sessão inválida. Faça login novamente.' }, 401, origin);
  }

  // 2) Autorização: chamador precisa ser ADMIN ATIVO do classificador.
  const { data: caller } = await db
    .from(TABELA)
    .select('id, papel, ativo, proprietario')
    .eq('auth_user_id', authUser.id)
    .maybeSingle();
  if (!caller || !caller.ativo || caller.papel !== 'admin') {
    return json({ error: 'Acesso restrito a administradores.' }, 403, origin);
  }
  const ator = { id: authUser.id, email: authUser.email ?? null };

  const body = await req.json().catch(() => ({}));
  const action = body?.action;

  try {
    switch (action) {
      case 'list': {
        const { data, error } = await db
          .from(TABELA)
          .select('id, nome, email, auth_user_id, auth_email, papel, proprietario, ativo, created_at')
          .order('nome');
        if (error) throw error;
        return json({ usuarios: data ?? [] }, 200, origin);
      }

      case 'add': {
        const email = normEmail(body.email);
        const papel: Papel = PAPEIS.includes(body.papel) ? body.papel : 'editor';
        if (!email) return json({ error: 'Informe o e-mail.' }, 400, origin);

        const found = await findAuthUserByEmail(db, email);
        if (!found) {
          return json({
            error: 'Nenhuma conta com esse e-mail no login corporativo. A conta precisa existir antes de receber acesso aqui.',
          }, 404, origin);
        }

        const nome = (typeof body.nome === 'string' && body.nome.trim())
          || (found.user_metadata?.name as string | undefined)
          || email;

        const { error } = await db.from(TABELA).insert({
          nome, email, auth_user_id: found.id, auth_email: found.email ?? email, papel, ativo: true,
        });
        if (error) {
          if (error.code === '23505') return json({ error: 'Esse usuário já tem acesso ao classificador.' }, 409, origin);
          throw error;
        }
        await audit(db, ator, 'usuario.add', found.id, null, { email, papel });
        return json({ ok: true }, 200, origin);
      }

      case 'papel': {
        const id = typeof body.id === 'string' ? body.id : '';
        const papel: Papel | '' = PAPEIS.includes(body.papel) ? body.papel : '';
        if (!id || !papel) return json({ error: 'Dados inválidos.' }, 400, origin);
        if (id === caller.id) return json({ error: 'Você não pode alterar o próprio papel.' }, 400, origin);

        const { data: antes } = await db.from(TABELA).select('papel').eq('id', id).maybeSingle();
        const { error } = await db.from(TABELA).update({ papel }).eq('id', id);
        if (error) throw error;
        await audit(db, ator, 'usuario.papel', id, antes, { papel });
        return json({ ok: true }, 200, origin);
      }

      case 'toggle': {
        const id = typeof body.id === 'string' ? body.id : '';
        if (!id) return json({ error: 'Usuário inválido.' }, 400, origin);
        if (id === caller.id && body.ativo === false) {
          return json({ error: 'Você não pode desativar a própria conta.' }, 400, origin);
        }
        const { error } = await db.from(TABELA).update({ ativo: !!body.ativo }).eq('id', id);
        if (error) throw error;
        await audit(db, ator, 'usuario.toggle', id, null, { ativo: !!body.ativo });
        return json({ ok: true }, 200, origin);
      }

      case 'delete': {
        const id = typeof body.id === 'string' ? body.id : '';
        if (!id) return json({ error: 'Usuário inválido.' }, 400, origin);
        if (id === caller.id) return json({ error: 'Você não pode remover o próprio acesso.' }, 400, origin);
        const { error } = await db.from(TABELA).delete().eq('id', id);
        if (error) throw error;
        await audit(db, ator, 'usuario.delete', id, null, null);
        return json({ ok: true }, 200, origin);
      }

      default:
        return json({ error: 'Ação inválida.' }, 400, origin);
    }
  } catch (e) {
    console.error('usuarios error:', e);
    const msg = e instanceof Error ? e.message : 'Falha ao processar a operação.';
    const isRegra = /proprietário|administrador/i.test(msg);
    return json({ error: isRegra ? msg : 'Falha ao processar a operação.' }, isRegra ? 400 : 500, origin);
  }
});
