# Edge Functions — autenticação e administração

Este app usa **Supabase Auth (GoTrue) COMPARTILHADO** com o
`faturamento-concrem-main` — mesmo projeto (`ctntlgvoefdbjxvfkahp`), mesmo
`auth.users`. A autenticação (login) é feita direto pelo `supabase-js`
(`signInWithPassword`) no frontend; **não há função `login` própria**.

## Funções

- **`usuarios`** (administrativa, `verify_jwt = true`) — gerencia o **acesso e o
  papel** dos usuários do classificador. Ações: `list | add | papel | toggle |
  delete`. Exige JWT do Supabase Auth; revalida que o chamador é **admin ativo**
  antes de qualquer escrita; registra **auditoria** (`concremprodutos_auditoria`).

  Política em banco compartilhado: **não cria contas no `auth.users` nem define
  senhas**. `add` apenas **vincula** uma conta que já existe (por e-mail) ao
  perfil do classificador; a senha é responsabilidade do Supabase Auth
  (fluxo de recuperação). `delete` remove só o **acesso ao classificador**, não
  a conta compartilhada.

## Secrets / variáveis

`SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` são injetados pelo runtime.
Configurar também:

```bash
# Origens permitidas para CORS (recomendado — evita aceitar qualquer origem).
# Ex.: domínio do app publicado + localhost de dev.
supabase secrets set ALLOWED_ORIGINS="https://SEU-DOMINIO,http://localhost:5173"
```

> Se `ALLOWED_ORIGINS` não for definida, a função reflete a origem da requisição
> (transição permissiva). **Definir no deploy** (Cérebro — Padrões Supabase §16).

## Deploy (⚠️ projeto COMPARTILHADO)

O banco é compartilhado (S2). **NÃO** usar `supabase db push` a partir deste
repositório — o histórico de migrations diverge do faturamento. Aplicar o SQL de
segurança (`supabase/migrations/2026072300000*.sql`) **manualmente pelo SQL
Editor**, de forma coordenada, na ordem: `...auth_roles_owner_audit` →
`...rls_catalogo` → (após frontend pronto e com autorização) `...cutover_usuario`.

Deploy das funções (isolado, seguro):

```bash
supabase functions deploy usuarios
```
