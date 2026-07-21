export const organizationRoles = ["owner","admin","manager","member","viewer","support_agent","sales_representative"] as const;
export type OrganizationRole = typeof organizationRoles[number];
export type Profile = { id:string; full_name:string | null; avatar_url:string | null; active_organization_id:string | null; onboarding_completed:boolean };
export type Organization = { id:string; name:string; slug:string; company_name:string | null; industry:string | null };
export type AuthenticatedWorkspace = { profile: Profile; organization: Organization; role: OrganizationRole };
