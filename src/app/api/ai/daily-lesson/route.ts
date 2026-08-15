import { NextRequest, NextResponse } from "next/server";
import { formatAIText } from "@/lib/formatAIText";
import {
  findVideoForTopic,
  normalizeSubjectName,
  verifyYouTubeVideo,
  GCE_VIDEO_CATALOG,
} from "@/lib/videoCatalog";

export const dynamic = "force-dynamic";

/* ── Subject-specific topic pools for daily rotation ─────────────────── */
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

/* ── Fair daily subject rotation ──────────────────────────────────────── */
function getTodaySubject(normalizedStruggles: string[]): string {
  const subjects =
    normalizedStruggles.length > 0
      ? normalizedStruggles
      : ["Physics", "Pure Mathematics", "ICT"];

  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor(
    (now.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)
  );

  return subjects[Math.abs(dayOfYear % subjects.length)];
}

/* ── Pick a topic for a subject based on day of year ──────────────────── */
function pickTodayTopic(subject: string): string {
  const pool = subjectTopicPools[subject] ||
    subjectTopicPools.Physics || ["Introduction to Core Concepts"];
  const now = new Date();
  const dayOfYear = Math.floor(
    (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) /
      (1000 * 60 * 60 * 24)
  );
  return pool[Math.abs(dayOfYear % pool.length)];
}

/* ── Resolve & verify video with cascading fallback ───────────────────── */
async function resolveVerifiedVideo(
  subject: string,
  topic: string,
  geminiSearchQuery?: string
): Promise<{ id: string; title: string; channel: string }> {
  const apiKey = process.env.YOUTUBE_API_KEY;

  // Step 1: If Gemini gave us a search query, try YouTube Data API
  if (geminiSearchQuery && apiKey) {
    try {
      const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=3&q=${encodeURIComponent(
        geminiSearchQuery
      )}&type=video&videoEmbeddable=true&key=${apiKey}`;

      const res = await fetch(searchUrl, {
        headers: { Referer: "https://prometheus-ticha-ai.vercel.app/" },
        signal: AbortSignal.timeout(5000),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.items?.length > 0) {
          for (const item of data.items) {
            const videoId = item.id?.videoId;
            if (!videoId) continue;

            const check = await verifyYouTubeVideo(videoId);
            if (check?.available) {
              return {
                id: videoId,
                title: check.title || item.snippet?.title || topic,
                channel: item.snippet?.channelTitle || "YouTube",
              };
            }
          }
        }
      }
    } catch {
      // Fall through to catalog
    }
  }

  // Step 2: Use catalog match and verify it
  const catalogVideo = findVideoForTopic(subject, topic);
  const check = await verifyYouTubeVideo(catalogVideo.id);
  if (check?.available) {
    return {
      id: catalogVideo.id,
      title: check.title || catalogVideo.title,
      channel: catalogVideo.channelTitle,
    };
  }

  // Step 3: Try all videos in the subject pool
  const subjectPool = GCE_VIDEO_CATALOG.filter(
    (v) => v.subject.toLowerCase() === normalizeSubjectName(subject).toLowerCase()
  );
  for (const video of subjectPool) {
    if (video.id === catalogVideo.id) continue; // Already tried
    const fallbackCheck = await verifyYouTubeVideo(video.id);
    if (fallbackCheck?.available) {
      return {
        id: video.id,
        title: fallbackCheck.title || video.title,
        channel: video.channelTitle,
      };
    }
  }

  // Step 4: Absolute last resort — return catalog video unverified
  // (better to show a video that might work than nothing)
  return {
    id: catalogVideo.id,
    title: catalogVideo.title,
    channel: catalogVideo.channelTitle,
  };
}

/* ── Lesson shape returned to client ──────────────────────────────────── */
export interface DailyLessonV2 {
  id: string;
  subject: string;
  topic: string;
  youtubeId: string;
  youtubeTitle: string;
  youtubeChannel: string;
  youtubeSearchUrl: string;
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

/* ── POST handler ─────────────────────────────────────────────────────── */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const {
      struggles,
      education,
      subject: explicitSubject,
      topic: explicitTopic,
    } = body;
    const apiKey =
      process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

    const rawStruggles =
      Array.isArray(struggles) && struggles.length > 0
        ? struggles
        : ["physics", "math", "ict"];

    const normalizedStruggles = Array.from(
      new Set(rawStruggles.map((s: string) => normalizeSubjectName(s)))
    );

    // 1. Determine subject & topic
    let targetSubject = explicitSubject
      ? normalizeSubjectName(explicitSubject)
      : getTodaySubject(normalizedStruggles);

    let targetTopic = explicitTopic
      ? String(explicitTopic).trim()
      : pickTodayTopic(targetSubject);

    // 2. Build YouTube search URL for fallback link
    const ytSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
      `${targetTopic} ${targetSubject} GCE A-Level tutorial`
    )}`;

    // 3. If no Gemini key, return fallback lesson with catalog video
    if (!apiKey) {
      const video = await resolveVerifiedVideo(targetSubject, targetTopic);
      return NextResponse.json({
        lesson: buildFallbackLesson(
          targetSubject,
          targetTopic,
          video.id,
          video.title,
          video.channel,
          ytSearchUrl
        ),
      });
    }

    // 4. Ask Gemini to generate lesson content AND a YouTube search query
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
  "youtubeSearchQuery": "An optimized YouTube search query to find the BEST educational tutorial video for this exact topic. Be very specific. Example: 'binomial theorem expansion examples A level maths tutorial'",
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
      const video = await resolveVerifiedVideo(targetSubject, targetTopic);
      return NextResponse.json({
        lesson: buildFallbackLesson(
          targetSubject,
          targetTopic,
          video.id,
          video.title,
          video.channel,
          ytSearchUrl
        ),
      });
    }

    const json = await response.json();
    const rawText = json.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) {
      const video = await resolveVerifiedVideo(targetSubject, targetTopic);
      return NextResponse.json({
        lesson: buildFallbackLesson(
          targetSubject,
          targetTopic,
          video.id,
          video.title,
          video.channel,
          ytSearchUrl
        ),
      });
    }

    const parsed = JSON.parse(rawText.trim());

    // 5. Resolve video using Gemini's search query, then catalog fallback
    const geminiQuery = parsed.youtubeSearchQuery || "";
    const video = await resolveVerifiedVideo(
      targetSubject,
      targetTopic,
      geminiQuery
    );

    const lesson: DailyLessonV2 = {
      id: `lesson-${Date.now()}`,
      subject: targetSubject,
      topic: targetTopic,
      youtubeId: video.id,
      youtubeTitle: formatAIText(video.title),
      youtubeChannel: video.channel,
      youtubeSearchUrl: ytSearchUrl,
      tips: Array.isArray(parsed.tips)
        ? parsed.tips.map((t: string) => formatAIText(t))
        : [],
      keyTakeaway: formatAIText(parsed.keyTakeaway || ""),
      quizQuestions: Array.isArray(parsed.quizQuestions)
        ? parsed.quizQuestions.slice(0, 3).map((q: any) => ({
            question: formatAIText(q.question),
            options: Array.isArray(q.options)
              ? q.options.map((o: string) => formatAIText(o))
              : [],
            correctIdx: typeof q.correctIdx === "number" ? q.correctIdx : 0,
            explanation: formatAIText(q.explanation || ""),
          }))
        : [],
      pastPaperHint: formatAIText(
        parsed.pastPaperHint ||
          `Practice ${targetTopic} questions from your GCE past papers.`
      ),
    };

    return NextResponse.json({ lesson });
  } catch (err) {
    console.error("Daily lesson V2 generation error:", err);
    const cat = findVideoForTopic("Physics", "Newton's Laws of Motion");
    const ytSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
      "Newton's Laws of Motion Physics GCE A-Level tutorial"
    )}`;
    return NextResponse.json({
      lesson: buildFallbackLesson(
        "Physics",
        "Newton's Laws of Motion",
        cat.id,
        cat.title,
        cat.channelTitle,
        ytSearchUrl
      ),
    });
  }
}

function buildFallbackLesson(
  subject: string,
  topic: string,
  youtubeId: string,
  youtubeTitle: string,
  youtubeChannel: string,
  youtubeSearchUrl: string
): DailyLessonV2 {
  return {
    id: `lesson-fallback-${Date.now()}`,
    subject,
    topic,
    youtubeId,
    youtubeTitle,
    youtubeChannel,
    youtubeSearchUrl,
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
        options: [
          "Skip it",
          "Watch a video and take notes",
          "Guess the answers",
          "Sleep on it",
        ],
        correctIdx: 1,
        explanation:
          "Active learning through videos and note-taking helps retain information.",
      },
      {
        question: "Where should you practice exam-style questions?",
        options: [
          "Social media",
          "GCE past papers",
          "Random websites",
          "Only in class",
        ],
        correctIdx: 1,
        explanation:
          "Past papers give you real exam practice and build confidence.",
      },
    ],
    pastPaperHint: `Search for ${subject} GCE past paper questions about ${topic}.`,
  };
}
