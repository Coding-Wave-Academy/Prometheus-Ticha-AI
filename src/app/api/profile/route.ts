import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

/**
 * /api/profile — Read and write student profile data to Supabase.
 *
 * GET  /api/profile?userId=<uuid>  → fetch profile row
 * POST /api/profile                → upsert profile fields
 */

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "userId required" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error && error.code !== "PGRST116") {
    // PGRST116 = no rows — profile not yet created, that's fine
    console.error("Supabase profile GET error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ profile: data || null });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      userId,
      full_name,
      education_level,
      primary_goal,
      struggles,
      school_name,
      region,
      profile_completed,
      avatar_url,
    } = body;

    if (!userId) {
      return NextResponse.json({ error: "userId required" }, { status: 400 });
    }

    const upsertData: Record<string, unknown> = {
      id: userId,
      updated_at: new Date().toISOString(),
    };

    if (full_name !== undefined) upsertData.full_name = full_name;
    if (education_level !== undefined) upsertData.education_level = education_level;
    if (primary_goal !== undefined) upsertData.primary_goal = primary_goal;
    if (struggles !== undefined) upsertData.struggles = struggles;
    if (school_name !== undefined) upsertData.school_name = school_name;
    if (region !== undefined) upsertData.region = region;
    if (profile_completed !== undefined) upsertData.profile_completed = profile_completed;
    if (avatar_url !== undefined) upsertData.avatar_url = avatar_url;

    const { data, error } = await supabaseAdmin
      .from("profiles")
      .upsert(upsertData, { onConflict: "id" })
      .select()
      .single();

    if (error) {
      console.error("Supabase profile POST error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ profile: data });
  } catch (err) {
    console.error("Profile API error:", err);
    return NextResponse.json({ error: "Failed to save profile" }, { status: 500 });
  }
}
