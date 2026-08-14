import { NextRequest, NextResponse } from "next/server";
import { formatAIText } from "@/lib/formatAIText";
import { findVideoForTopic, normalizeSubjectName } from "@/lib/videoCatalog";

export const dynamic = "force-dynamic";

/* ------------------------------------------------------------------ */
/*  Subject-specific topic pools for daily rotation                    */
/* ------------------------------------------------------------------ */
const subjectTopicPools: Record<string, string[]> = {
  Physics: [
    "Newton's Laws of Motion",
    "Electromagnetic Induction",
    "Wave-Particle Duality",
    "Projectile Motion",
    "Conservation of Energy",
    "Electric Circuits & Kirchhoff's Laws",
    "Simple Harmonic Motion",
    "Gravitational Fields",
    "Nuclear Physics & Radioactivity",
  ],
  "Pure Mathematics": [
    "Binomial Theorem",
    "Trigonometric Identities",
    "Differentiation from First Principles",
    "Integration by Substitution",
    "Quadratic Equations & Discriminant",
    "Logarithms & Exponential Functions",
    "Sequences & Series (AP and GP)",
    "Coordinate Geometry of Circles",
    "Vectors in 2D and 3D",
    "Partial Fractions",
  ],
  "Further Mathematics": [
    "Complex Numbers & Argand Diagrams",
    "Matrix Transformations",
    "Proof by Induction",
    "Polar Coordinates",
    "Differential Equations",
  ],
  ICT: [
    "Database Normalization 1NF 2NF 3NF",
    "Network Topologies & Protocols",
    "SQL Queries SELECT INSERT UPDATE",
    "System Development Life Cycle",
    "Binary & Hexadecimal Number Systems",
  ],
  Chemistry: [
    "Atomic Structure & Electron Configuration",
    "Rates of Reaction & Collision Theory",
    "Equilibrium & Le Chatelier's Principle",
  ],
  Biology: [
    "Cell Structure & Organelles",
    "DNA Replication & Protein Synthesis",
  ],
};

/* ------------------------------------------------------------------ */
/*  Determine today's subject using fair, balanced daily rotation     */
/* ------------------------------------------------------------------ */
function getTodaySubject(normalizedStruggles: string[]): { todaySubject: string; yesterdaySubject: string | null } {
  const subjects = normalizedStruggles.length > 0
    ? normalizedStruggles
    : ["Physics", "Pure Mathematics", "ICT"];

  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((now.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));

  const todayIdx = Math.abs(dayOfYear % subjects.length);
  const yesterdayIdx = Math.abs((dayOfYear - 1 + subjects.length) % subjects.length);

  return {
    todaySubject: subjects[todayIdx],
    yesterdaySubject: subjects[yesterdayIdx] || null,
  };
}

/* ------------------------------------------------------------------ */
/*  Pick a topic for a subject based on day of year                   */
/* ------------------------------------------------------------------ */
function pickTodayTopic(subject: string): string {
  const pool = subjectTopicPools[subject] || subjectTopicPools.Physics || [
    "Introduction to Core Concepts",
  ];
  const now = new Date();
  const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  return pool[Math.abs(dayOfYear % pool.length)];
}

/* ------------------------------------------------------------------ */
/*  Search & Verify Embeddable YouTube Video                          */
/* ------------------------------------------------------------------ */
async function searchYouTubeVideo(subject: string, topic: string): Promise<{ id: string; title: string; channelTitle: string } | null> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) return null;

  const query = `${topic} ${subject} GCE A-Level explainer tutorial`;
  const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=${encodeURIComponent(query)}&type=video&videoEmbeddable=true&key=${apiKey}`;

  try {
    const res = await fetch(searchUrl, {
      headers: {
        Referer: "https://prometheus-ticha-ai.vercel.app/",
      },
    });
    if (!res.ok) return null;

    const data = await res.json();
    if (!data.items || data.items.length === 0) return null;

    const item = data.items[0];
    if (!item?.id?.videoId) return null;

    return {
      id: item.id.videoId,
      title: item.snippet.title,
      channelTitle: item.snippet.channelTitle,
    };
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------ */
/*  Lesson shape returned to client                                    */
/* ------------------------------------------------------------------ */
export interface DailyLessonV2 {
  id: string;
  subject: string;
  topic: string;
  youtubeId: string;
  youtubeTitle: string;
  youtubeChannel: string;
  tips: string[];
  keyTakeaway: string;
  quizQuestions: {
    question: string;
    options: string[];
    correctIdx: number;
    explanation: string;
  }[];
  pastPaperHint: string;
}

/* ------------------------------------------------------------------ */
/*  POST handler                                                       */
/* ------------------------------------------------------------------ */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { struggles, education, subject: explicitSubject, topic: explicitTopic } = body;
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

    let rawStruggles = Array.isArray(struggles) && struggles.length > 0
      ? struggles
      : ["physics", "math", "ict"];

    // Normalize input struggle keys (e.g. "math" -> "Pure Mathematics")
    const normalizedStruggles = Array.from(
      new Set(rawStruggles.map((s: string) => normalizeSubjectName(s)))
    );

    // 1. Determine subject & topic: if explicit target provided, prioritize it
    let targetSubject = explicitSubject ? normalizeSubjectName(explicitSubject) : null;
    let targetTopic = explicitTopic ? String(explicitTopic).trim() : null;

    if (!targetSubject) {
      const { todaySubject } = getTodaySubject(normalizedStruggles);
      targetSubject = todaySubject;
    }

    if (!targetTopic) {
      targetTopic = pickTodayTopic(targetSubject);
    }

    // 2. Resolve exact topic video using verified catalog with live API enhancement
    const catalogVideo = findVideoForTopic(targetSubject, targetTopic);
    const ytResult = await searchYouTubeVideo(targetSubject, targetTopic);

    const youtubeId = ytResult?.id || catalogVideo.id;
    const youtubeTitle = ytResult?.title || catalogVideo.title;
    const youtubeChannel = ytResult?.channelTitle || catalogVideo.channelTitle;

    // 3. Generate lesson content with Gemini
    if (!apiKey) {
      return NextResponse.json({
        lesson: buildFallbackLesson(targetSubject, targetTopic, youtubeId, youtubeTitle, youtubeChannel),
      });
    }

    const prompt = `
You are Madame Ticha, a Cameroonian GCE exam preparation specialist.
Generate a daily lesson for subject: "${targetSubject}", topic: "${targetTopic}".
Student level: "${education || "al"}".

CRITICAL FORMAT RULES:
- Do NOT use markdown (no ###, no **, no ***, no backticks).
- Do NOT use LaTeX (no \\mathbb, no \\frac, no $...$).
- Write in plain text only. Use simple everyday words a young student understands.
- Keep each tip extremely expressive, engaging, and directly focused on the lesson learnt (max 15-20 words). Act like a passionate teacher.

Return ONLY raw JSON matching this exact structure:
{
  "tips": [
    "Tip 1 about the concept.",
    "Tip 2 about the concept.",
    "Tip 3 about the concept."
  ],
  "keyTakeaway": "One clear sentence summarizing the core exam concept.",
  "quizQuestions": [
    {
      "question": "Clear question about the topic?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIdx": 1,
      "explanation": "Short 1-sentence explanation of why this is correct."
    },
    {
      "question": "Second question about the topic?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIdx": 0,
      "explanation": "Short 1-sentence explanation."
    },
    {
      "question": "Third question about the topic?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIdx": 2,
      "explanation": "Short 1-sentence explanation."
    }
  ],
  "pastPaperHint": "Look for ${targetSubject} past paper questions about ${targetTopic} in your GCE revision pack."
}`;

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
      return NextResponse.json({
        lesson: buildFallbackLesson(targetSubject, targetTopic, youtubeId, youtubeTitle, youtubeChannel),
      });
    }

    const json = await response.json();
    const rawText = json.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) {
      return NextResponse.json({
        lesson: buildFallbackLesson(targetSubject, targetTopic, youtubeId, youtubeTitle, youtubeChannel),
      });
    }

    const parsed = JSON.parse(rawText.trim());

    const lesson: DailyLessonV2 = {
      id: `lesson-${Date.now()}`,
      subject: targetSubject,
      topic: targetTopic,
      youtubeId,
      youtubeTitle: formatAIText(youtubeTitle),
      youtubeChannel,
      tips: Array.isArray(parsed.tips) ? parsed.tips.map((t: string) => formatAIText(t)) : [],
      keyTakeaway: formatAIText(parsed.keyTakeaway || ""),
      quizQuestions: Array.isArray(parsed.quizQuestions)
        ? parsed.quizQuestions.slice(0, 3).map((q: any) => ({
            question: formatAIText(q.question),
            options: Array.isArray(q.options) ? q.options.map((o: string) => formatAIText(o)) : [],
            correctIdx: typeof q.correctIdx === "number" ? q.correctIdx : 0,
            explanation: formatAIText(q.explanation || ""),
          }))
        : [],
      pastPaperHint: formatAIText(parsed.pastPaperHint || `Practice ${targetTopic} questions from your GCE past papers.`),
    };

    return NextResponse.json({ lesson });
  } catch (err) {
    console.error("Daily lesson V2 generation error:", err);
    const cat = findVideoForTopic("Physics", "Newton's Laws of Motion");
    return NextResponse.json({
      lesson: buildFallbackLesson("Physics", "Newton's Laws of Motion", cat.id, cat.title, cat.channelTitle),
    });
  }
}

function buildFallbackLesson(
  subject: string,
  topic: string,
  youtubeId: string,
  youtubeTitle: string,
  youtubeChannel: string
): DailyLessonV2 {
  return {
    id: `lesson-fallback-${Date.now()}`,
    subject,
    topic,
    youtubeId,
    youtubeTitle,
    youtubeChannel,
    tips: [
      `${topic} is a key exam topic. Watch the video carefully.`,
      "Pause the video and take notes on definitions.",
      "Try to explain the concept in your own words after watching.",
    ],
    keyTakeaway: `Understanding ${topic} is essential for scoring well in ${subject}.`,
    quizQuestions: [
      {
        question: `Which subject area does ${topic} belong to?`,
        options: [subject, "Geography", "History", "Art"],
        correctIdx: 0,
        explanation: `${topic} is a core topic in ${subject}.`,
      },
      {
        question: "What is the best way to revise a new concept?",
        options: ["Skip it", "Watch a video and take notes", "Guess the answers", "Sleep on it"],
        correctIdx: 1,
        explanation: "Active learning through videos and note-taking helps retain information.",
      },
      {
        question: "Where should you practice exam-style questions?",
        options: ["Social media", "GCE past papers", "Random websites", "Only in class"],
        correctIdx: 1,
        explanation: "Past papers give you real exam practice and build confidence.",
      },
    ],
    pastPaperHint: `Search for ${subject} GCE past paper questions about ${topic}.`,
  };
}
