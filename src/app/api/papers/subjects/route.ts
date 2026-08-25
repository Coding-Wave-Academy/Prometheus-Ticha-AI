import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { SEED_SUBJECTS } from "@/data/pastPapersSeed";
import { Subject } from "@/types/paper";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const levelCodeOrId = searchParams.get("level")?.trim().toUpperCase();

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const query = supabase
      .from("subjects")
      .select(`
        id,
        name,
        code,
        is_active,
        level:educational_levels (
          id,
          code,
          name
        )
      `)
      .eq("is_active", true)
      .order("name", { ascending: true });

    const { data, error } = await query;

    if (!error && Array.isArray(data) && data.length > 0) {
      let results = data.map((item: Record<string, unknown>) => {
        const level = item.level as { code?: string } | { code?: string }[] | undefined;
        return {
          id: String(item.id || ""),
          name: String(item.name || ""),
          code: String(item.code || ""),
          is_active: Boolean(item.is_active),
          level_code: Array.isArray(level) ? level[0]?.code : level?.code,
        };
      });

      if (levelCodeOrId) {
        results = results.filter(
          (s) => !s.level_code || s.level_code.toUpperCase() === levelCodeOrId
        );
      }

      return NextResponse.json({
        success: true,
        data: results as Subject[],
      });
    }

    // Fallback to Seed Subjects
    let seedResults = SEED_SUBJECTS;
    if (levelCodeOrId) {
      if (levelCodeOrId === "O/L" || levelCodeOrId === "OL") {
        seedResults = seedResults.filter((s) => s.code.endsWith("-OL"));
      } else if (levelCodeOrId === "A/L" || levelCodeOrId === "AL") {
        seedResults = seedResults.filter((s) => s.code.endsWith("-AL"));
      }
    }

    return NextResponse.json({
      success: true,
      data: seedResults,
    });
  } catch {
    return NextResponse.json({
      success: true,
      data: SEED_SUBJECTS,
    });
  }
}
