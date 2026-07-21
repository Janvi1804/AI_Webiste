import { cookies } from "next/headers";
import { redirect } from "next/navigation";
/** Authentication is verified by Supabase Auth before this identifier is written. */
export async function getSessionUserId(){ return (await cookies()).get("opervia-user-id")?.value ?? null; }
export async function requireUser(){ const id=await getSessionUserId(); if(!id) redirect("/login?reason=session-expired"); return id; }
