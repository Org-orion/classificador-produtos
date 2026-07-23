-- =====================================================================
-- Correção de segurança: autenticação de usuários
-- =====================================================================
-- Objetivos:
--   1. Nunca armazenar/comparar senha em texto puro (migrar para bcrypt).
--   2. Impedir leitura/escrita da tabela de usuários pelo cliente anon.
--      A autenticação e o CRUD passam a ser feitos exclusivamente pelas
--      Edge Functions `login` e `usuarios` (com service_role, que ignora RLS).
-- Ver: Cérebro — Segurança / Cérebro — Padrões Supabase (Concrem).

-- pgcrypto fornece crypt()/gen_salt('bf', ...) — bcrypt compatível com o
-- verificador bcrypt usado nas Edge Functions.
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1) Re-hash de qualquer senha ainda em texto puro (hashes bcrypt começam com $2).
UPDATE concremprodutos_usuarios
SET senha_hash = crypt(senha_hash, gen_salt('bf', 10))
WHERE senha_hash IS NOT NULL
  AND senha_hash NOT LIKE '$2%';

-- 2) Fechar a tabela para o cliente. Remove a policy permissiva antiga; sem
--    policies para anon/authenticated, nenhuma linha é lida/escrita por eles.
--    O service_role (Edge Functions) ignora RLS e continua operando.
DROP POLICY IF EXISTS "allow_all_usuarios" ON concremprodutos_usuarios;

-- Garante que a RLS permaneça habilitada (redundante, mas explícito).
ALTER TABLE concremprodutos_usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE concremprodutos_usuarios FORCE ROW LEVEL SECURITY;
