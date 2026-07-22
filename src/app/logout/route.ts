import { NextResponse } from "next/server";
export async function GET(request:Request){const response=NextResponse.redirect(new URL("/login",request.url));response.cookies.delete("opervia-user-id");response.cookies.delete("sb-access-token");return response;}
