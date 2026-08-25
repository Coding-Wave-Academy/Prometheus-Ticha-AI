import { normalizeSubjectName } from "./videoCatalog";

/* ── Subject-specific topic pools for daily rotation ─────────────────── */
export const SUBJECT_TOPIC_POOLS: Record<string, string[]> = {
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
  "English Language": [
    "Essay Structure & Coherence",
    "Comprehension & Summary Writing",
    "Grammar & Syntax Rules",
  ],
  "French Language": [
    "Grammar & Verb Conjugations",
    "Expression Écrite & Vocabulaire",
    "Compréhension de Texte",
  ],
};

export const DEFAULT_STRUGGLES = ["Physics", "Pure Mathematics", "ICT"];

export function getTodayDateString(d: Date = new Date()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getDayOfYear(d: Date = new Date()): number {
  const startOfYear = new Date(d.getFullYear(), 0, 0);
  const diff = d.getTime() - startOfYear.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function getTodaySubject(
  rawStruggles: string[] = [],
  date: Date = new Date()
): string {
  const normalized = Array.from(
    new Set(
      (rawStruggles.length > 0 ? rawStruggles : DEFAULT_STRUGGLES).map((s) =>
        normalizeSubjectName(s)
      )
    )
  ).filter(Boolean);

  const pool = normalized.length > 0 ? normalized : DEFAULT_STRUGGLES;
  const dayOfYear = getDayOfYear(date);
  return pool[Math.abs(dayOfYear % pool.length)];
}

export function getTodayTopic(
  subject: string,
  date: Date = new Date()
): string {
  const normSub = normalizeSubjectName(subject);
  const pool =
    SUBJECT_TOPIC_POOLS[normSub] ||
    SUBJECT_TOPIC_POOLS.Physics ||
    ["Introduction to Core Concepts"];

  const dayOfYear = getDayOfYear(date);
  return pool[Math.abs(dayOfYear % pool.length)];
}

export function getTodayLessonTopic(
  rawStruggles: string[] = [],
  date: Date = new Date()
): { subject: string; topic: string } {
  const subject = getTodaySubject(rawStruggles, date);
  const topic = getTodayTopic(subject, date);
  return { subject, topic };
}

export interface StoredDailyTopicPayload {
  date: string;
  subject: string;
  topic: string;
}

export function getStoredDailyTopic(): { subject: string; topic: string } | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem("ticha_today_lesson_topic");
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    const todayStr = getTodayDateString();

    // If date is present and matches today, return stored topic
    if (parsed && parsed.subject && parsed.topic) {
      if (parsed.date && parsed.date !== todayStr) {
        // Expired date from previous day
        return null;
      }
      return { subject: parsed.subject, topic: parsed.topic };
    }
  } catch {
    // Ignore parse errors
  }

  return null;
}

export function setStoredDailyTopic(subject: string, topic: string): void {
  if (typeof window === "undefined") return;

  try {
    const payload: StoredDailyTopicPayload = {
      date: getTodayDateString(),
      subject,
      topic,
    };
    localStorage.setItem("ticha_today_lesson_topic", JSON.stringify(payload));
  } catch {
    // Ignore storage quota/errors
  }
}
