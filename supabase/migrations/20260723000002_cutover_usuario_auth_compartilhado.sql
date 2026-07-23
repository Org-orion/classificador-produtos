-- =====================================================================
-- Arquitetura de segurança — Fase 5 (CUTOVER): DESTRUTIVO
-- =====================================================================
-- ⚠️ NÃO é migration automática. Aplicar MANUALMENTE no SQL Editor do projeto
-- compartilhado `ctntlgvoefdbjxvfkahp`, com AUTORIZAÇÃO e BACKUP, DEPOIS de:
--   Fase 2 + Fase 3 + vínculo dos usuários (Etapa B2 do RUNBOOK) + teste de
--   login OK.
--
-- O VÍNCULO dos perfis (proprietário = kaiomelo@concrem.com.br; admin =
-- adailton@concrem.com.br) é feito na Etapa B2 do RUNBOOK — este script só faz
-- a LIMPEZA destrutiva final:
--   1. exclui o usuário legado de autenticação própria (adailton@infinitybi.com.br);
--   2. remove a coluna senha_hash (a senha vive 100% no GoTrue).
--
-- Reversão: restaurar backup/PITR (sem undo trivial do DROP).
-- =====================================================================

BEGIN;

-- 1) remove o usuário legado de auth própria (não é proprietário/admin).
delete from public.concremprodutos_usuarios
where lower(email) = 'adailton@infinitybi.com.br';

-- 2) remove a coluna de senha própria (fonte de verdade agora é o GoTrue).
alter table public.concremprodutos_usuarios drop column if exists senha_hash;

-- Confira antes de confirmar:
--   select id, email, auth_user_id, auth_email, papel, proprietario, ativo
--     from public.concremprodutos_usuarios;
-- Se estiver correto:  COMMIT;   senão:  ROLLBACK;
COMMIT;
