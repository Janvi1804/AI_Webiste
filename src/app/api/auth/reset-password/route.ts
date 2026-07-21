import { NextResponse } from "next/server"; export async function POST(){return NextResponse.json({message:"Open the reset link from your email to update your password."},{status:400});}
