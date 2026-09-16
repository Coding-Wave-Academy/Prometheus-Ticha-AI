import { NextRequest, NextResponse } from "next/server";
import { requireAuth, validateFieldLength, INPUT_LIMITS } from "@/lib/apiAuth";

export async function POST(req: NextRequest) {
  try {
    // ── Auth gate ─────────────────────────────────────────────────────
    const { errorResponse } = await requireAuth();
    if (errorResponse) return errorResponse;

    const { text } = await req.json();

    // ── Input validation ──────────────────────────────────────────────
    const textCheck = validateFieldLength(text, "text", INPUT_LIMITS.TTS_TEXT);
    if (textCheck) return textCheck;

    if (!process.env.ELEVENLABS_API_KEY) {
      return NextResponse.json(
        { error: "ElevenLabs API key not configured" },
        { status: 404 }
      );
    }

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    // Joe — African accent male voice (from ElevenLabs Voice Library)
    // Replace with your actual Joe voice_id from ElevenLabs dashboard
    const voiceId = process.env.ELEVENLABS_JOE_VOICE_ID || "21m00Tcm4TlvDq8ikWAM";

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": process.env.ELEVENLABS_API_KEY,
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("ElevenLabs API Error:", errorText);
      return NextResponse.json({ error: "Failed to generate audio" }, { status: response.status });
    }

    return new NextResponse(response.body, {
      headers: {
        "Content-Type": "audio/mpeg",
      },
    });
  } catch (error) {
    console.error("TTS API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
