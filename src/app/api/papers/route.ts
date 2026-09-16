import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { SEED_PAPERS } from "@/data/pastPapersSeed";
import { PaginatedPapersResponse, Paper } from "@/types/paper";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const level = searchParams.get("level")?.trim();
    const subject = searchParams.get("subject")?.trim();
    const yearStr = searchParams.get("year");
    const q = searchParams.get("q")?.trim().toLowerCase();
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(1, Math.min(50, parseInt(searchParams.get("limit") || "12", 10)));

    let dbPapers: Paper[] = [];
    let isDbSuccess = false;

    // 1. Try fetching from Supabase Database
    try {
      const cookieStore = await cookies();
      const supabase = createClient(cookieStore);

      let query = supabase
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
        .eq("is_active", true)
        .order("year", { ascending: false })
        .order("created_at", { ascending: false });

      if (yearStr) {
        const year = parseInt(yearStr, 10);
        if (!isNaN(year)) query = query.eq("year", year);
      }

      const { data, error } = await query;
      if (!error && Array.isArray(data) && data.length > 0) {
        dbPapers = data.map((item: Record<string, unknown>) => ({
          ...item,
          subject: Array.isArray(item.subject) ? item.subject[0] : item.subject,
          level: Array.isArray(item.level) ? item.level[0] : item.level,
        })) as unknown as Paper[];
        isDbSuccess = true;
      }
    } catch {
      // Fall through to seed catalog
    }

    // 2. Combine with / fallback to Seed Catalog
    const allPapers: Paper[] = isDbSuccess && dbPapers.length > 0 ? dbPapers : SEED_PAPERS;

    // 3. Apply memory filters (level, subject, year, search query)
    let filtered = allPapers;

    if (level) {
      filtered = filtered.filter(
        (p) =>
          p.level?.code?.toLowerCase() === level.toLowerCase() ||
          p.level?.name?.toLowerCase() === level.toLowerCase() ||
          p.level?.id === level
      );
    }

    if (subject) {
      filtered = filtered.filter(
        (p) =>
          p.subject?.code?.toLowerCase() === subject.toLowerCase() ||
          p.subject?.name?.toLowerCase().includes(subject.toLowerCase()) ||
          p.subject?.id === subject
      );
    }

    if (yearStr) {
      const yearNum = parseInt(yearStr, 10);
      if (!isNaN(yearNum)) {
        filtered = filtered.filter((p) => p.year === yearNum);
      }
    }

    if (q) {
      filtered = filtered.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.subject?.name?.toLowerCase().includes(q) ||
          p.exam_session?.toLowerCase().includes(q)
      );
    }

    // 4. Pagination
    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const offset = (page - 1) * limit;
    const paginatedData = filtered.slice(offset, offset + limit);

    const response: PaginatedPapersResponse = {
      success: true,
      data: paginatedData,
      meta: {
        page,
        limit,
        total,
        totalPages,
      },
    };

    return NextResponse.json(response);
  } catch (err: unknown) {
    console.error("Past papers API error:", err);
    return NextResponse.json(
      {
        success: false,
        error: { message: "Failed to fetch past papers", code: "INTERNAL_ERROR" },
      },
      { status: 500 }
    );
  }
}
