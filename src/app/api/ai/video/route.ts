import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * /api/ai/video — Generates/serves 2D concept explainer animations
 * using Gemini Veo / Flow or optimized vector 2D previews.
 */
export async function POST(req: NextRequest) {
  try {
    const { topic, subject } = await req.json();
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

    // Check if Veo / Gemini video generation model is available
    if (apiKey) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/veo-2.0-generate-video:predict?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              prompt: `A clean, professional 2D vector animation explaining ${topic} for ${subject} GCE students. Vibrant color palette, neobrutalist style.`,
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.videoUrl) {
            return NextResponse.json({ videoUrl: data.videoUrl, mode: "veo" });
          }
        }
      } catch {
        // Fall back to clean 2D vector animation component
      }
    }

    // High quality vector animation metadata fallback
    return NextResponse.json({
      videoUrl: null,
      mode: "vector2d",
      title: `${subject}: ${topic}`,
      aspectRatio: "16:9",
    });
  } catch (err) {
    console.error("Video API error:", err);
    return NextResponse.json({ mode: "vector2d", videoUrl: null });
  }
}
