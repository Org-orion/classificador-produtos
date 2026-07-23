import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";
//
// Autenticação: Supabase Auth (GoTrue), COMPARTILHADO com o faturamento-concrem-main
// (mesmo projeto/mesmo auth.users). A sessão fica em sessionStorage (padrão
// Nexus Labs de isolamento por aba): fechar a aba ou abrir uma nova exige novo
// login. detectSessionInUrl=false porque não há fluxo OAuth/magic link aqui.
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: sessionStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});
