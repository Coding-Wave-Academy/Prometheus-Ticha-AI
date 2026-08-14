import { NextRequest, NextResponse } from "next/server";
import { formatAIText } from "@/lib/formatAIText";

export const dynamic = "force-dynamic";

/* ------------------------------------------------------------------ */
/*  Canonical Subject Names & Struggle Key Normalizer                */
/* ------------------------------------------------------------------ */
const canonicalSubjectMap: Record<string, string> = {
  physics: "Physics",
  phys: "Physics",
  math: "Pure Mathematics",
  "pure math": "Pure Mathematics",
  "pure mathematics": "Pure Mathematics",
  "further math": "Further Mathematics",
  "further mathematics": "Further Mathematics",
  ict: "ICT",
  computing: "ICT",
  chemistry: "Chemistry",
  chem: "Chemistry",
  biology: "Biology",
  bio: "Biology",
  english: "English Language",
  french: "French Language",
};

function normalizeSubject(input: string): string {
  const key = input.trim().toLowerCase();
  return canonicalSubjectMap[key] || input.trim();
}

/* ------------------------------------------------------------------ */
/*  Subject-specific topic pools for YouTube searches                  */
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
    "Refraction & Snell's Law",
  ],
  "Pure Mathematics": [
    "Trigonometric Identities",
    "Differentiation from First Principles",
    "Integration by Substitution",
    "Quadratic Equations & Discriminant",
    "Logarithms & Exponential Functions",
    "Sequences & Series (AP and GP)",
    "Binomial Theorem",
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
    "Hyperbolic Functions",
  ],
  ICT: [
    "Database Normalization 1NF 2NF 3NF",
    "Network Topologies & Protocols",
    "SQL Queries SELECT INSERT UPDATE",
    "System Development Life Cycle",
    "Data Types & Validation",
    "Binary & Hexadecimal Number Systems",
    "Internet Security & Encryption",
    "Spreadsheet Functions & Formulas",
  ],
  Chemistry: [
    "Atomic Structure & Electron Configuration",
    "Covalent & Ionic Bonding",
    "Rates of Reaction & Collision Theory",
    "Organic Chemistry Alkanes & Alkenes",
    "Redox Reactions & Electrochemistry",
    "Mole Calculations & Stoichiometry",
    "Acids Bases & pH Scale",
    "Equilibrium & Le Chatelier's Principle",
  ],
  Biology: [
    "Cell Structure & Organelles",
    "DNA Replication & Protein Synthesis",
    "Photosynthesis Light Reactions",
    "Cellular Respiration & ATP",
    "Genetics & Punnett Squares",
    "Enzymes & Enzyme Kinetics",
    "Ecology & Food Chains",
    "Human Circulatory System",
  ],
};

/* ------------------------------------------------------------------ */
/*  Subject complement map for daily rotation                          */
/* ------------------------------------------------------------------ */
const subjectComplements: Record<string, string[]> = {
  Physics: ["Pure Mathematics", "Chemistry", "ICT"],
  "Pure Mathematics": ["Physics", "Further Mathematics", "Chemistry"],
  "Further Mathematics": ["Pure Mathematics", "Physics"],
  ICT: ["Pure Mathematics", "Physics"],
  Chemistry: ["Biology", "Physics", "Pure Mathematics"],
  Biology: ["Chemistry", "Physics"],
};

/* ------------------------------------------------------------------ */
/*  Determine today's subject using day-of-year rotation               */
/* ------------------------------------------------------------------ */
function getTodaySubject(normalizedStruggles: string[]): { todaySubject: string; yesterdaySubject: string | null } {
  const subjects = normalizedStruggles.length > 0
    ? normalizedStruggles
    : ["Physics", "Pure Mathematics", "ICT"];

  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((now.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));

  // Yesterday's index
  const yesterdayIdx = Math.abs((dayOfYear - 1) % subjects.length);
  const yesterdaySubject = subjects[yesterdayIdx] || null;

  // If yesterday's subject has complements in the student's struggles, pick one
  if (yesterdaySubject && subjectComplements[yesterdaySubject]) {
    const complements = subjectComplements[yesterdaySubject];
    const match = complements.find((c) => subjects.includes(c));
    if (match && match !== yesterdaySubject) {
      return { todaySubject: match, yesterdaySubject };
    }
  }

  // Fallback: simple day-of-year rotation through the student's struggles
  const todayIdx = Math.abs(dayOfYear % subjects.length);
  return { todaySubject: subjects[todayIdx], yesterdaySubject };
}

/* ------------------------------------------------------------------ */
/*  Pick a topic for a subject based on day of year                   */
/* ------------------------------------------------------------------ */
function pickTodayTopic(subject: string): string {
  const pool = subjectTopicPools[subject] || subjectTopicPools.Physics;
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
  const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=6&q=${encodeURIComponent(query)}&type=video&videoEmbeddable=true&key=${apiKey}`;

  try {
    const res = await fetch(searchUrl);
    if (!res.ok) return null;

    const data = await res.json();
    if (!data.items || data.items.length === 0) return null;

    // Extract video IDs and verify embeddability via Videos API
    const videoIds = data.items.map((item: any) => item.id.videoId).filter(Boolean);
    if (videoIds.length === 0) return null;

    const verifyUrl = `https://www.googleapis.com/youtube/v3/videos?part=status,snippet&id=${videoIds.join(",")}&key=${apiKey}`;
    const verifyRes = await fetch(verifyUrl);

    if (verifyRes.ok) {
      const verifyData = await verifyRes.json();
      if (verifyData.items && verifyData.items.length > 0) {
        // Find first item where status.embeddable is true and status.uploadStatus is processed
        const validItem = verifyData.items.find(
          (v: any) => v.status?.embeddable === true && (v.status?.uploadStatus === "processed" || !v.status?.uploadStatus)
        );
        if (validItem) {
          return {
            id: validItem.id,
            title: validItem.snippet.title,
            channelTitle: validItem.snippet.channelTitle,
          };
        }
      }
    }

    // Fallback to first search result if verify endpoint didn't filter
    const item = data.items[0];
    return {
      id: item.id.videoId,
      title: item.snippet.title,
      channelTitle: item.snippet.channelTitle,
    };
  } catch (err) {
    console.error("YouTube search & verify error:", err);
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
/*  Verified fallback YouTube IDs per subject                          */
/* ------------------------------------------------------------------ */
const fallbackYouTube: Record<string, { id: string; title: string; channel: string }> = {
  Physics: { id: "ZM8ECpBuQYE", title: "Newton's Laws of Motion", channel: "Khan Academy" },
  "Pure Mathematics": { id: "riXcZT2ICjA", title: "Introduction to Limits", channel: "Khan Academy" },
  ICT: { id: "UrYLYV7WSHM", title: "Database Normalization", channel: "Decomplexify" },
  Chemistry: { id: "xuPl_8wv9xo", title: "Atomic Structure", channel: "Professor Dave Explains" },
  Biology: { id: "URUJD5NEXC8", title: "Cell Structure", channel: "Amoeba Sisters" },
  "Further Mathematics": { id: "sW9npfMcMEI", title: "Complex Numbers", channel: "3Blue1Brown" },
};

/* ------------------------------------------------------------------ */
/*  POST handler                                                       */
/* ------------------------------------------------------------------ */
export async function POST(req: NextRequest) {
  try {
    const { struggles, education } = await req.json();
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

    const rawStruggles = Array.isArray(struggles) && struggles.length > 0
      ? struggles
      : ["physics", "math", "ict"];

    // Normalize input struggle keys (e.g. "math" -> "Pure Mathematics")
    const normalizedStruggles = Array.from(
      new Set(rawStruggles.map((s: string) => normalizeSubject(s)))
    );

    // 1. Determine today's single subject using complementary rotation
    const { todaySubject } = getTodaySubject(normalizedStruggles);
    const todayTopic = pickTodayTopic(todaySubject);

    // 2. Search & verify YouTube for a real embeddable video
    const ytResult = await searchYouTubeVideo(todaySubject, todayTopic);
    const fallback = fallbackYouTube[todaySubject] || fallbackYouTube.Physics;
    const youtubeId = ytResult?.id || fallback.id;
    const youtubeTitle = ytResult?.title || fallback.title;
    const youtubeChannel = ytResult?.channelTitle || fallback.channel;

    // 3. Generate lesson content with Gemini
    if (!apiKey) {
      return NextResponse.json({
        lesson: buildFallbackLesson(todaySubject, todayTopic, youtubeId, youtubeTitle, youtubeChannel),
      });
    }

    const prompt = `
You are Madame Ticha, a Cameroonian GCE exam preparation specialist.
Generate a daily lesson for subject: "${todaySubject}", topic: "${todayTopic}".
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
  "pastPaperHint": "Look for ${todaySubject} past paper questions about ${todayTopic} in your GCE revision pack."
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
        lesson: buildFallbackLesson(todaySubject, todayTopic, youtubeId, youtubeTitle, youtubeChannel),
      });
    }

    const json = await response.json();
    const rawText = json.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) {
      return NextResponse.json({
        lesson: buildFallbackLesson(todaySubject, todayTopic, youtubeId, youtubeTitle, youtubeChannel),
      });
    }

    const parsed = JSON.parse(rawText.trim());

    const lesson: DailyLessonV2 = {
      id: `lesson-${Date.now()}`,
      subject: todaySubject,
      topic: todayTopic,
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
      pastPaperHint: formatAIText(parsed.pastPaperHint || `Practice ${todayTopic} questions from your GCE past papers.`),
    };

    return NextResponse.json({ lesson });
  } catch (err) {
    console.error("Daily lesson V2 generation error:", err);
    return NextResponse.json({
      lesson: buildFallbackLesson("Physics", "Newton's Laws of Motion", "ZM8ECpBuQYE", "Newton's Laws of Motion", "Khan Academy"),
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
