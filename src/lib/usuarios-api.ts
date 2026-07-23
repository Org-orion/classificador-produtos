import { invokeFunction } from '@/lib/functions';
import type { Usuario, PapelUsuario } from '@/types/database';

// Cliente da Edge Function `usuarios` (administrativa). A identidade vai no JWT
// do Supabase Auth, anexado por invokeFunction. Gerencia ACESSO e PAPEL de
// contas que JÁ existem no auth.users compartilhado — não cria contas nem
// define senhas (isso é responsabilidade do Supabase Auth).
export const usuariosApi = {
  async list(): Promise<Usuario[]> {
    const data = await invokeFunction<{ usuarios: Usuario[] }>('usuarios', { action: 'list' });
    return data.usuarios ?? [];
  },

  /** Concede acesso ao classificador a uma conta existente (por e-mail). */
  addByEmail(payload: { email: string; nome?: string; papel: PapelUsuario }) {
    return invokeFunction('usuarios', { action: 'add', ...payload });
  },

  setPapel(id: string, papel: PapelUsuario) {
    return invokeFunction('usuarios', { action: 'papel', id, papel });
  },

  toggle(id: string, ativo: boolean) {
    return invokeFunction('usuarios', { action: 'toggle', id, ativo });
  },

  /** Remove o acesso ao classificador (não exclui a conta compartilhada). */
  remove(id: string) {
    return invokeFunction('usuarios', { action: 'delete', id });
  },
};
