Beleza! Segue um **checklist ultra detalhado** em Markdown, com caixas de seleção `[ ]`, organizado por fases. É só colar no README do projeto e ir marcando. 👇

# Plano de Implementação — JurisConnect Admin (Multi-Tenant + GraphQL + RLS + shadcn)

## 0) Preparação & Convenções

* [ ] **Revisar estrutura atual** (`components/*`, `hooks/*`, `app/*`) e listar pontos de reaproveitamento no admin
* [ ] **Criar pastas base**

  * [ ] `app/admin/*` (rotas do painel)
  * [ ] `app/api/graphql/route.ts` (servidor GraphQL Yoga)
  * [ ] `lib/{auth,tenant,entitlements,audit,db,gqlClient,session}.ts`
  * [ ] `generated/graphql.ts` (GraphQL Codegen)
  * [ ] `prisma/{schema.prisma,seed.ts,rls.sql}`
  * [ ] `tests/{unit,e2e}/*`
* [ ] **Padronizar import aliases** em `tsconfig.json` (`@/components`, `@/lib`, etc.)
* [ ] **Adicionar scripts no package.json**: `codegen`, `db:seed`, `db:rls`, `test:e2e`, `dev:all`

---

## 1) Banco & Prisma

* [ ] **Atualizar `prisma/schema.prisma`** com todos os modelos multi-tenant

  * [ ] `Tenant`, `User`, `Plan`, `Subscription`, `Office`, `Lawyer`, `Lead`, `Banner`, `ButtonAction`, `FeatureFlag`, `Entitlement`, `Review`, `AuditLog`
  * [ ] Enums: `Role`, `TenantStatus`, `Period`, `LeadStatus`, `TargetType`, `FeatureScope`, `ButtonType`, `BannerPosition`, `Provider`
  * [ ] Garantir `tenantId` onde aplicável e índices úteis (ex.: `@@index([tenantId])`)
* [ ] **Gerar migrations**: `pnpm prisma migrate dev -n "init-multitenant"`
* [ ] **Configurar client Prisma** em `lib/db.ts` com singleton
* [ ] **Criar seed realista** (`prisma/seed.ts`)

  * [ ] 1 `SUPER_ADMIN` ([admin@demo.local](mailto:admin@demo.local))
  * [ ] Tenants: `gold-co`, `silver-co`, `freemium-co`
  * [ ] Plans com `limits` JSON (incluir `viewFullLeadData`)
  * [ ] Para cada tenant: 1 Office, 2 Lawyers, 10 Leads (alguns freemium), 2 Banners, 2 Buttons, 5 Reviews `PENDING`
  * [ ] Usuários: 1 `OFFICE_ADMIN` por tenant, 1 `LAWYER` por lawyer
* [ ] **Rodar seed**: `pnpm prisma db seed`

---

## 2) Postgres Row-Level Security (RLS)

* [ ] **Criar helpers no Postgres** (`prisma/rls.sql`)

  * [ ] Funções `app_is_super_admin()` e `app_tenant_id()` (via `current_setting`)
  * [ ] `ALTER TABLE ... ENABLE ROW LEVEL SECURITY` para tabelas multi-tenant
* [ ] **Policies por tabela**

  * [ ] Modelo padrão: `SELECT`/`ALL` permitido se `app_is_super_admin()` **ou** `tenantId = app_tenant_id()`
  * [ ] `Tenant`: acesso **apenas** `SUPER_ADMIN`
  * [ ] `User`: permitir `SUPER_ADMIN` e usuários do mesmo tenant
* [ ] **Aplicar RLS**: executar `psql -f prisma/rls.sql` (ou via `prisma.$executeRaw` pós-migrate)
* [ ] **Setar variáveis de sessão** na request GraphQL

  * [ ] Antes de cada operação:

    ```ts
    await prisma.$executeRawUnsafe(`SET app.current_tenant = '${ctx.tenantId ?? ''}'`);
    await prisma.$executeRawUnsafe(`SET app.current_role = '${ctx.role}'`);
    ```

---

## 3) Autenticação (NextAuth + JWT)

* [ ] **Implementar NextAuth** em `lib/auth.ts` (Credentials/Email)

  * [ ] JWT com claims `{ sub, role, tenantId }`
  * [ ] Callbacks para injetar `role`/`tenantId` no token e sessão
* [ ] **Helper de sessão** `lib/session.ts`: `getSessionUser()` (Server)
* [ ] **Guarda de rota** no layout do admin (`app/admin/layout.tsx`)

  * [ ] Redireciona `/admin/login` se não autenticado
  * [ ] Valida `role` (RBAC mínimo)
* [ ] **Selector de tenant** (apenas `SUPER_ADMIN`) com header `x-tenant-id` no admin

---

## 4) Entitlements & Feature Flags

* [ ] **Criar `lib/entitlements.ts`**

  * [ ] `mergeEntitlements(planLimits, flags, overrides)`
  * [ ] Chave **obrigatória**: `viewFullLeadData` (freemium = `false`)
  * [ ] Outras: `featuredSlots`, `leadsPerMonth`, `banner`, `buttons[]`, `analytics`
* [ ] **Hook server** para montar `ctx.entitlements` baseado em:

  * [ ] `Plan.limits` do tenant
  * [ ] `FeatureFlag` (GLOBAL/TENANT/OFFICE/LAWYER)
  * [ ] `Entitlement` específico (`subjectType`, `subjectId`)
* [ ] **Componente `FeatureGate`** (reaproveitar `components/ui/feature-gate.tsx`) integrando `useEntitlements()`

---

## 5) GraphQL Server (Yoga) — `/app/api/graphql/route.ts`

* [ ] **Schema SDL** com tipos, enums, connections (cursor-based)

  * [ ] `Tenant`, `Plan`, `Office`, `Lawyer`, `Lead{ isObfuscated }`, `Banner`, `ButtonAction`, `Review`, `AuditLog`
* [ ] **Directives**

  * [ ] `@hasRole(roles: [Role!]!)` → bloqueia acesso por role
  * [ ] `@withinTenant` → fixa/valida `ctx.tenantId` (ou `x-tenant-id` p/ `SUPER_ADMIN`)
* [ ] **Context**

  * [ ] Parse JWT → `{ user: { id, role, tenantId } }`
  * [ ] `ctx.tenantId`, `ctx.role`, `ctx.entitlements`, `ctx.loaders`
  * [ ] Executar `SET app.current_tenant/app.current_role` por request
* [ ] **DataLoaders** (evitar N+1)

  * [ ] `Office`, `Lawyer`, `Tenant`
* [ ] **Queries**

  * [ ] `me`, `tenants`, `plans`, `offices`, `lawyers`, `leads`, `banners`, `buttons`, `reviews`, `auditLogs`
* [ ] **Mutations**

  * [ ] `setPlan(tenantId, planId)`
  * [ ] `toggleFeaturedLawyer(lawyerId, featured)`
  * [ ] `updateFeature(input)` (flags/entitlements)
  * [ ] `moveLead(leadId, status)` (Kanban)
  * [ ] `createBanner(...)`
  * [ ] `createButtonAction(...)`
  * [ ] `moderateReview(reviewId, status, reason)`
  * [ ] `upsertEntitlement(subjectType, subjectId, featureKey, value)`
* [ ] **Subscriptions (opcional)**

  * [ ] `leadCreated(tenantId)` via WebSocket
* [ ] **Auditoria**

  * [ ] Wrapper em mutations para gravar `AuditLog` (actor, tenant, entity, diff)

---

## 6) Obfuscação de Leads (Freemium)

* [ ] **Back-end (obrigatório)**

  * [ ] Em resolvers de `Lead`, aplicar `obfuscatedLead(lead, ctx.entitlements.viewFullLeadData)`
  * [ ] Campos mascarados quando `false`:

    * [ ] `name = "*** Nome bloqueado ***"`
    * [ ] `email = "*****@*****"`
    * [ ] `phone = "(**) *****-****"`
    * [ ] `message = "Mensagem disponível apenas no plano Premium"`
    * [ ] `isObfuscated = true`
* [ ] **Front-end (UI)**

  * [ ] Nos cards da tela `/admin/leads` e `dashboard/leads`, se `isObfuscated`:

    * [ ] Aplicar `blur-sm` + overlay com “🔒 Disponível no plano Premium”
    * [ ] CTA “Desbloquear agora” → `/dashboard/subscription`
  * [ ] **Export CSV** deve respeitar obfuscação (nunca incluir dados reais p/ freemium)

---

## 7) Apollo Client + GraphQL Codegen (Client)

* [ ] **Instalar deps**: `@apollo/client graphql @graphql-codegen/cli typescript-operations typescript-react-apollo`
* [ ] **Config `codegen.ts`** com schema local (`/api/graphql`) e `documents: ['**/*.{ts,tsx}']`
* [ ] **Provider** `ApolloProvider` em `components/providers.tsx` com auth header Bearer
* [ ] **Script** `pnpm codegen` e rodar no CI
* [ ] **Substituir/Complementar hooks** para listas com hooks gerados: `useLeadsQuery`, `useMoveLeadMutation`, etc.

---

## 8) Admin UI (shadcn)

* [ ] **Layout base** `app/admin/layout.tsx`

  * [ ] Sidebar (reaproveitar `dashboard-sidebar.tsx`)
  * [ ] Header com selector de tenant (apenas `SUPER_ADMIN`)
  * [ ] Command palette (opcional)
* [ ] **Páginas**

  * [ ] `/admin/login`
  * [ ] `/admin` (KPI: tenants, usuários, leads novos, banners ativos)
  * [ ] `/admin/tenants` (CRUD, status, plano) — `SUPER_ADMIN`
  * [ ] `/admin/plans` (CRUD, editor de `limits`)
  * [ ] `/admin/offices` (DataTable, filtros, featured toggle, bulk)
  * [ ] `/admin/lawyers` (DataTable, filtros, featured toggle, bulk)
  * [ ] `/admin/leads` (**Kanban** + filtros + export CSV + drag\&drop)
  * [ ] `/admin/banners` (CRUD, agendamento, upload S3)
  * [ ] `/admin/buttons` (CRUD, tipo, config JSON validada)
  * [ ] `/admin/reviews` (moderação com motivo + bulk approve/reject)
  * [ ] `/admin/audit` (logs com filtros por entidade/usuário/data)
  * [ ] `/admin/settings` (domínios, integrações, e-mail, storage)
* [ ] **DataTables (TanStack)**

  * [ ] busca global, filtros por coluna, ordenação, paginação
  * [ ] **bulk actions** (aprovar reviews, ativar/desativar banners, toggles featured)
  * [ ] estados vazios com call-to-action (criar banner, adicionar botão, importar leads)
* [ ] **Forms** com `react-hook-form + zod` (criar/editar entidades)
* [ ] **Uploads**: componente `<ImageUpload />` com presigned URLs S3
* [ ] **Toasters** (`ui/sonner.tsx`) para feedback de ações

---

## 9) Billing & Planos

* [ ] **Modelos `Plan` e `Subscription`** funcionais (sem gateway real inicialmente)
* [ ] **Página `/admin/plans`** para CRUD de planos e editor de `limits` (JSON → UI)
* [ ] **Troca de plano**: Mutation `setPlan(tenantId, planId)` (registra `AuditLog`)
* [ ] **Gating** visual e funcional baseado em `useEntitlements()`
* [ ] **Preparar interfaces** para integrar Stripe/Pagar.me futuramente

---

## 10) Banners & Buttons (CTAs)

* [ ] **CRUD banners**: título, imagem, link, posição, agendamento, `isActive`
* [ ] **CRUD botões**: label, tipo (`WHATSAPP|EMAIL|LINK|CTA`), `config` (ex.: número, URL)
* [ ] **Feature gate**: checar permissões do plano antes de permitir ativar/usar
* [ ] **Validação Zod** para `config` por `type` (ex.: telefone válido, URL válida)

---

## 11) Reviews (Moderação)

* [ ] **Lista de reviews** com filtros por `status`
* [ ] **Aprovar/Rejeitar** com motivo (gravar no `AuditLog`)
* [ ] **Bulk actions** (aprovar/rejeitar em massa)
* [ ] **Notificação** (placeholder provider) para autor da avaliação quando rejeitada (opcional)

---

## 12) Auditoria

* [ ] **Helper `lib/audit.ts`** para registrar ações em mutations
* [ ] **Gravar** `{ actorUserId, tenantId, action, entity, entityId, diff }`
* [ ] **Tela `/admin/audit`** com DataTable + filtros (entidade, usuário, data)
* [ ] **Proteção**: apenas `SUPER_ADMIN` ou `OFFICE_ADMIN` do próprio tenant

---

## 13) Testes

* [ ] **Unit (Vitest/Jest)**

  * [ ] `mergeEntitlements()`
  * [ ] `obfuscatedLead()` (freemium vs pago)
  * [ ] Directives `@hasRole` e `@withinTenant`
  * [ ] Resolvers de `Lead` respeitando obfuscação e RLS
* [ ] **E2E (Playwright)**

  * [ ] Login `/admin/login`
  * [ ] RBAC: `OFFICE_ADMIN` freemium **não** acessa dados de outro tenant
  * [ ] `/admin/leads`: cartões borrados no freemium, visíveis no gold/silver
  * [ ] Export CSV respeitando obfuscação

---

## 14) CI/CD

* [ ] **GitHub Actions**: `.github/workflows/ci.yml`

  * [ ] `pnpm i`
  * [ ] `pnpm prisma migrate deploy`
  * [ ] `pnpm prisma db seed`
  * [ ] `pnpm db:rls` (aplicar `prisma/rls.sql`)
  * [ ] `pnpm codegen`
  * [ ] `pnpm build`
  * [ ] `pnpm test`
  * [ ] `pnpm test:e2e`
* [ ] **Artefatos**: relatório de testes, coverage (opcional)

---

## 15) Env & Config

* [ ] **Validar env** com `@t3-oss/env-nextjs` + Zod

  * [ ] `DATABASE_URL`
  * [ ] `NEXTAUTH_SECRET`
  * [ ] `JWT_ISSUER`, `JWT_AUDIENCE`
  * [ ] `S3_ACCESS_KEY`, `S3_SECRET_KEY`, `S3_BUCKET`
* [ ] **Docs**: `README-admin.md` com setup, envs, credenciais demo, fluxo de login e troca de tenant

---

## 16) Execução local (Runbook)

* [ ] `pnpm prisma migrate dev`
* [ ] `pnpm prisma db seed`
* [ ] **Aplicar RLS**: `psql -f prisma/rls.sql` **ou** `pnpm db:rls`
* [ ] `pnpm codegen`
* [ ] `pnpm dev`
* [ ] **Login**: `admin@demo.local / Passw0rd!`
* [ ] **Trocar tenant (SUPER\_ADMIN)**: selector no header → envia `x-tenant-id` para GraphQL

---

## 17) Qualidade & Observabilidade

* [ ] **Logs estruturados** (Pino) em resolvers/mutations críticos
* [ ] **Rate limit** básico nas mutations sensíveis (opcional)
* [ ] **Health check** (route handler `/api/health`)
* [ ] **SLO interno**: tempo de resposta GraphQL p95 < 300ms (listas até 50 itens)

---

## 18) Roadmap (Pós-MVP)

* [ ] **Integração Stripe/Pagar.me** (webhooks, invoices, portal de assinaturas)
* [ ] **Meilisearch** para busca de advogados/escritórios
* [ ] **Subscriptions GraphQL** para leads em tempo real
* [ ] **Webhooks externos** (integração CRM)
* [ ] **Auditoria avançada** (diff de payload com mask de PII)

---

Se quiser, eu transformo esse checklist em issues do GitHub automaticamente (com labels e milestones). Quer?
