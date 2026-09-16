import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { SEED_PAPERS } from "@/data/pastPapersSeed";
import { Paper } from "@/types/paper";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    try {
      const { data, error } = await supabase
        .from("papers")
        .select(`
          id,
          title,
          year,
          exam_session,
          description,
          file_path,
          file_size,
          file_type,
          downloads_count,
          is_active,
          created_at,
          subject:subjects (
            id,
            name,
            code
          ),
          level:educational_levels (
            id,
            name,
            code
          )
        `)
        .eq("id", id)
        .maybeSingle();

      if (!error && data) {
        const paper: Paper = {
          ...data,
          subject: Array.isArray(data.subject) ? data.subject[0] : data.subject,
          level: Array.isArray(data.level) ? data.level[0] : data.level,
        };
        return NextResponse.json({ success: true, data: paper });
      }
    } catch {
      // ignore
    }

    const seedPaper = SEED_PAPERS.find((p) => p.id === id);
    if (seedPaper) {
      return NextResponse.json({ success: true, data: seedPaper });
    }

    return NextResponse.json(
      { success: false, error: { message: "Paper not found", code: "NOT_FOUND" } },
      { status: 404 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: { message: "Failed to fetch paper" } },
      { status: 500 }
    );
  }
}
