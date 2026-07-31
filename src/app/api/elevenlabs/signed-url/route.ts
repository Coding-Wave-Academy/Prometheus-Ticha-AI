import { NextResponse } from "next/server";

/**
 * POST /api/elevenlabs/signed-url
 *
 * Generates a signed URL for the ElevenLabs Conversational AI agent if configured.
 * Gracefully returns { hasAgent: false } if Agent ID or API key is not present.
 */
export async function POST() {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID;

  if (!apiKey || !agentId) {
    return NextResponse.json({
      hasAgent: false,
      message: "ElevenLabs Agent ID or API Key not configured. Using Gemini Voice AI fallback.",
    });
  }

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=${agentId}`,
      {
        method: "GET",
        headers: {
          "xi-api-key": apiKey,
        },
      }
    );

    if (!response.ok) {
      console.warn("ElevenLabs signed URL request non-ok status:", response.status);
      return NextResponse.json({
        hasAgent: false,
        message: "Failed to obtain signed URL from ElevenLabs. Using Gemini Voice AI fallback.",
      });
    }

    const data = await response.json();
    return NextResponse.json({
      hasAgent: true,
      signed_url: data.signed_url,
    });
  } catch (error) {
    console.error("Signed URL API exception:", error);
    return NextResponse.json({
      hasAgent: false,
      message: "Network error contacting ElevenLabs. Using Gemini Voice AI fallback.",
    });
  }
}
