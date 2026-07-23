-- =====================================================================
-- Arquitetura de segurança — Fase 2: perfil de domínio + papéis + auditoria
-- =====================================================================
-- Contexto: banco Supabase COMPARTILHADO (S2) com faturamento-concrem-main —
-- mesmo projeto `ctntlgvoefdbjxvfkahp`, mesmo `auth.users` (GoTrue).
--
-- Decisões (ver CLAUDE.md / nota-mãe e Cérebro):
--   - Autenticação: Supabase Auth COMPARTILHADO. O classificador NÃO cria um
--     auth próprio — reaproveita o auth.users do faturamento (adailton entra
--     com a conta real @concrem.com.br).
--   - Autorização: PRÓPRIA do classificador. concremprodutos_usuarios é o
--     PERFIL DE DOMÍNIO do app, vinculado à identidade por
--     auth_user_id = auth.uid() (mesma convenção do faturamento). Papéis
--     simples 'admin' | 'editor' + PROPRIETÁRIO protegido.
--   - Separação de responsabilidades (Config. e Permissões §1): identidade
--     compartilhada, autorização por app. NÃO se toca nas tabelas do
--     faturamento (concrem_usuarios/concrem_grupos/usuarios) — no máximo o
--     classificador lê o próprio perfil.
--   - Auditoria de operações administrativas (§10).
--
-- Migration ADITIVA e não destrutiva. RLS de catálogo fica na Fase 3.
-- ⚠️ Banco compartilhado: aplicar pelo SQL Editor (coordenado), NÃO via
-- `supabase db push`. Criar este arquivo NÃO autoriza aplicá-lo.
-- Ref.: Cérebro — Segurança, Autenticação e Sessões, Configurações e
-- Permissões, Padrões Supabase (§1 S2, §8, §10, §14, §18).
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1) Perfil de domínio: novas colunas (vínculo com a identidade compartilhada)
-- ---------------------------------------------------------------------
ALTER TABLE concremprodutos_usuarios
  -- id do usuário no auth.users compartilhado (preenchido no cutover, Fase 5).
  ADD COLUMN IF NOT EXISTS auth_user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE SET NULL,
  -- e-mail REAL de autenticação (ex.: adailton@concrem.com.br). A coluna `email`
  -- pode continuar sendo o identificador de exibição do app.
  ADD COLUMN IF NOT EXISTS auth_email TEXT,
  -- Papel de autorização do classificador. Default 'editor' (menor privilégio);
  -- o proprietário é promovido a 'admin' no cutover.
  ADD COLUMN IF NOT EXISTS papel TEXT NOT NULL DEFAULT 'editor'
    CHECK (papel IN ('admin', 'editor')),
  -- Proprietário inicial (condição sistêmica protegida — Config. §8). Não é um
  -- grupo comum "Administrador".
  ADD COLUMN IF NOT EXISTS proprietario BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

-- A senha deixa de viver aqui (fonte de verdade é o GoTrue). senha_hash vira
-- legado e é REMOVIDA no cutover (Fase 5), após excluir o usuário de auth
-- própria. Por ora, só relaxa o NOT NULL.
ALTER TABLE concremprodutos_usuarios ALTER COLUMN senha_hash DROP NOT NULL;

-- No máximo um proprietário (decisão do projeto: um proprietário).
CREATE UNIQUE INDEX IF NOT EXISTS idx_concremprodutos_usuarios_proprietario
  ON concremprodutos_usuarios (proprietario)
  WHERE proprietario = true;

CREATE INDEX IF NOT EXISTS idx_concremprodutos_usuarios_auth_user_id
  ON concremprodutos_usuarios (auth_user_id);

-- updated_at consistente por trigger (reusa a função já existente no projeto).
DROP TRIGGER IF EXISTS trg_concremprodutos_usuarios_updated_at ON concremprodutos_usuarios;
CREATE TRIGGER trg_concremprodutos_usuarios_updated_at
  BEFORE UPDATE ON concremprodutos_usuarios
  FOR EACH ROW EXECUTE FUNCTION concremprodutos_update_updated_at();

-- ---------------------------------------------------------------------
-- 2) Funções helper de autorização (usadas pela RLS e pelo backend)
-- ---------------------------------------------------------------------
-- SECURITY DEFINER justificado (Padrões Supabase §14): a RLS precisa saber o
-- papel do chamador, o que exige ler o perfil (que tem RLS própria). Objetos
-- qualificados por schema, search_path fixo, EXECUTE só para authenticated.
-- A identidade vem SEMPRE de auth.uid() — nunca de parâmetro do cliente.
-- Nomes PREFIXADOS (concremprodutos_*) para não colidir com os helpers do
-- faturamento (public.is_admin() etc.) no banco compartilhado.

CREATE OR REPLACE FUNCTION concremprodutos_papel_atual()
RETURNS TEXT
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $$
  SELECT u.papel
  FROM public.concremprodutos_usuarios u
  WHERE u.auth_user_id = (SELECT auth.uid())
    AND u.ativo = true
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION concremprodutos_is_active()
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.concremprodutos_usuarios u
    WHERE u.auth_user_id = (SELECT auth.uid()) AND u.ativo = true
  );
$$;

CREATE OR REPLACE FUNCTION concremprodutos_can_edit()
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $$
  SELECT public.concremprodutos_papel_atual() IN ('admin', 'editor');
$$;

CREATE OR REPLACE FUNCTION concremprodutos_is_admin()
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $$
  SELECT public.concremprodutos_papel_atual() = 'admin';
$$;

REVOKE ALL ON FUNCTION concremprodutos_papel_atual()  FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION concremprodutos_is_active()     FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION concremprodutos_can_edit()      FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION concremprodutos_is_admin()      FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION concremprodutos_papel_atual()  TO authenticated;
GRANT EXECUTE ON FUNCTION concremprodutos_is_active()     TO authenticated;
GRANT EXECUTE ON FUNCTION concremprodutos_can_edit()      TO authenticated;
GRANT EXECUTE ON FUNCTION concremprodutos_is_admin()      TO authenticated;

-- ---------------------------------------------------------------------
-- 3) Proteção do proprietário / último admin (defesa em profundidade)
-- ---------------------------------------------------------------------
-- Roda mesmo sob service_role (triggers não são ignoradas pela service_role,
-- diferentemente da RLS). Config. e Permissões §8.
CREATE OR REPLACE FUNCTION concremprodutos_proteger_proprietario()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  admins_ativos INTEGER;
BEGIN
  IF TG_OP = 'DELETE' THEN
    IF OLD.proprietario THEN
      RAISE EXCEPTION 'Não é possível excluir o proprietário do sistema.';
    END IF;
    SELECT count(*) INTO admins_ativos
      FROM public.concremprodutos_usuarios
      WHERE papel = 'admin' AND ativo = true AND id <> OLD.id;
    IF OLD.papel = 'admin' AND OLD.ativo AND admins_ativos = 0 THEN
      RAISE EXCEPTION 'Não é possível remover o último administrador ativo.';
    END IF;
    RETURN OLD;
  END IF;

  -- UPDATE: proteger o proprietário.
  IF OLD.proprietario THEN
    IF NEW.proprietario = false THEN
      RAISE EXCEPTION 'Não é possível remover a condição de proprietário.';
    END IF;
    IF NEW.ativo = false THEN
      RAISE EXCEPTION 'Não é possível desativar o proprietário do sistema.';
    END IF;
    IF NEW.papel <> 'admin' THEN
      RAISE EXCEPTION 'O proprietário deve permanecer administrador.';
    END IF;
  END IF;

  -- UPDATE que rebaixa/desativa um admin: garantir que sobra ao menos um.
  IF (OLD.papel = 'admin' AND OLD.ativo)
     AND (NEW.papel <> 'admin' OR NEW.ativo = false) THEN
    SELECT count(*) INTO admins_ativos
      FROM public.concremprodutos_usuarios
      WHERE papel = 'admin' AND ativo = true AND id <> OLD.id;
    IF admins_ativos = 0 THEN
      RAISE EXCEPTION 'Não é possível remover o último administrador ativo.';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_concremprodutos_proteger_proprietario ON concremprodutos_usuarios;
CREATE TRIGGER trg_concremprodutos_proteger_proprietario
  BEFORE UPDATE OR DELETE ON concremprodutos_usuarios
  FOR EACH ROW EXECUTE FUNCTION concremprodutos_proteger_proprietario();

-- ---------------------------------------------------------------------
-- 4) Perfil: RLS — usuário lê apenas o PRÓPRIO perfil
-- ---------------------------------------------------------------------
-- Escrita (criar/alterar papel/bloquear/excluir) é exclusiva da Edge Function
-- `usuarios` (service_role, com auditoria e proteção do proprietário). O
-- cliente autenticado só LÊ a própria linha para montar a UI.
ALTER TABLE concremprodutos_usuarios ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "usuarios_select_self" ON concremprodutos_usuarios;
CREATE POLICY "usuarios_select_self" ON concremprodutos_usuarios
  FOR SELECT TO authenticated
  USING (auth_user_id = (SELECT auth.uid()));

-- ---------------------------------------------------------------------
-- 5) Auditoria de operações administrativas (§10)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS concremprodutos_auditoria (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ator_id        UUID,               -- auth.users.id de quem executou
  ator_email     TEXT,
  acao           TEXT NOT NULL,      -- ex.: usuario.criar, usuario.papel, usuario.bloquear
  entidade       TEXT,
  entidade_id    TEXT,
  valor_anterior JSONB,
  valor_novo     JSONB,
  origem         TEXT,               -- ex.: edge:usuarios
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_concremprodutos_auditoria_entidade
  ON concremprodutos_auditoria (entidade, created_at DESC);

-- Logs NÃO editáveis por usuário comum (§10). Só admin LÊ; escrita via Edge
-- Function (service_role). Sem policy de escrita => default deny p/ cliente.
ALTER TABLE concremprodutos_auditoria ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "auditoria_select_admin" ON concremprodutos_auditoria;
CREATE POLICY "auditoria_select_admin" ON concremprodutos_auditoria
  FOR SELECT TO authenticated
  USING (concremprodutos_is_admin());
