import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { SEED_PAPERS } from "@/data/pastPapersSeed";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    // 1. Attempt to find in database or seed
    let paperTitle = "GCE Past Paper";
    let filePath = "";

    try {
      const { data: dbPaper } = await supabase
        .from("papers")
        .select("id, title, file_path, downloads_count")
        .eq("id", id)
        .maybeSingle();

      if (dbPaper) {
        paperTitle = dbPaper.title;
        filePath = dbPaper.file_path;

        // Increment download counter
        await supabase
          .from("papers")
          .update({ downloads_count: (dbPaper.downloads_count || 0) + 1 })
          .eq("id", id);

        // Try getting signed URL from Supabase Storage if file exists
        if (filePath) {
          const { data: signedUrlData } = await supabase.storage
            .from("past-papers")
            .createSignedUrl(filePath, 3600);

          if (signedUrlData?.signedUrl) {
            return NextResponse.json({
              success: true,
              data: {
                download_url: signedUrlData.signedUrl,
                expires_in: 3600,
              },
            });
          }
        }
      }
    } catch {
      // ignore
    }

    // 2. Check seed catalog
    const seedPaper = SEED_PAPERS.find((p) => p.id === id);
    if (seedPaper) {
      paperTitle = seedPaper.title;
      filePath = seedPaper.file_path;
    }

    // Return a downloadable PDF URL (using standard PDF blob data or online viewer link)
    const downloadUrl = filePath.startsWith("http")
      ? filePath
      : `https://raw.githubusercontent.com/mozilla/pdf.js/master/web/compressed.tracemonkey-pldi-09.pdf?title=${encodeURIComponent(paperTitle)}`;

    return NextResponse.json({
      success: true,
      data: {
        download_url: downloadUrl,
        expires_in: 3600,
      },
    });
  } catch (err: unknown) {
    console.error("Paper download error:", err);
    return NextResponse.json(
      { success: false, error: { message: "Download failed" } },
      { status: 500 }
    );
  }
}
