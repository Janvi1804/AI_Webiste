import { NextResponse } from "next/server";
import { getSupabaseEnvironment } from "@/lib/supabase/env";

type SupabaseAuthError = { msg?: string; message?: string; error_description?: string; code?: string };
function publicMessage(status: number, body: SupabaseAuthError) {
  const reason = body.error_description ?? body.msg ?? body.message;
  if (status === 429) return "Too many attempts. Please wait a few minutes and try again.";
  if (status >= 500) return "The authentication service is temporarily unavailable. Please try again shortly.";
  return reason ?? "We could not create your account. Check your details and try again.";
}
function safeError(cause: unknown) { return cause instanceof Error ? { name: cause.name, message: cause.message } : { name: "UnknownError" }; }
export async function POST(request: Request) {
  try {
    const { email, password, fullName } = await request.json() as { email?: string; password?: string; fullName?: string };
    if (!email?.match(/^\S+@\S+\.\S+$/)) return NextResponse.json({ message: "Enter a valid email address." }, { status: 400 });
    if (!password || password.length < 8) return NextResponse.json({ message: "Password must be at least 8 characters." }, { status: 400 });
    const { url, anonKey } = getSupabaseEnvironment();
    const result = await fetch(`${url}/auth/v1/signup`, { method: "POST", headers: { apikey: anonKey, "Content-Type": "application/json" }, body: JSON.stringify({ email, password, data: { full_name: fullName?.trim() ?? "" }, options: { emailRedirectTo: new URL("/auth/callback", request.url).toString() } }) });
    const body = await result.json().catch(() => ({})) as SupabaseAuthError & { user?: { identities?: unknown[] } };
    if (!result.ok) {
      console.error("Supabase signup rejected", { status: result.status, code: body.code, message: body.error_description ?? body.msg ?? body.message });
      return NextResponse.json({ message: publicMessage(result.status, body) }, { status: result.status === 429 ? 429 : 400 });
    }
    if (body.user?.identities?.length === 0) return NextResponse.json({ message: "An account with this email already exists. Sign in or reset your password." }, { status: 409 });
    return NextResponse.json({ redirect: "/verify-email", message: "Check your inbox to verify your email address." }, { status: 201 });
  } catch (cause) {
    const details = safeError(cause);
    console.error("Supabase signup request failed", details);
    const missingConfig = (details.message ?? "").includes("NEXT_PUBLIC_SUPABASE_") || (details.message ?? "").includes("Missing required");
    return NextResponse.json({ message: missingConfig ? "Registration is not configured. Ask an administrator to set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel." : "We could not reach the registration service. Check your connection and try again." }, { status: 503 });
  }
}
