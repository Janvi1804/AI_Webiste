# Opervia AI architecture plan

## Application shape

The initial interface is a Next.js App Router application, with the dashboard rendering from typed view models. Subsequent modules should be organized with route groups: `(marketing)` for the landing page, `(auth)` for authentication, and `(workspace)` for the protected `/app/*` experience. Interactive controls remain isolated in client components; page data and permissions stay on the server by default.

## Monorepo target

```text
apps/web              Next.js application and route handlers
apps/mcp-server       TypeScript MCP server (streamable HTTP and stdio)
apps/worker           scheduled reports and notifications
packages/database     Prisma schema, repositories, Supabase adapters
packages/services     shared business services and permission checks
packages/validation   Zod request and MCP tool contracts
packages/shared-types typed API, tool, and view-model contracts
packages/ui           reusable design-system primitives
```

Route handlers and MCP tools must both call services from `packages/services`; only repositories in `packages/database` access PostgreSQL. The authenticated server session resolves the organization before any service call.

## Data and security plan

Every workspace-scoped table uses `organization_id`, `created_at`, `updated_at`, and `created_by`. PostgreSQL RLS policies additionally enforce membership. Services apply role guards before mutations, validate inputs with Zod, create audit records for sensitive operations, and record every MCP execution with its actor, input summary, result, and status. Destructive and external actions return an approval request rather than execute immediately.

## Initial route map

```text
/                         marketing landing page
/login, /register          authentication
/onboarding                workspace setup
/app                        overview
/app/projects/[projectId]  project workspace
/app/tasks                  kanban and task views
/app/customers              customer workspace
/app/leads                  sales pipeline
/app/assistant              dedicated assistant
/app/settings/*             workspace configuration
```

The present dashboard establishes the visual system: semantic color tokens, responsive cards, compact data density, accessible buttons, keyboard command search, a light/dark toggle, and a persistent AI assistant entry point.
