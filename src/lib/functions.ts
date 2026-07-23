import { supabase } from '@/integrations/supabase/client';

/**
 * Invoca uma Edge Function do Supabase anexando o token da sessão do Supabase
 * Auth (Authorization: Bearer <access_token>). Normaliza o erro para uma
 * mensagem legível — quando a função retorna status != 2xx, o supabase-js
 * entrega o corpo em `error.context` (um Response), de onde extraímos `{ error }`.
 */
export async function invokeFunction<T = unknown>(name: string, body: unknown): Promise<T> {
  const { data: { session } } = await supabase.auth.getSession();
  const { data, error } = await supabase.functions.invoke(name, {
    body,
    headers: session ? { Authorization: `Bearer ${session.access_token}` } : undefined,
  });

  if (error) {
    let message = error.message;
    const ctx = (error as { context?: Response }).context;
    if (ctx && typeof ctx.json === 'function') {
      try {
        const parsed = await ctx.json();
        if (parsed?.error) message = parsed.error;
      } catch {
        /* corpo não-JSON: mantém a mensagem padrão */
      }
    }
    throw new Error(message);
  }

  return data as T;
}
