/**
 * videoCatalog.ts — Verified GCE Video Catalog with oEmbed Availability Checking
 *
 * Architecture:
 * 1. A curated fallback catalog of oEmbed-verified YouTube video IDs (verified 2026-08-15).
 * 2. An async `verifyYouTubeVideo()` that checks availability via YouTube's oEmbed endpoint.
 * 3. Gemini AI selects the best video search query; this catalog serves as resilient fallback.
 */

export interface VideoCatalogItem {
  id: string;
  title: string;
  channelTitle: string;
  topic: string;
  subject: string;
  keywords: string[];
}

/**
 * All IDs verified via oEmbed on 2026-08-15. Only verified-embeddable videos are included.
 */
export const GCE_VIDEO_CATALOG: VideoCatalogItem[] = [
  /* ── Pure Mathematics ──────────────────────────────────────────────── */
  {
    id: "riXcZT2ICjA",
    title: "Introduction to Limits",
    channelTitle: "Khan Academy",
    topic: "Limits & First Principles",
    subject: "Pure Mathematics",
    keywords: ["limits", "first principles", "calculus", "derivatives", "slope", "rate of change"],
  },
  {
    id: "ANyVpMS3HL4",
    title: "Derivative as Slope of a Tangent Line",
    channelTitle: "Khan Academy",
    topic: "Differentiation from First Principles",
    subject: "Pure Mathematics",
    keywords: ["differentiation", "first principles", "derivative", "dy/dx", "tangent", "gradient"],
  },
  {
    id: "rfG8ce4nNh0",
    title: "Integration and the Fundamental Theorem of Calculus",
    channelTitle: "3Blue1Brown",
    topic: "Integration by Substitution",
    subject: "Pure Mathematics",
    keywords: ["integration", "substitution", "integral", "calculus", "area under curve"],
  },
  {
    id: "IlNAJl36-10",
    title: "How To Solve Quadratic Equations Using The Quadratic Formula",
    channelTitle: "The Organic Chemistry Tutor",
    topic: "Quadratic Equations & Discriminant",
    subject: "Pure Mathematics",
    keywords: ["quadratic", "discriminant", "roots", "completing the square", "parabola", "algebra"],
  },
  {
    id: "mQTWzLpCcW0",
    title: "Introduction to Logarithms",
    channelTitle: "Khan Academy",
    topic: "Logarithms & Exponential Functions",
    subject: "Pure Mathematics",
    keywords: ["logarithms", "logs", "exponentials", "natural log", "ln", "e", "powers"],
  },
  {
    id: "mhd9FXYdf4s",
    title: "Trigonometry Concepts - Don't Memorize! Visualize!",
    channelTitle: "Dennis Davis",
    topic: "Trigonometric Identities",
    subject: "Pure Mathematics",
    keywords: ["trig", "trigonometric", "identities", "sine", "cosine", "tangent", "double angle", "compound"],
  },
  {
    id: "Tj89FA-d0f8",
    title: "Sequences and Series (Arithmetic & Geometric) Quick Review",
    channelTitle: "Mario's Math Tutoring",
    topic: "Sequences & Series (AP and GP)",
    subject: "Pure Mathematics",
    keywords: ["sequences", "series", "ap", "gp", "arithmetic", "geometric", "progression", "sum"],
  },
  {
    id: "fNk_zzaMoSs",
    title: "Vectors - Essence of Linear Algebra",
    channelTitle: "3Blue1Brown",
    topic: "Vectors in 2D and 3D",
    subject: "Pure Mathematics",
    keywords: ["vectors", "2d", "3d", "dot product", "scalar product", "magnitude", "coordinate geometry", "circles"],
  },
  {
    id: "HZTv4zCgEnA",
    title: "Partial Fraction Decomposition",
    channelTitle: "PatrickJMT",
    topic: "Partial Fractions",
    subject: "Pure Mathematics",
    keywords: ["partial fractions", "linear factors", "repeated factors", "quadratic factors", "algebra"],
  },
  {
    id: "WWv0RUxDfbs",
    title: "Binomial Distribution",
    channelTitle: "Khan Academy",
    topic: "Binomial Theorem",
    subject: "Pure Mathematics",
    keywords: ["binomial", "theorem", "expansion", "pascal", "combinations", "ncr", "powers"],
  },

  /* ── Physics ───────────────────────────────────────────────────────── */
  {
    id: "ZM8ECpBuQYE",
    title: "Motion in a Straight Line: Crash Course Physics #1",
    channelTitle: "CrashCourse",
    topic: "Newton's Laws of Motion",
    subject: "Physics",
    keywords: ["newton", "laws of motion", "force", "mass", "acceleration", "inertia", "mechanics"],
  },
  {
    id: "nGQbA2jwkWI",
    title: "Electromagnetic Induction, Faraday's Law, Lenz Law",
    channelTitle: "MIT OpenCourseWare",
    topic: "Electromagnetic Induction",
    subject: "Physics",
    keywords: ["electromagnetic", "induction", "faraday", "lenz", "magnetic flux", "emf", "current"],
  },
  {
    id: "v-1zjdUTu0o",
    title: "Photoelectric Effect Demonstration",
    channelTitle: "UNSW Physics",
    topic: "Wave-Particle Duality",
    subject: "Physics",
    keywords: ["wave", "particle", "duality", "photoelectric", "photon", "quantum", "de broglie"],
  },
  {
    id: "aY8z2qO44WA",
    title: "Kinematics Part 3: Projectile Motion",
    channelTitle: "Professor Dave Explains",
    topic: "Projectile Motion",
    subject: "Physics",
    keywords: ["projectile", "motion", "kinematics", "trajectory", "velocity", "gravity", "range"],
  },
  {
    id: "w4QFJb9a8vo",
    title: "Work, Energy, and Power: Crash Course Physics #9",
    channelTitle: "CrashCourse",
    topic: "Conservation of Energy",
    subject: "Physics",
    keywords: ["conservation of energy", "work", "kinetic", "potential", "power", "efficiency"],
  },
  {
    id: "F_vLWkkOETI",
    title: "Introduction to Circuits and Ohm's Law",
    channelTitle: "Khan Academy",
    topic: "Electric Circuits & Kirchhoff's Laws",
    subject: "Physics",
    keywords: ["circuits", "kirchhoff", "resistors", "ohm", "voltage", "current", "potential divider"],
  },
  {
    id: "jxstE6A_CYQ",
    title: "Simple Harmonic Motion: Crash Course Physics #16",
    channelTitle: "CrashCourse",
    topic: "Simple Harmonic Motion",
    subject: "Physics",
    keywords: ["simple harmonic motion", "shm", "oscillations", "pendulum", "frequency", "amplitude"],
  },
  {
    id: "7gf6YpdvtE0",
    title: "Newtonian Gravity: Crash Course Physics #8",
    channelTitle: "CrashCourse",
    topic: "Gravitational Fields",
    subject: "Physics",
    keywords: ["gravitational", "fields", "gravity", "orbit", "potential", "escape velocity"],
  },
  {
    id: "KWAsz59F8gA",
    title: "Nuclear Chemistry: Crash Course Chemistry #38",
    channelTitle: "CrashCourse",
    topic: "Nuclear Physics & Radioactivity",
    subject: "Physics",
    keywords: ["nuclear", "radioactivity", "alpha", "beta", "gamma", "half-life", "decay", "binding energy"],
  },

  /* ── ICT & Computing ───────────────────────────────────────────────── */
  {
    id: "UrYLYV7WSHM",
    title: "Normalization - 1NF, 2NF, 3NF and 4NF",
    channelTitle: "Decomplexify",
    topic: "Database Normalization 1NF 2NF 3NF",
    subject: "ICT",
    keywords: ["database", "normalization", "1nf", "2nf", "3nf", "primary key", "foreign key", "sql"],
  },
  {
    id: "H8W9oMNSuwo",
    title: "Network Devices Explained",
    channelTitle: "Jeremy's IT Lab",
    topic: "Network Topologies & Protocols",
    subject: "ICT",
    keywords: ["network", "topologies", "protocols", "lan", "wan", "star", "bus", "mesh", "tcp/ip"],
  },
  {
    id: "27axs9dO7AE",
    title: "What is SQL?",
    channelTitle: "Danielle Thé",
    topic: "SQL Queries SELECT INSERT UPDATE",
    subject: "ICT",
    keywords: ["sql", "queries", "select", "insert", "update", "delete", "database", "rdbms"],
  },
  {
    id: "Fi3_BjVzpqk",
    title: "Introduction to Software Development Life Cycle",
    channelTitle: "Simplilearn",
    topic: "System Development Life Cycle",
    subject: "ICT",
    keywords: ["sdlc", "system development", "analysis", "design", "waterfall", "agile", "testing"],
  },
  {
    id: "FFDMzbrEXaE",
    title: "Number Systems Introduction - Decimal, Binary, Octal & Hexadecimal",
    channelTitle: "The Organic Chemistry Tutor",
    topic: "Binary & Hexadecimal Number Systems",
    subject: "ICT",
    keywords: ["binary", "hexadecimal", "number systems", "bits", "bytes", "conversions", "base 2"],
  },

  /* ── Chemistry ─────────────────────────────────────────────────────── */
  {
    id: "1xSQlwWGT8M",
    title: "Introduction to the Atom",
    channelTitle: "Khan Academy",
    topic: "Atomic Structure & Electron Configuration",
    subject: "Chemistry",
    keywords: ["atomic", "structure", "electron", "configuration", "orbitals", "protons", "neutrons"],
  },
  {
    id: "OttRV5ykP7A",
    title: "How to Speed Up Chemical Reactions (and Get a Date)",
    channelTitle: "TED-Ed",
    topic: "Rates of Reaction & Collision Theory",
    subject: "Chemistry",
    keywords: ["rates of reaction", "collision theory", "activation energy", "catalyst", "kinetics"],
  },
  {
    id: "g5wNg_dKsYY",
    title: "Equilibrium: Crash Course Chemistry #28",
    channelTitle: "CrashCourse",
    topic: "Equilibrium & Le Chatelier's Principle",
    subject: "Chemistry",
    keywords: ["equilibrium", "le chatelier", "reversible", "dynamic", "kc", "kp"],
  },

  /* ── Biology ───────────────────────────────────────────────────────── */
  {
    id: "URUJD5NEXC8",
    title: "Cell Structure and Function",
    channelTitle: "Nucleus Medical Media",
    topic: "Cell Structure & Organelles",
    subject: "Biology",
    keywords: ["cell", "structure", "organelles", "mitochondria", "eukaryote", "prokaryote", "membrane"],
  },
  {
    id: "8kK2zwjRV0M",
    title: "DNA Structure and Replication: Crash Course Biology #10",
    channelTitle: "CrashCourse",
    topic: "DNA Replication & Protein Synthesis",
    subject: "Biology",
    keywords: ["dna", "replication", "protein synthesis", "transcription", "translation", "rna"],
  },

  /* ── Further Mathematics ───────────────────────────────────────────── */
  {
    id: "T647CGsuOVU",
    title: "Imaginary Numbers Are Real [Part 1: Introduction]",
    channelTitle: "Welch Labs",
    topic: "Complex Numbers & Argand Diagrams",
    subject: "Further Mathematics",
    keywords: ["complex numbers", "argand", "imaginary", "euler", "polar form", "de moivre"],
  },
];

/* ── Canonical Subject Map & Aliases ─────────────────────────────────── */
export const CANONICAL_SUBJECT_MAP: Record<string, string> = {
  physics: "Physics",
  phys: "Physics",
  math: "Pure Mathematics",
  maths: "Pure Mathematics",
  "pure math": "Pure Mathematics",
  "pure maths": "Pure Mathematics",
  "pure mathematics": "Pure Mathematics",
  mathematics: "Pure Mathematics",
  "further math": "Further Mathematics",
  "further maths": "Further Mathematics",
  "further mathematics": "Further Mathematics",
  ict: "ICT",
  computing: "ICT",
  "computer science": "ICT",
  chemistry: "Chemistry",
  chem: "Chemistry",
  biology: "Biology",
  bio: "Biology",
  english: "English Language",
  french: "French Language",
};

export function normalizeSubjectName(input?: string): string {
  if (!input) return "Physics";
  const clean = input.trim().toLowerCase();
  return CANONICAL_SUBJECT_MAP[clean] || input.trim();
}

/* ── oEmbed Video Availability Verification ────────────────────────── */

/**
 * Checks if a YouTube video is embeddable via the oEmbed endpoint.
 * Returns the video title if available, or null if unavailable.
 */
export async function verifyYouTubeVideo(
  videoId: string
): Promise<{ available: boolean; title?: string } | null> {
  try {
    const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    const res = await fetch(url, { signal: AbortSignal.timeout(4000) });
    if (!res.ok) return { available: false };
    const data = await res.json();
    return { available: true, title: data.title || "" };
  } catch {
    return { available: false };
  }
}

/* ── Fuzzy Topic Video Resolver ─────────────────────────────────────── */

/**
 * Finds the best catalog video for a given subject/topic.
 * 1. Exact topic match within subject.
 * 2. Fuzzy keyword scoring within subject.
 * 3. Cross-subject keyword fallback.
 * 4. First video in subject as final fallback.
 */
export function findVideoForTopic(
  subjectInput?: string,
  topicInput?: string
): VideoCatalogItem {
  const normSubject = normalizeSubjectName(subjectInput);
  const topicClean = (topicInput || "").trim().toLowerCase();

  // 1. Exact topic match within subject
  const exact = GCE_VIDEO_CATALOG.find(
    (item) =>
      item.subject.toLowerCase() === normSubject.toLowerCase() &&
      item.topic.toLowerCase() === topicClean
  );
  if (exact) return exact;

  // 2. Fuzzy match within subject based on keyword and title tokens
  const subjectPool = GCE_VIDEO_CATALOG.filter(
    (item) => item.subject.toLowerCase() === normSubject.toLowerCase()
  );

  if (subjectPool.length > 0 && topicClean) {
    const topicTokens = topicClean
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length >= 3);

    let bestItem = subjectPool[0];
    let maxScore = -1;

    for (const item of subjectPool) {
      let score = 0;
      const itemText =
        `${item.topic} ${item.title} ${item.keywords.join(" ")}`.toLowerCase();

      for (const token of topicTokens) {
        if (itemText.includes(token)) {
          if (item.topic.toLowerCase().includes(token)) {
            score += 4;
          } else {
            score += 2;
          }
        }
      }

      if (score > maxScore) {
        maxScore = score;
        bestItem = item;
      }
    }

    if (maxScore > 0) return bestItem;
  }

  // 3. Cross-subject fallback
  if (topicClean) {
    const topicTokens = topicClean
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length >= 3);

    for (const item of GCE_VIDEO_CATALOG) {
      for (const token of topicTokens) {
        if (
          item.keywords.includes(token) ||
          item.topic.toLowerCase().includes(token)
        ) {
          return item;
        }
      }
    }
  }

  // 4. Final safety fallback
  return subjectPool[0] || GCE_VIDEO_CATALOG[0];
}
