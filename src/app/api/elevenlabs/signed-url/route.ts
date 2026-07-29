import { NextResponse } from "next/server";

/**
 * POST /api/elevenlabs/signed-url
 *
 * Generates a signed URL for the ElevenLabs Conversational AI agent.
 * This keeps the API key server-side and returns a short-lived
 * signed URL that the client SDK can use to start a session.
 */
export async function POST() {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "ElevenLabs API key not configured" },
      { status: 500 }
    );
  }

  // Joe — African accent male voice
  // You can create a Conversational AI agent in the ElevenLabs dashboard
  // and paste the agent_id here. For now we use a signed URL approach
  // that lets the client connect with the voice config embedded.
  const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID;

  if (!agentId) {
    return NextResponse.json(
      { error: "ElevenLabs Agent ID not configured. Create a Conversational AI agent at elevenlabs.io and add NEXT_PUBLIC_ELEVENLABS_AGENT_ID to your .env.local" },
      { status: 500 }
    );
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
      const errorText = await response.text();
      console.error("ElevenLabs signed URL error:", errorText);
      return NextResponse.json(
        { error: "Failed to get signed URL from ElevenLabs" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({ signed_url: data.signed_url });
  } catch (error) {
    console.error("Signed URL API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
