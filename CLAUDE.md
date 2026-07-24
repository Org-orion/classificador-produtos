# Classificador de Produtos (product-classifier-hub)

App interno da Concrem para classificar o catálogo de produtos (portas, kits, folhas, batentes, alizares) por atributos e categorias, com regras automáticas + parser da descrição + edição manual. React 18 + Vite + TS + shadcn + Supabase; testes Vitest (parser/numbers) e Playwright. Tabelas Supabase com prefixo `concremprodutos_` — `concremprodutos_produtos` é o mesmo catálogo consumido pelo portal do representante.

> **⚠️ Banco Supabase COMPARTILHADO (S2):** projeto de produção `ctntlgvoefdbjxvfkahp`, **compartilhado com o `faturamento-concrem-main`** (mesmo `auth.users`/mesmo banco). Consequências: **não aplicar migrations via `supabase db push`** (o histórico diverge do faturamento) — aplicar SQL pelo **SQL Editor**, coordenado; **não alterar as tabelas do faturamento** (`concrem_usuarios`, `concrem_grupos`, `usuarios`); funções/policies deste app são **prefixadas** (`concremprodutos_*`) para não colidir. O `config.toml` aponta para esse projeto.

## 🧠 Cérebro de engenharia (consultar antes de codar)

Antes de uma mudança relevante (nova tela, refatoração, feature, correção sensível), **consulte e siga** o cérebro de engenharia no vault do Obsidian: `obsidian/kmz/Aplicações/Cérebro/Cérebro — Índice.md` e o pilar aplicável (Arquitetura, Qualidade/Refatoração, Segurança, Padrões Supabase, Testes, Métricas/Fórmulas, Metodologia). Em conflito, **este `CLAUDE.md` (contexto do projeto) prevalece** sobre as regras genéricas do cérebro.

## 🔐 Arquitetura de segurança (em migração — ver estado abaixo)

**Autenticação:** **Supabase Auth (GoTrue) COMPARTILHADO** com o faturamento. Login no frontend via `signInWithPassword` (`AuthContext`); não há função `login` própria. Sessão em `sessionStorage` (isolamento por aba, padrão Nexus). adailton entra com a conta real `@concrem.com.br`.

**Autorização (própria do classificador):** `concremprodutos_usuarios` é **perfil de domínio** vinculado por `auth_user_id` ao `auth.users` compartilhado. Papéis: **`admin`** (gerencia regras e usuários) e **`editor`** (classifica produtos) + **proprietário** protegido. Helpers SQL `concremprodutos_is_admin()/can_edit()/is_active()` (SECURITY DEFINER, `search_path` fixo) dirigem a RLS. Frontend: `ProtectedRoute` com `requireAdmin`; `/admin` só admin.

**RLS:** catálogo/regras têm **leitura pública** (anon+authenticated — preserva o portal do representante) e **escrita fechada**: produtos → admin+editor; catálogo/regras → admin. `concremprodutos_usuarios` lê só o próprio perfil; escrita via Edge Function `usuarios`. Auditoria em `concremprodutos_auditoria`.

**Edge Function `usuarios`** (`verify_jwt=true`): gerencia acesso/papel de contas **já existentes** no auth compartilhado (não cria contas nem senhas); revalida admin; audita. CORS por allowlist (`ALLOWED_ORIGINS`). Ver `supabase/functions/README.md`.

**Decisões (Cérebro — Config. e Permissões §16 / Auth):** provedor = Supabase Auth compartilhado; sessão isolada por aba; **um** grupo/papel por usuário (admin|editor, sem overrides/negação explícita — projeto pequeno); escopo de dados único (global); **um** proprietário; sem cache de permissão (recalcula por request/RLS); auditoria em banco.

### Estado da migração de segurança — APLICADA em produção (2026-07-24)
Aplicada e verificada no projeto compartilhado `ctntlgvoefdbjxvfkahp` (passo a passo em `RUNBOOK.md`):
- Fase 2 (`...auth_roles_owner_audit.sql`) e Fase 3 (`...rls_catalogo.sql`) aplicadas via SQL Editor; cutover (`...cutover_usuario...`) executado.
- Vínculo: **kaiomelo@concrem.com.br** = proprietário/admin; **adailton@concrem.com.br** = admin. Usuário legado `adailton@infinitybi.com.br` **excluído**; coluna `senha_hash` **removida**.
- Frontend (Supabase Auth) publicado na **Vercel** (`productclassifier.vercel.app`, conectado ao repo `Org-orion/classificador-produtos`); Edge Function `usuarios` deployada.
- Verificado: login + gate de admin OK; escrita autenticada OK; escrita `anon` **bloqueada**; leitura pública (portal) **preservada**; aba Administração → Usuários OK.

## ⚠️ Ajustes pendentes (prioridade)

- **Política de senha (Supabase Auth):** ligar **leaked-password protection** (HaveIBeenPwned) + comprimento mínimo no painel Auth; avaliar **MFA para admin** (§9.6 Cérebro — Auth).
- **Confirmar `ALLOWED_ORIGINS`** da Edge Function apontando para o domínio da Vercel (hardening de CORS).
- **Etapa D:** conferência final do portal do representante e matriz de papéis (validar restrições de um usuário `editor`).
- **Repo antigo** `infinitypowerbi/product-classifier-hub` ainda tem a senha legada no histórico (o repo de produção agora é `Org-orion/classificador-produtos`, commit inicial limpo).

## 📓 Sincronização com o Obsidian (OBRIGATÓRIO)

Este projeto é documentado no vault do Obsidian, usado para leitura/consulta. **Sempre que você fizer uma alteração relevante** (nova tela, nova funcionalidade, mudança de regra de negócio, mudança de stack/escopo/status, novo fluxo ou remoção de recurso), **atualize a documentação**:

- Nota-mãe: `obsidian/kmz/Aplicações/Classificador de Produtos.md`
- **Cada tela tem sua própria nota** na pasta `obsidian/kmz/Aplicações/Telas - Classificador de Produtos/`, nomeada `Classificador — <Nome da Tela>.md` (com frontmatter `projeto:` e, no corpo, `**Projeto:** [[Classificador de Produtos]]`, seções "O que faz / Ações do usuário / Regras de negócio"). Ao criar uma tela nova, crie a nota dela nesse padrão e adicione o link no índice `## Telas` da nota-mãe; ao alterar uma tela, atualize a nota dela.

Regras:
- Escreva em português, descrevendo **funcionalidades das telas**. Não cole código na nota.
- Se mudar stack, status ou escopo, atualize o frontmatter e o resumo da nota-mãe.
- Ao final da tarefa, confirme no resumo se a documentação foi atualizada (ou que não havia mudança relevante a documentar).
