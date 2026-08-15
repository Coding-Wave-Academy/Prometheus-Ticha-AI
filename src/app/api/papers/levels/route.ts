import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { SEED_EDUCATIONAL_LEVELS } from "@/data/pastPapersSeed";
import { EducationalLevel } from "@/types/paper";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase
      .from("educational_levels")
      .select("*")
      .order("sort_order", { ascending: true });

    if (!error && Array.isArray(data) && data.length > 0) {
      return NextResponse.json({
        success: true,
        data: data as EducationalLevel[],
      });
    }

    return NextResponse.json({
      success: true,
      data: SEED_EDUCATIONAL_LEVELS,
    });
  } catch {
    return NextResponse.json({
      success: true,
      data: SEED_EDUCATIONAL_LEVELS,
    });
  }
}
