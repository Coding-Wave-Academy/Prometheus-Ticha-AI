import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

/**
 * /api/progress — Track quiz attempts and compute per-subject progress.
 *
 * GET  /api/progress?userId=<uuid>  → returns per-subject coverage percentages
 * POST /api/progress                → record a new quiz attempt
 */

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ progress: {} });
  }

  const { data, error } = await supabaseAdmin
    .from("quiz_attempts")
    .select("subject, score, total_questions")
    .eq("user_id", userId);

  if (error) {
    console.error("Supabase progress GET error:", error);
    return NextResponse.json({ progress: {} });
  }

  // Compute per-subject average score as a percentage
  const subjectMap: Record<string, { totalScore: number; totalQ: number; count: number }> = {};

  for (const attempt of data || []) {
    const subj = attempt.subject || "General";
    if (!subjectMap[subj]) {
      subjectMap[subj] = { totalScore: 0, totalQ: 0, count: 0 };
    }
    subjectMap[subj].totalScore += attempt.score ?? 0;
    subjectMap[subj].totalQ += attempt.total_questions ?? 1;
    subjectMap[subj].count += 1;
  }

  const progress: Record<string, number> = {};
  for (const [subj, stats] of Object.entries(subjectMap)) {
    // Percentage = (total correct / total questions) * 100, capped at 100
    progress[subj] = Math.min(
      100,
      Math.round((stats.totalScore / stats.totalQ) * 100)
    );
  }

  return NextResponse.json({ progress });
}

export async function POST(req: NextRequest) {
  try {
    const { userId, subject, score, total_questions, difficulty } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "userId required" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("quiz_attempts")
      .insert({
        user_id: userId,
        subject: subject || "General",
        score: score ?? 0,
        total_questions: total_questions ?? 1,
        difficulty: difficulty || "Medium",
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase progress POST error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ attempt: data });
  } catch (err) {
    console.error("Progress POST error:", err);
    return NextResponse.json({ error: "Failed to save attempt" }, { status: 500 });
  }
}
