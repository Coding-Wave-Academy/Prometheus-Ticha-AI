import { NextResponse } from "next/server";

export async function GET() {
  // TODO: Fetch user progress from database
  return NextResponse.json({ progress: [] });
}
