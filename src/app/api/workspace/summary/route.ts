import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/auth/session";
import { supabaseRequest } from "@/lib/supabase/server";
import { resolveActiveOrganization } from "@/services/organization-service";

export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ message: "Sign in to load your workspace." }, { status: 401 });
  try {
    const workspace = await resolveActiveOrganization(userId);
    const id = workspace.organization.id;
    const [projects, tasks, leads] = await Promise.all([
      supabaseRequest<{ id: string }[]>(`projects?organization_id=eq.${id}&archived_at=is.null&status=neq.completed&select=id`),
      supabaseRequest<{ id: string }[]>(`tasks?organization_id=eq.${id}&completed_at=is.null&select=id`),
      supabaseRequest<{ estimated_value: number | null }[]>(`leads?organization_id=eq.${id}&stage=not.in.(won,lost)&select=estimated_value`),
    ]);
    return NextResponse.json({ organization: workspace.organization, role: workspace.role, metrics: { projects: projects.length, tasks: tasks.length, pipeline: leads.reduce((sum, lead) => sum + Number(lead.estimated_value ?? 0), 0) } });
  } catch (cause) {
    if (process.env.NODE_ENV === "development") console.error("Workspace summary failed", cause);
    return NextResponse.json({ message: "Unable to load workspace. Please try again." }, { status: 500 });
  }
}
