import { NextResponse } from "next/server";

export async function GET() {
  // TODO: Fetch courses from database
  return NextResponse.json({ courses: [] });
}
