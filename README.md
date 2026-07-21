# Opervia AI

A Next.js business operations platform with Supabase authentication and organization-isolated data.

## Setup

1. Copy `.env.example` to `.env.local` and set:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (server-only; never prefix it with `NEXT_PUBLIC_`).
2. Create a Supabase project, enable Email auth, and configure **Site URL** as `http://localhost:3000` plus the reset redirect URL `http://localhost:3000/reset-password`.
3. Apply migrations in order using the Supabase CLI: `npx supabase db push`.
4. Start the application: `npm run dev`.

## Commands

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## Authentication and isolation

Login issues secure HTTP-only session cookies and the route proxy redirects unauthenticated requests from `/app/*`. Supabase Auth creates `profiles` through a database trigger. Every business table is scoped by `organization_id`; RLS policies use `organization_members` to enforce membership. The server resolves the active organization from the authenticated profile and membership table—never from browser-provided organization IDs. Viewers have read access only; owner/admin organization changes are additionally guarded in RLS.

## Migrations

- `202607210001_phase_2_auth.sql`: profiles, organizations, members, core business data, audit data, and profile trigger.
- `202607210002_rls.sql`: organization-isolation and role-aware RLS policies.

For production, apply migrations through your CI or `supabase db push`; do not execute the service-role key in browser code.
