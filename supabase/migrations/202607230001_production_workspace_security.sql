-- Production workspace provisioning and stricter tenant boundaries.
-- The function derives the actor from auth.uid(); callers never submit an organization id.
alter table public.organizations add column if not exists timezone text not null default 'UTC';
create or replace function public.create_workspace(workspace_name text, business_type text default null, workspace_timezone text default 'UTC')
returns table(id uuid) language plpgsql security definer set search_path=public as $$
declare workspace_id uuid; base_slug text;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  if length(trim(workspace_name)) = 0 then raise exception 'Workspace name is required'; end if;
  base_slug := lower(regexp_replace(trim(workspace_name), '[^a-zA-Z0-9]+', '-', 'g'));
  insert into public.organizations(name,slug,industry,timezone,created_by)
  values(trim(workspace_name), left(trim(both '-' from base_slug), 40) || '-' || substr(replace(gen_random_uuid()::text,'-',''),1,8), nullif(trim(business_type),''), coalesce(nullif(trim(workspace_timezone),''),'UTC'), auth.uid()) returning organizations.id into workspace_id;
  insert into public.organization_members(organization_id,user_id,role,created_by) values(workspace_id,auth.uid(),'admin',auth.uid());
  update public.profiles set active_organization_id=workspace_id,onboarding_completed=true where profiles.id=auth.uid();
  return query select workspace_id;
end;$$;
revoke all on function public.create_workspace(text,text,text) from public;
grant execute on function public.create_workspace(text,text,text) to authenticated;

-- Client access must be explicitly shared; membership alone never exposes internal work.
create table if not exists public.record_shares (id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade, user_id uuid not null references auth.users(id) on delete cascade, resource_type text not null, resource_id uuid not null, created_by uuid not null references auth.users(id), created_at timestamptz not null default now(), unique(organization_id,user_id,resource_type,resource_id));
alter table public.record_shares enable row level security;
create policy "admins manage record shares" on public.record_shares for all using(public.has_org_role(organization_id,array['owner','admin','manager']::public.organization_role[])) with check(public.has_org_role(organization_id,array['owner','admin','manager']::public.organization_role[]));
create index if not exists record_shares_lookup_idx on public.record_shares(organization_id,user_id,resource_type,resource_id);
-- Replace broad client membership reads with explicit shares (tickets remain requester-owned).
drop policy if exists "organization isolation projects" on public.projects;
drop policy if exists "organization isolation tasks" on public.tasks;
drop policy if exists "organization isolation customers" on public.customers;
drop policy if exists "organization isolation leads" on public.leads;
drop policy if exists "organization isolation meetings" on public.meetings;
drop policy if exists "organization isolation documents" on public.documents;
drop policy if exists "organization isolation support" on public.support_requests;
create policy "projects role and share access" on public.projects for select using (public.has_org_role(organization_id,array['owner','admin','manager','member','viewer','support_agent','sales_representative']::public.organization_role[]) or exists(select 1 from public.record_shares s where s.organization_id=projects.organization_id and s.user_id=auth.uid() and s.resource_type='projects' and s.resource_id=projects.id));
create policy "projects authorized write" on public.projects for all using(public.has_org_role(organization_id,array['owner','admin','manager']::public.organization_role[])) with check(public.has_org_role(organization_id,array['owner','admin','manager']::public.organization_role[]));
create policy "tasks role and share access" on public.tasks for select using (public.has_org_role(organization_id,array['owner','admin','manager','member','viewer','support_agent','sales_representative']::public.organization_role[]) or exists(select 1 from public.record_shares s where s.organization_id=tasks.organization_id and s.user_id=auth.uid() and s.resource_type='tasks' and s.resource_id=tasks.id));
create policy "tasks authorized write" on public.tasks for all using(public.has_org_role(organization_id,array['owner','admin','manager','member','support_agent','sales_representative']::public.organization_role[])) with check(public.has_org_role(organization_id,array['owner','admin','manager','member','support_agent','sales_representative']::public.organization_role[]));
create policy "customers staff access" on public.customers for all using(public.has_org_role(organization_id,array['owner','admin','manager','member','viewer','support_agent','sales_representative']::public.organization_role[])) with check(public.has_org_role(organization_id,array['owner','admin','manager','member','support_agent','sales_representative']::public.organization_role[]));
create policy "leads staff access" on public.leads for all using(public.has_org_role(organization_id,array['owner','admin','manager','member','viewer','sales_representative']::public.organization_role[])) with check(public.has_org_role(organization_id,array['owner','admin','manager','member','sales_representative']::public.organization_role[]));
create policy "meetings staff access" on public.meetings for all using(public.has_org_role(organization_id,array['owner','admin','manager','member','viewer']::public.organization_role[])) with check(public.has_org_role(organization_id,array['owner','admin','manager','member']::public.organization_role[]));
create policy "documents role and share access" on public.documents for select using (public.has_org_role(organization_id,array['owner','admin','manager','member','viewer','support_agent','sales_representative']::public.organization_role[]) or exists(select 1 from public.record_shares s where s.organization_id=documents.organization_id and s.user_id=auth.uid() and s.resource_type='documents' and s.resource_id=documents.id));
create policy "documents authorized write" on public.documents for all using(public.has_org_role(organization_id,array['owner','admin','manager','member','support_agent','sales_representative']::public.organization_role[])) with check(public.has_org_role(organization_id,array['owner','admin','manager','member','support_agent','sales_representative']::public.organization_role[]));
create policy "tickets requester or staff access" on public.support_requests for select using(created_by=auth.uid() or public.has_org_role(organization_id,array['owner','admin','manager','member','viewer','support_agent']::public.organization_role[]));
create policy "tickets authorized create" on public.support_requests for insert with check(created_by=auth.uid() and public.is_org_member(organization_id));
create policy "tickets staff update" on public.support_requests for update using(public.has_org_role(organization_id,array['owner','admin','manager','member','support_agent']::public.organization_role[])) with check(public.has_org_role(organization_id,array['owner','admin','manager','member','support_agent']::public.organization_role[]));
