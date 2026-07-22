import { findWorkspaceForUser } from "@/repositories/organizations";
import type { AuthenticatedWorkspace } from "@/types/auth";
export async function resolveActiveOrganization(userId:string):Promise<AuthenticatedWorkspace>{ const workspace=await findWorkspaceForUser(userId); if(!workspace) throw new Error("No organization membership found"); return workspace; }
