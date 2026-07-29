# Plano de Reconstrução — Catálogo do Classificador + Cérebro de Conhecimento + Logs

> **Status: PROPOSTA (aguardando aprovação).** Nada foi aplicado ao banco nem implementado.
> Consolida dois pedidos: (1) reconstruir a ingestão/classificação/publicação a partir de
> `concrem_pedidos_venda`; (2) base de conhecimento (Obsidian) + snapshots + logs auditáveis.
> Segue o Cérebro Nexus Labs (Segurança, Supabase S2, Config./Permissões, Observabilidade,
> Governança de Fontes, Testes).

## 0. Governança e restrições (inegociáveis)
- **Banco Supabase COMPARTILHADO (S2)** `ctntlgvoefdbjxvfkahp` com o `faturamento-concrem-main`.
  Aplicar SQL pelo **SQL Editor** (não `db push`). **Não** alterar tabelas do faturamento
  (`concrem_pedidos_venda`, `concrem_pedidos_status`, `concrem_*`) — apenas **leitura**.
- Novas tabelas/funções **prefixadas** `concremprodutos_*`, com **RLS**.
- **`service_role` só no backend**; frontend respeita RLS.
- **Preço nunca** é lido para classificar, alterado, zerado nem registrado em log.
- **Nada de commit/push/deploy/migration remota sem autorização explícita.**
- Confirmar cada nome de tabela/coluna **via SQL** antes de escrever migration (os arquivos de
  migration do faturamento divergem da produção — já comprovado).

---

## 1. Diagnóstico (Etapa 1 — CONCLUÍDA, verificada em produção)
| Item | Realidade confirmada |
|---|---|
| Fonte | `public.concrem_pedidos_venda`: `id` uuid, `numero_pedido` text, `dados_tabela` **jsonb**, `created_at`/`updated_at` (incremental ✅). **Sem** coluna `status`. |
| Item | `dados_tabela = { "itens":[ {id, produto, un, qtd, valor_un, valor_total, ...} ] }`. **código=`itens[].id`**, **descrição=`itens[].produto`**, unidade=`itens[].un`. Valores **ignorados**. |
| Status | `public.concrem_pedidos_status`: `pedido_id` text, `numero_pedido` text, `status_atual` text, `atualizado_em`, **`excluido_em`** (soft-delete → filtrar `IS NULL`). |
| Ordem de status | Espelhar `pedidoStatusFlow` (19 status). **Elegível = ordem ≥ 12 (`em_carregamento`+)**. |
| Elegíveis (dado real) | finalizado 10.759 · entregue 1.689 · em_entrega 417 · em_carregamento 252 (+ despachado/faturado/etc.) ≈ **13,1 mil pedidos**. |
| Destino | App representantes lê `concremprodutos_produtos` (colunas específicas, ordena por `codigo`). `preco` existe lá → **intocável**. |
| Realidade | Há itens fora das 5 famílias (ex.: DOBRADIÇA) → revisão/bloqueado, nunca forçar família. |
| Chave do join | `concrem_pedidos_venda` ↔ `concrem_pedidos_status` — **validar taxa de match** (`numero_pedido` provável) antes de fixar. |

---

## 2. Decisões pendentes (destravam a implementação)
### Da reconstrução
1. **Publicação:** catálogo publicado continua sendo `concremprodutos_produtos` (upsert dos aprovados, **preservando `preco`**) + **view** `concremprodutos_catalogo_representantes` para o app. *(recomendado)*
2. **Fonte do app representantes:** trocar `.from('concremprodutos_produtos')` → a view (1 linha), com sua autorização (outro repo). Ou manter lendo a tabela e só garantir que a publicação a preenche.
3. **Mapa das 5 famílias → colunas atuais** (`tipo_produto`, categorias): você fornece as regras de negócio ou começamos só com o que der para inferir com segurança (resto → revisão).
4. **Config de status elegíveis:** tabela `concremprodutos_status_elegiveis` (administrável, recomendado) ou constante única espelhando `pedidoStatusFlow`.

### Do módulo de conhecimento/logs
5. **Runner de sync:** GitHub Action no push (recomendado) ou script Node manual — **não** é Edge Function (Edge não lê o repo).
6. **Sequência:** módulo de conhecimento **depois** do núcleo (o motor precisa existir para compilar regras nele).
7. **Vault:** criar `knowledge-base/classificador-produtos/` (estrutura + docs-modelo) agora (só arquivos) ou junto da implementação.
8. **Exemplos Aprovados (verdade da regressão):** preenchidos por você/negócio (sem eles a regressão não protege).

---

## 3. Arquitetura consolidada (fluxo de dados)
```text
concrem_pedidos_venda + concrem_pedidos_status   (leitura, service_role no backend)
  → filtrar elegíveis (join; status ordem≥12; excluido_em IS NULL; incremental por updated_at)
  → unnest dados_tabela->itens  → extrair (id=código, produto=descrição, un)
  → normalizar descrição (função única)
  → consolidar por código (descobertos + variantes; conflito se descrições divergem)
  → classificar (motor em camadas) usando SNAPSHOT de regras ATIVO
  → confiança por atributo + global (menor obrigatória) + tetos por origem
  → publicar (>=0.95, sem conflito, família válida, atributos completos) OU revisão/bloqueio
  → LOGAR tudo com correlation_id (extração→classificação→atributo→publicação→auditoria)

knowledge-base (vault git) → Runner CI (service_role) → valida → compila → SNAPSHOT imutável
  → regressão (exemplos+exceções+publicados) → ativa só se passar → rollback = reativar anterior
```

---

## 4. Plano por etapas
- **Etapa 2 (este documento):** diagnóstico + proposta + decisões. **Aprovação aqui.**
- **Etapa 3 — Fundação de dados (migrations aditivas + funções puras + testes):**
  tabelas `concremprodutos_produtos_descobertos`, `_variantes_descricao`, `_classificacoes`,
  `_regras_v2`, `_fila_classificacao`, `_execucoes`, `_sync_estado`, `_familias`,
  `_status_elegiveis`, e os logs (`_log_extracao/_classificacao/_atributo/_publicacao/_sync`,
  `_auditoria_manual`) — todos com RLS + append-only nos logs. `src/lib/normalizacao.ts`,
  `src/lib/extrator-dados-tabela.ts`, `src/lib/status-config.ts`. Testes das funções puras.
- **Etapa 4 — Motor + confiança:** camadas 1–6 (código aprovado → regra código → regra descrição
  → parser → similaridade(≤0.94) → IA(≤0.89)), `interromper_processamento` (corrige regra inferior
  sobrescrever superior), confiança por atributo/global + tetos por origem, fila e execuções,
  logs de classificação/atributo com `correlation_id`. Testes do motor.
- **Etapa 5 — Backend + incremental:** Edge Function `sincronizar-produtos` (orquestra) + RPC SQL
  de ingestão set-based; **advisory lock** (execução única); incremental por `updated_at`/hash;
  logs de extração; idempotência; lotes. Testes de concorrência/idempotência.
- **Etapa 6 — Revisão + publicação:** fila de revisão (aprovar/corrigir/bloquear/criar regra/
  reprocessar), painel de resumo, botão "Atualizar produtos agora", **view** de publicação segura,
  troca (1 linha) da fonte do app representantes. Testes portal (pendente não aparece / aprovado aparece).
- **Etapa 7 — Cérebro de conhecimento + logs completos:** vault `knowledge-base/classificador-produtos/`,
  tabelas KB (documentos/versões/snapshots/regras compiladas), **runner de sync (CI)** com validação/
  compilação/snapshot/regressão/rollback, telas admin (Cérebro do classificador, histórico de sync,
  rastreamento de produto, visualização de logs). Testes de KB/snapshot/rollback/regressão/imutabilidade.
- **Etapa 8 — Fechamento:** testes completos + build + typecheck + tipos Supabase atualizados +
  relatório final + docs (CLAUDE.md, nota-mãe, telas).

Cada etapa termina com: arquivos criados/alterados · migrations · decisões · riscos · testes
executados · build · próximos passos (formato do pedido).

---

## 5. Testes obrigatórios (consolidados)
Reconstrução: repetição em vários pedidos · mesmo código descrições iguais/diferentes · item sem
código/descrição · `dados_tabela` inválido · prioridade/termo proibido/regras conflitantes ·
confiança <0.95 · aprovação manual · já aprovado · mudança relevante de descrição · 5 famílias ·
**preço nunca alterado** · incremental · execução dupla simultânea · pendente fora do portal ·
aprovado no portal. Conhecimento/logs: Markdown válido/inválido · rascunho ignorado · aprovado
importado · mudança de hash · snapshot · rollback · regra com origem rastreável · log por atributo ·
`correlation_id` em todo o fluxo · alterar log imutável (bloqueado) · RLS dos logs · regressão por
nova regra · ativação bloqueada com teste falhando · snapshot correto na classificação · **preço
nunca em log**.

## 6. Riscos
Volume (~13k pedidos/100k+ itens) → lotes/incremental/particionar logs · S2 compartilhado ·
runner ≠ Edge Function · mapa de famílias depende de negócio · regressão depende de Exemplos
Aprovados · dois "cérebros" distintos (engenharia vs regras de produto) · escopo grande (entregar
em etapas pequenas). 

## 7. Estado atual
Etapa 1 concluída e verificada. Aguardando **aprovação deste plano + as 8 decisões** para iniciar a
Etapa 3. Import por planilha atual permanece como fallback até a nova fonte ser validada.
