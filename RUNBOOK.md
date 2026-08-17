# RUNBOOK — Aplicação da arquitetura de segurança

Passo a passo para colocar a segurança em produção **sem derrubar o app nem o
portal do representante**. Leia tudo antes de começar.

## Contexto e regras
- **Banco Supabase COMPARTILHADO (S2):** projeto `ctntlgvoefdbjxvfkahp`, o mesmo do
  `faturamento-concrem-main` (mesmo `auth.users`).
- **NÃO** use `supabase db push` — aplique o SQL pelo **SQL Editor**, coordenado.
- **NÃO** altere tabelas do faturamento (`concrem_usuarios`, `concrem_grupos`, `usuarios`).
- **Ordem importa:** fechar a escrita `anon` (Fase 3) **antes** do frontend novo estar no ar
  e do adailton vinculado faz a Classificação parar de salvar. Por isso a Fase 3 e o corte
  do frontend acontecem juntos, numa janela curta.
- **Reversão:** a única reversão do passo destrutivo é restaurar backup/PITR. Confirme o
  backup antes da Etapa C.

---

## Etapa A — seguro a qualquer momento (não quebra nada)

### A1. Backup
No painel do projeto `ctntlgvoefdbjxvfkahp`, confirme **PITR ou snapshot recente**.
Sem backup verificado, **não** siga para as Etapas C/Fase 3.

### A2. Rotacionar a credencial vazada
Em **Authentication → Users**, redefina a senha do adailton (`adailton@concrem.com.br`).
A senha antiga em texto puro esteve versionada — trate como comprometida.

### A3. Política de senha (Authentication → Policies/Providers)
- Ligue **"Prevent use of leaked passwords"** (HaveIBeenPwned).
- Defina comprimento mínimo (fator único → recomendado ≥ 15; com MFA → ≥ 8).
- Avalie **MFA para administradores**.

### A4. Deploy da Edge Function `usuarios`
Ela não é chamada pelo app antigo, então é inofensivo agora.
- **Dashboard:** cole o conteúdo de `supabase/functions/usuarios/index.ts` (é autossuficiente)
  e clique em Deploy.
- **ou CLI:** `supabase functions deploy usuarios`
- Defina a allowlist de CORS (secret):
  ```bash
  supabase secrets set ALLOWED_ORIGINS="https://SEU-DOMINIO-DO-APP,http://localhost:5173"
  ```

### A5. Aplicar a Fase 2 (aditiva e segura) — SQL Editor
Cole e rode **todo** o conteúdo de
`supabase/migrations/20260723000000_auth_roles_owner_audit.sql`.

Verificações (rode separadamente):
```sql
-- (1) devem aparecer 3 linhas: auth_user_id, papel, proprietario
select column_name from information_schema.columns
where table_name='concremprodutos_usuarios'
  and column_name in ('auth_user_id','papel','proprietario');

-- (2) as funções existem (retornam NULL/false no editor, pois não há sessão — ok)
select concremprodutos_is_admin(), concremprodutos_can_edit();

-- (3) a tabela de auditoria existe
select to_regclass('public.concremprodutos_auditoria');
```

---

## Etapa B — janela de corte (poucos minutos, coordenada)

### B1. Confirmar as contas no Auth compartilhado
Proprietário = **kaiomelo@concrem.com.br**; admin = **adailton@concrem.com.br**.
```sql
select id, email from auth.users
where lower(email) in ('kaiomelo@concrem.com.br','adailton@concrem.com.br');
```
- **2 linhas** → siga para B2.
- **falta alguma** → o e-mail no `auth.users` é outro; ajuste antes de vincular.

### B2. Vincular os usuários (ainda NÃO destrutivo)
```sql
insert into public.concremprodutos_usuarios
  (email, nome, auth_user_id, auth_email, papel, proprietario, ativo)
select u.email,
       case when lower(u.email)='kaiomelo@concrem.com.br' then 'Kaio Melo' else 'Adailton' end,
       u.id, u.email, 'admin',
       (lower(u.email) = 'kaiomelo@concrem.com.br'),  -- só o kaio é proprietário
       true
from auth.users u
where lower(u.email) in ('kaiomelo@concrem.com.br','adailton@concrem.com.br')
on conflict (auth_user_id) do update
  set papel='admin', ativo=true, proprietario=excluded.proprietario,
      auth_email=excluded.auth_email, email=excluded.email;

-- confira: 2 linhas; kaiomelo proprietario=true, adailton proprietario=false
select email, auth_user_id, papel, proprietario, ativo
from public.concremprodutos_usuarios
where auth_user_id is not null
order by proprietario desc;
```

### B3. Publicar o frontend novo
Publique a partir deste repositório (`Org-orion/classificador-produtos`, branch `main`).
Garanta no **host** (Vercel/Lovable/etc.) as variáveis do projeto `ctntlgvoefdbjxvfkahp`:
`VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY` (o `.env` não vai mais no git).

### B4. Testar o login
Entre com a **sua** conta `kaiomelo@concrem.com.br` (você sabe a senha — é a mesma do faturamento). Confirme:
- abre o Dashboard; aparece **Administração** (papel admin);
- **salvar uma classificação funciona** (escrita autenticada).
- (o adailton também consegue entrar com a conta dele, quando quiser.)

### B5. Aplicar a Fase 3 (fecha a escrita anon) — SQL Editor
Cole e rode `supabase/migrations/20260723000001_rls_catalogo.sql`.

Verificações:
```sql
-- leitura pública (portal) continua funcionando:
set role anon; select count(*) from concremprodutos_produtos; reset role;
-- escrita anon deve FALHAR (esperado):
set role anon;
insert into concremprodutos_categorias (nome) values ('__teste_anon__'); -- deve dar erro de RLS
reset role;
```
No app (logado): salvar classificação ainda funciona; um Editor não consegue editar regras/categorias.

---

## Etapa C — finalização destrutiva (só após B4/B5 OK e com backup)
```sql
-- remove o usuário legado de auth própria
delete from public.concremprodutos_usuarios where lower(email)='adailton@infinitybi.com.br';
-- remove a coluna de senha própria (fonte de verdade agora é o GoTrue)
alter table public.concremprodutos_usuarios drop column if exists senha_hash;
```
> Equivale a rodar o arquivo `supabase/migrations/20260723000002_cutover_usuario_auth_compartilhado.sql`
> (já vem com `BEGIN/COMMIT`). O vínculo dos usuários é o da Etapa B2 — este script só limpa.

---

## Etapa D — pós-corte
1. **Portal do representante:** confirme que continua lendo o catálogo normalmente.
2. **Matriz de teste** (Cérebro — Config. §15 / Supabase §11):
   - usuário sem perfil → login barra ("sem acesso");
   - Editor salva produto, mas NÃO cria/edita regras/categorias;
   - Admin gerencia usuários e regras;
   - usuário desativado perde acesso;
   - `anon` não escreve em nenhuma tabela; leitura do catálogo segue OK;
   - proprietário/último admin não podem ser removidos/rebaixados.
3. Marque as pendências concluídas no `CLAUDE.md`.

## Rollback
- Fase 2/Fase 3: podem ser revertidas recriando as policies antigas / removendo colunas,
  mas o caminho seguro é **restaurar do backup/PITR**.
- Etapa C (drop de coluna / delete): **sem undo** — só backup/PITR.

---

## Migrations avulsas — aplicar pelo SQL Editor

Banco compartilhado com o `faturamento-concrem-main`: **nunca** `supabase db push`
(o histórico de migrations diverge). Rode o conteúdo do arquivo no SQL Editor, na
ordem, e confira a verificação no fim de cada um.

### M1. Regra de atributo "não contém" — `20260804000000_regra_nao_contem.sql`
Amplia o CHECK de `tipo_match` para aceitar `nao_contem`.

- **Enquanto não aplicada:** a opção "Não contém" aparece no formulário, mas o
  salvamento falha com erro de constraint (`violates check constraint`). Nenhum
  outro comportamento muda.
- **Verificação:** cadastre em Administração → Regras Atributo uma regra
  `Alizar — L (cm)` / `Não contém` / critério `AL` / valor `0`, rode **Aplicar
  Regras** e confira que os KIT PORTA sem "AL" na descrição saíram de
  Classificação → *Incompletos*.

### M2. Inativação de produtos — `20260804000001_produto_ativo.sql`
Adiciona `concremprodutos_produtos.ativo` (default `true`), o índice parcial e
**recria a view de publicação** excluindo inativos.

- **Enquanto não aplicada:** o filtro "Uso" e o painel de detalhes aparecem, mas o
  botão "Produto em uso" mostra erro do banco ao ser desligado (coluna inexistente).
  O resto da tela funciona — o frontend trata `ativo` ausente como ativo.
- **Verificação:**
  ```sql
  SELECT ativo, count(*) FROM concremprodutos_produtos GROUP BY ativo;
  -- todos true logo após aplicar
  SELECT count(*) FROM concremprodutos_catalogo_representantes;
  ```
  Depois, inative um produto pela tela e confirme que ele desaparece da contagem
  da view (portal do representante deixa de recebê-lo).
- **Rollback:** `DROP INDEX idx_concremprodutos_produtos_ativo;` e
  `ALTER TABLE concremprodutos_produtos DROP COLUMN ativo;` — a view precisa ser
  recriada sem `AND ativo` **antes** do drop da coluna.
