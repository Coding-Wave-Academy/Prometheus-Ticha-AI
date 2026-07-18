import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

/**
 * /api/courses — Manage student course lists stored in Supabase.
 *
 * GET  /api/courses?userId=<uuid>  → fetch all courses for a student
 * POST /api/courses                → add/upsert a list of courses for a student
 */

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ courses: [] });
  }

  const { data, error } = await supabaseAdmin
    .from("student_courses")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Supabase courses GET error:", error);
    return NextResponse.json({ courses: [] });
  }

  return NextResponse.json({ courses: data || [] });
}

export async function POST(req: NextRequest) {
  try {
    const { userId, courses } = await req.json();

    if (!userId || !Array.isArray(courses)) {
      return NextResponse.json({ error: "userId and courses array required" }, { status: 400 });
    }

    // Upsert all courses in batch — identify by user_id + course_code
    const rows = courses.map((c: { name: string; code?: string; level?: string }) => ({
      user_id: userId,
      name: c.name,
      code: c.code || null,
      level: c.level || null,
      created_at: new Date().toISOString(),
    }));

    const { data, error } = await supabaseAdmin
      .from("student_courses")
      .upsert(rows, { onConflict: "user_id,name" })
      .select();

    if (error) {
      console.error("Supabase courses POST error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ courses: data });
  } catch (err) {
    console.error("Courses POST error:", err);
    return NextResponse.json({ error: "Failed to save courses" }, { status: 500 });
  }
}
