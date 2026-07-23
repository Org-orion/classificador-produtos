-- =====================================================================
-- Arquitetura de segurança — Fase 5 (CUTOVER DE USUÁRIO): DESTRUTIVO
-- =====================================================================
-- ⚠️ NÃO é uma migration automática. Aplicar MANUALMENTE no SQL Editor do
-- projeto compartilhado `ctntlgvoefdbjxvfkahp`, com AUTORIZAÇÃO, DEPOIS das
-- Fases 2 e 3 e DEPOIS que o frontend (Fase 4) estiver pronto para o corte.
-- Rodar dentro de uma transação e conferir o resultado antes de COMMIT.
--
-- O que faz:
--   1. Exclui o usuário de autenticação PRÓPRIA legado (adailton@infinitybi.com.br).
--   2. Vincula o perfil do classificador à conta REAL já existente no
--      auth.users compartilhado (adailton@concrem.com.br), tornando-o
--      PROPRIETÁRIO + admin.
--   3. Remove a coluna senha_hash (a senha passa a viver 100% no GoTrue).
--
-- Reversão: restaurar de backup / PITR. Por isso confirmar backup ANTES
-- (Cérebro — Backup, Recuperação e Continuidade). NÃO há undo trivial do DROP.
-- =====================================================================

BEGIN;

DO $$
DECLARE
  v_auth_id   UUID;
  v_auth_mail TEXT := 'adailton@concrem.com.br';   -- conta real no auth.users compartilhado
  v_legacy    TEXT := 'adailton@infinitybi.com.br'; -- usuário de auth própria a excluir
BEGIN
  -- (a) Localiza a conta real no auth.users compartilhado.
  SELECT id INTO v_auth_id FROM auth.users
   WHERE lower(email) = lower(v_auth_mail)
   LIMIT 1;

  IF v_auth_id IS NULL THEN
    RAISE EXCEPTION 'Conta % não encontrada em auth.users. Aborte e verifique o e-mail/projeto antes de prosseguir.', v_auth_mail;
  END IF;

  -- (b) Exclui o usuário legado de auth própria (não é proprietário/admin).
  DELETE FROM public.concremprodutos_usuarios WHERE lower(email) = lower(v_legacy);

  -- (c) Garante o perfil do proprietário vinculado à identidade compartilhada.
  --     Se já existir uma linha com este auth_user_id ou e-mail, atualiza.
  INSERT INTO public.concremprodutos_usuarios
    (email, nome, auth_user_id, auth_email, papel, proprietario, ativo, senha_hash)
  VALUES
    (v_auth_mail, 'Adailton', v_auth_id, v_auth_mail, 'admin', true, true, NULL)
  ON CONFLICT (auth_user_id) DO UPDATE
    SET papel = 'admin', proprietario = true, ativo = true,
        auth_email = EXCLUDED.auth_email, email = EXCLUDED.email;

  RAISE NOTICE 'Cutover OK: proprietário vinculado a auth.users % (%).', v_auth_id, v_auth_mail;
END $$;

-- (d) Remove a coluna de senha própria (fonte de verdade agora é o GoTrue).
--     Só executar após confirmar que não há mais usuários de auth própria.
ALTER TABLE public.concremprodutos_usuarios DROP COLUMN IF EXISTS senha_hash;

-- Confira antes de confirmar:
--   SELECT id, email, auth_user_id, auth_email, papel, proprietario, ativo
--     FROM public.concremprodutos_usuarios;
-- Se estiver correto:  COMMIT;   senão:  ROLLBACK;
COMMIT;
