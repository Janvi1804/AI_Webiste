import { cookies } from "next/headers";
import { getSupabaseEnvironment } from "./env";
/** Server-only, typed REST adapter. Service-role credentials are intentionally never read here. */
export async function serverSupabaseHeaders() { const env=getSupabaseEnvironment(); const jar=await cookies(); const token=jar.get("sb-access-token")?.value; return { apikey:env.anonKey, Authorization:`Bearer ${token ?? env.anonKey}`, "Content-Type":"application/json" }; }
export async function supabaseRequest<T>(path:string, init:RequestInit={}) { const {url}=getSupabaseEnvironment(); const headers=await serverSupabaseHeaders(); const response=await fetch(`${url}/rest/v1/${path}`,{...init,headers:{...headers,...init.headers},cache:"no-store"}); if(!response.ok) throw new Error("Supabase request failed"); return response.json() as Promise<T>; }
