import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import type { PerfilAtual } from '@/types/database';

interface AuthContextType {
  /** Usuário do Supabase Auth (identidade compartilhada). */
  user: User | null;
  session: Session | null;
  /** Perfil de domínio do classificador (papel/estado). null = sem acesso. */
  perfil: PerfilAtual | null;
  isAdmin: boolean;
  /** Autentica via Supabase Auth. Lança em credencial inválida ou sem acesso. */
  login: (email: string, senha: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Busca o perfil do classificador para o usuário autenticado. A RLS
// (usuarios_select_self) garante que só a própria linha é visível.
async function fetchPerfil(userId: string): Promise<PerfilAtual | null> {
  const { data, error } = await supabase
    .from('concremprodutos_usuarios')
    .select('id, nome, email, papel, proprietario, ativo')
    .eq('auth_user_id', userId)
    .eq('ativo', true)
    .maybeSingle();
  if (error) {
    console.error('Falha ao carregar perfil:', error.message);
    return null;
  }
  return (data as PerfilAtual) ?? null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [perfil, setPerfil] = useState<PerfilAtual | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadPerfil = useCallback(async (userId: string | undefined) => {
    if (!userId) { setPerfil(null); return; }
    setPerfil(await fetchPerfil(userId));
  }, []);

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return;
      setSession(data.session);
      await loadPerfil(data.session?.user?.id);
      if (active) setIsLoading(false);
    });

    // Não fazer chamadas assíncronas dentro do callback (recomendação Supabase):
    // apenas atualiza a sessão; o perfil é recarregado pelo efeito abaixo.
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      if (!active) return;
      setSession(s);
    });

    return () => { active = false; sub.subscription.unsubscribe(); };
  }, [loadPerfil]);

  // Recarrega o perfil sempre que muda o usuário autenticado.
  useEffect(() => {
    loadPerfil(session?.user?.id);
  }, [session?.user?.id, loadPerfil]);

  const login = async (email: string, senha: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password: senha,
    });
    if (error) throw new Error('E-mail ou senha inválidos.');

    // Autenticação OK — verifica AUTORIZAÇÃO no classificador (default deny).
    const p = data.user ? await fetchPerfil(data.user.id) : null;
    if (!p) {
      await supabase.auth.signOut();
      throw new Error('Sua conta não tem acesso ao Classificador de Produtos.');
    }
    setPerfil(p);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setPerfil(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user: session?.user ?? null,
        session,
        perfil,
        isAdmin: perfil?.papel === 'admin',
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
