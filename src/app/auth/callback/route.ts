import { NextResponse } from "next/server";
/** Supabase email links exchange their code client-side or redirect here after verification. */
export async function GET(request:Request){return NextResponse.redirect(new URL("/login?verified=1",request.url));}
