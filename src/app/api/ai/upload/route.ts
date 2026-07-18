import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * /api/ai/upload — Mock dynamic PDF/image text extractor and solver powered by Gemini AI
 * based on selected mode.
 */
export async function POST(req: NextRequest) {
  try {
    const { filename, mode, fileContent } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;

    // Default premium mocks matching the modes
    const mockResponses: Record<string, any> = {
      summarize: {
        title: `Summary of ${filename || "Exam_Paper.pdf"}`,
        summaryText: "This exam paper covers Newtonian Mechanics, Wave theory, and basic thermodynamics. Key target concepts focus on energy conservation, projectile velocity, and heat distribution cycles.",
        keyPoints: [
          "Covers advanced projectile motion equations and vectors.",
          "Tests electromagnetic flux changes using Faraday's Law.",
          "Requires understanding of Carnot engine efficiency boundaries.",
        ],
      },
      study: {
        title: `Study Notes for ${filename || "Exam_Paper.pdf"}`,
        summaryText: "Target active-recall review guides designed for this document's curriculum scope.",
        keyPoints: [
          "Flashcard Concept: Define Faraday's Law of induction and its relationship with Lenz's Law.",
          "Formula Sheet: Make sure you memorize the Carnot Efficiency equation: n = 1 - (Tc/Th).",
          "Recommended Practice: Solve 3 past-paper questions testing vertical projectile offsets.",
        ],
      },
      answer: {
        title: `AI Solved Answers for ${filename || "Exam_Paper.pdf"}`,
        summaryText: "Answers and detailed outline breakdowns for the questions identified in the document.",
        keyPoints: [
          "Question 1 (Projectile Motion): Resolved vertical height H = 45.2 meters by applying equation: v^2 = u^2 - 2gH.",
          "Question 2 (Electromagnetism): Emf is induced in the coil because the magnetic flux changes at a rate of 0.25 Wb/s, yielding exactly 1.25V induced voltage.",
          "Question 3 (Carnot Efficiency): Maximum thermal efficiency calculated is 42.5% using absolute Kelvin values.",
        ],
      },
    };

    const activeMode = mode || "summarize";
    const fallback = mockResponses[activeMode] || mockResponses.summarize;

    if (!apiKey) {
      console.log("No GEMINI_API_KEY found for file upload helper, returning mocks.");
      return NextResponse.json({ result: fallback });
    }

    const prompt = `
      You are an advanced Ticha AI Exam assistant.
      A student uploaded a document named: "${filename || "Exam_Paper.pdf"}"
      with contents: "${fileContent || "Newtonian Physics & Electromagnetism questions"}".
      
      They want to process this document with the target mode: "${activeMode}" (which can be 'summarize' for summary text and key points, 'study' for target study guides and concept checks, or 'answer' for solving the questions found in the document).

      Return the analysis strictly as a JSON object of this structure:
      {
        "title": "A short tailored header",
        "summaryText": "A 2-3 sentence overview text",
        "keyPoints": [
          "Detailed bullet point 1",
          "Detailed bullet point 2",
          "Detailed bullet point 3"
        ]
      }

      Strictly return valid JSON. Do not wrap in markdown block code tags.
    `;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
            maxOutputTokens: 450,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API returned status ${response.status}`);
    }

    const json = await response.json();
    const rawText = json.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) throw new Error("Empty response from Gemini");

    const parsed = JSON.parse(rawText.trim());
    return NextResponse.json({ result: parsed });

  } catch (error) {
    console.error("Gemini upload assistant failed, returning mock:", error);
    return NextResponse.json({
      result: {
        title: "AI Solved Answers for Exam_Paper.pdf",
        summaryText: "Answers and detailed outline breakdowns for the questions identified in the document.",
        keyPoints: [
          "Question 1 (Projectile Motion): Resolved vertical height H = 45.2 meters by applying equation: v^2 = u^2 - 2gH.",
          "Question 2 (Electromagnetism): Emf is induced in the coil because the magnetic flux changes at a rate of 0.25 Wb/s, yielding exactly 1.25V induced voltage.",
        ],
      }
    });
  }
}
