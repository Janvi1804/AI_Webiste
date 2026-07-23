import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSupabaseEnvironment } from "@/lib/supabase/env";

/** Resolve the user from the signed Supabase access token. Never trust a user id cookie. */
export async function getSessionUserId() {
  const token = (await cookies()).get("sb-access-token")?.value;
  if (!token) return null;
  try {
    const { url, anonKey } = getSupabaseEnvironment();
    const response = await fetch(`${url}/auth/v1/user`, {
      headers: { apikey: anonKey, Authorization: `Bearer ${token}` }, cache: "no-store",
    });
    if (!response.ok) return null;
    const user = await response.json() as { id?: string };
    return user.id ?? null;
  } catch { return null; }
}
export async function requireUser(){ const id=await getSessionUserId(); if(!id) redirect("/login?reason=session-expired"); return id; }
