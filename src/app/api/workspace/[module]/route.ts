import { NextRequest, NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/auth/session";
import { can, type Permission } from "@/lib/permissions";
import { supabaseRequest } from "@/lib/supabase/server";
import { resolveActiveOrganization } from "@/services/organization-service";
import { workspaceModules, type WorkspaceModule } from "@/lib/workspace/types";

const permissions: Record<WorkspaceModule, Permission> = { projects:"project.create", tasks:"task.create", customers:"record.write", leads:"record.write", meetings:"record.write", documents:"record.write", support_requests:"record.write" };
const names: Record<WorkspaceModule, string> = { projects:"name", tasks:"title", customers:"name", leads:"name", meetings:"title", documents:"title", support_requests:"subject" };
function parseRecord(value: unknown): Record<string, unknown> | null { return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : null; }
function validUuid(value: string | null) { return Boolean(value && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)); }
function moduleFrom(value:string) { return workspaceModules.includes(value as WorkspaceModule) ? value as WorkspaceModule : null; }
function failure(message:string, status:number) { return NextResponse.json({ message }, { status }); }
async function context(module:string, write=false) {
  const table=moduleFrom(module); if (!table) return null;
  const userId=await getSessionUserId(); if (!userId) throw new Error("UNAUTHORIZED");
  const workspace=await resolveActiveOrganization(userId);
  if (write && !can(workspace.role, permissions[table])) throw new Error("FORBIDDEN");
  return { table, workspaceId:workspace.organization.id, userId };
}
function error(cause:unknown) { if (cause instanceof Error && cause.message === "UNAUTHORIZED") return failure("Sign in to access this workspace.",401); if (cause instanceof Error && cause.message === "FORBIDDEN") return failure("You do not have permission for this action.",403); return failure("Unable to complete this request.",500); }
export async function GET(request:NextRequest,{params}:{params:Promise<{module:string}>}) { try { const found=await context((await params).module); if(!found)return failure("Unknown module",404); const limit=Math.min(Math.max(Number(request.nextUrl.searchParams.get("limit") ?? 50),1),100); const search=request.nextUrl.searchParams.get("search")?.trim(); const field=names[found.table]; const filter=search ? `&${field}=ilike.*${encodeURIComponent(search)}*` : ""; const data=await supabaseRequest<unknown[]>(`${found.table}?organization_id=eq.${found.workspaceId}${filter}&order=created_at.desc&limit=${limit}`); return NextResponse.json({data}); } catch(cause) { return error(cause); } }
export async function POST(request:NextRequest,{params}:{params:Promise<{module:string}>}) { try { const found=await context((await params).module,true); if(!found)return failure("Unknown module",404); const parsed=parseRecord(await request.json()); if(!parsed)return failure("Invalid record payload.",400); const value=parsed[names[found.table]]; if(typeof value!=="string" || !value.trim()) return failure(`${names[found.table]} is required.`,400); const payload={...parsed,organization_id:found.workspaceId,created_by:found.userId}; const data=await supabaseRequest<unknown[]>(found.table,{method:"POST",headers:{Prefer:"return=representation"},body:JSON.stringify(payload)}); return NextResponse.json({data:data[0]},{status:201}); } catch(cause) { return error(cause); } }
export async function PATCH(request:NextRequest,{params}:{params:Promise<{module:string}>}) { try { const found=await context((await params).module,true); if(!found)return failure("Unknown module",404); const id=request.nextUrl.searchParams.get("id"); if(!validUuid(id))return failure("A valid record id is required.",400); const parsed=parseRecord(await request.json()); if(!parsed)return failure("Invalid record payload.",400); delete parsed.organization_id; delete parsed.created_by; const data=await supabaseRequest<unknown[]>(`${found.table}?id=eq.${id}&organization_id=eq.${found.workspaceId}`,{method:"PATCH",headers:{Prefer:"return=representation"},body:JSON.stringify(parsed)}); if(!data[0])return failure("Record not found.",404); return NextResponse.json({data:data[0]}); } catch(cause) { return error(cause); } }
export async function DELETE(request:NextRequest,{params}:{params:Promise<{module:string}>}) { try { const found=await context((await params).module,true); if(!found)return failure("Unknown module",404); const id=request.nextUrl.searchParams.get("id"); if(!validUuid(id))return failure("A valid record id is required.",400); await supabaseRequest(`${found.table}?id=eq.${id}&organization_id=eq.${found.workspaceId}`,{method:"DELETE"}); return new NextResponse(null,{status:204}); } catch(cause) { return error(cause); } }
