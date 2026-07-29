import { NextRequest, NextResponse } from "next/server";
import { formatAIText } from "@/lib/formatAIText";

export const dynamic = "force-dynamic";

export interface ConceptVideoResponse {
  id: string;
  subject: string;
  topic: string;
  duration: number;
  scenes: {
    timestamp: string;
    headline: string;
    subtext: string;
    visualType: "particles" | "wave" | "graph" | "table" | "molecule";
    color: string;
  }[];
  keyTakeaway: string;
}

const fallbackConceptVideos: Record<string, ConceptVideoResponse> = {
  physics: {
    id: "vid-phys-1",
    subject: "Physics",
    topic: "Electromagnetism & Faraday's Law",
    duration: 20,
    scenes: [
      {
        timestamp: "0:05",
        headline: "Magnetic Field Lines in Motion",
        subtext: "When a magnet moves relative to a copper loop, magnetic field lines cross the conductor.",
        visualType: "particles",
        color: "#FFB040",
      },
      {
        timestamp: "0:10",
        headline: "Induced Electromotive Force (EMF)",
        subtext: "The changing magnetic flux pushes free electrons inside the wire to create a voltage difference.",
        visualType: "wave",
        color: "#B6FF00",
      },
      {
        timestamp: "0:15",
        headline: "Lenz's Law Opposing Current",
        subtext: "The direction of induced current creates a magnetic field opposing the initial change.",
        visualType: "graph",
        color: "#FFD9E0",
      },
      {
        timestamp: "0:20",
        headline: "Exam Formula Rule",
        subtext: "EMF is directly proportional to rate of change of magnetic flux linkage.",
        visualType: "particles",
        color: "#B6FF00",
      },
    ],
    keyTakeaway: "Changing magnetic flux linkages induce an EMF proportional to rate of change.",
  },
  math: {
    id: "vid-math-1",
    subject: "Pure Mathematics",
    topic: "Calculus Limits & Local Linearity",
    duration: 20,
    scenes: [
      {
        timestamp: "0:05",
        headline: "Curved Functions at Macro Scale",
        subtext: "A smooth continuous curve looks non-linear when viewed across a wide domain.",
        visualType: "graph",
        color: "#B6FF00",
      },
      {
        timestamp: "0:10",
        headline: "Infinite Zoom Effect",
        subtext: "As we zoom in closer to any single point on the curve, curvature disappears.",
        visualType: "wave",
        color: "#D3E2FF",
      },
      {
        timestamp: "0:15",
        headline: "Local Linearity & Tangents",
        subtext: "At an infinitely small delta x, any differentiable curve becomes a straight tangent line.",
        visualType: "graph",
        color: "#FFB040",
      },
      {
        timestamp: "0:20",
        headline: "Derivative Definition",
        subtext: "The derivative dy/dx measures instantaneous slope via limit processes.",
        visualType: "particles",
        color: "#B6FF00",
      },
    ],
    keyTakeaway: "Limits calculate instantaneous slope by examining local linearity at a single point.",
  },
  ict: {
    id: "vid-ict-1",
    subject: "ICT & Computing",
    topic: "Database Normalization (1NF to 3NF)",
    duration: 20,
    scenes: [
      {
        timestamp: "0:05",
        headline: "Unnormalized Data Chaos",
        subtext: "Raw tables contain repeating groups, duplicate fields, and update anomalies.",
        visualType: "table",
        color: "#FFDF9E",
      },
      {
        timestamp: "0:10",
        headline: "First Normal Form (1NF)",
        subtext: "Ensures every table column contains atomic, indivisible values with unique primary keys.",
        visualType: "table",
        color: "#B6FF00",
      },
      {
        timestamp: "0:15",
        headline: "Second Normal Form (2NF)",
        subtext: "Removes partial dependencies: non-key attributes must depend on full primary key.",
        visualType: "table",
        color: "#D3E2FF",
      },
      {
        timestamp: "0:20",
        headline: "Third Normal Form (3NF)",
        subtext: "Eliminates transitive dependencies so attributes depend solely on key.",
        visualType: "table",
        color: "#FFB040",
      },
    ],
    keyTakeaway: "3NF ensures every attribute depends on the key, the whole key, and nothing but the key.",
  },
};

export async function POST(req: NextRequest) {
  try {
    const { subject, topic } = await req.json();
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

    const subKey = (subject || "physics").toLowerCase();
    const fallback = fallbackConceptVideos[subKey] || fallbackConceptVideos.physics;

    if (!apiKey) {
      return NextResponse.json({ video: fallback });
    }

    const prompt = `
      You are a 2D animation director for Ticha AI GCE concept visualizers.
      Generate a 4-scene 2D concept video breakdown for subject: "${subject}" and topic: "${topic}".

      INSTRUCTIONS:
      1. Create exactly 4 visual scenes for a 20-second 2D concept visualizer.
      2. Keep headlines and subtexts short, clear, and high-yield (max 1 sentence per scene).
      3. CRITICAL: Do NOT use markdown symbols (no ###, no ***, no **, no LaTeX like \\mathbb{N}). Use plain text!
      4. Assign visualType as one of: "particles", "wave", "graph", "table", "molecule".

      Return ONLY raw JSON matching this structure:
      {
        "id": "vid-${Date.now()}",
        "subject": "${subject}",
        "topic": "${topic}",
        "duration": 20,
        "scenes": [
          {
            "timestamp": "0:05",
            "headline": "Scene 1 Headline",
            "subtext": "Scene 1 short explanation.",
            "visualType": "particles",
            "color": "#B6FF00"
          }
        ],
        "keyTakeaway": "1-sentence core exam takeaway."
      }
    `;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "application/json" },
        }),
      }
    );

    if (!response.ok) {
      return NextResponse.json({ video: fallback });
    }

    const json = await response.json();
    const rawText = json.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) return NextResponse.json({ video: fallback });

    const parsed: ConceptVideoResponse = JSON.parse(rawText.trim());

    // Clean all strings using formatAIText
    const cleaned: ConceptVideoResponse = {
      ...parsed,
      topic: formatAIText(parsed.topic),
      keyTakeaway: formatAIText(parsed.keyTakeaway),
      scenes: parsed.scenes.map((s) => ({
        ...s,
        headline: formatAIText(s.headline),
        subtext: formatAIText(s.subtext),
      })),
    };

    return NextResponse.json({ video: cleaned });
  } catch (err) {
    console.error("Video API exception:", err);
    return NextResponse.json({ video: fallbackConceptVideos.physics });
  }
}
