export interface VideoCatalogItem {
  id: string;
  title: string;
  channelTitle: string;
  topic: string;
  subject: string;
  youtubeUrl: string;
  embedUrl: string;
  thumbnail: string;
  description: string;
  keywords: string[];
}

export const GCE_VIDEO_CATALOG: VideoCatalogItem[] = [
  /* ------------------------------------------------------------------ */
  /*  Pure Mathematics                                                 */
  /* ------------------------------------------------------------------ */
  {
    id: "nSb_V_8Y5h0",
    title: "The Binomial Theorem - Full Tutorial & Exam Examples",
    channelTitle: "The Organic Chemistry Tutor",
    topic: "Binomial Theorem",
    subject: "Pure Mathematics",
    youtubeUrl: "https://www.youtube.com/watch?v=nSb_V_8Y5h0",
    embedUrl: "https://www.youtube.com/embed/nSb_V_8Y5h0",
    thumbnail: "https://i.ytimg.com/vi/nSb_V_8Y5h0/hqdefault.jpg",
    description: "Learn how to expand expressions using the Binomial Theorem and Pascal's Triangle for GCE exams.",
    keywords: ["binomial", "theorem", "expansion", "pascal", "combinations", "ncr", "powers"],
  },
  {
    id: "riXcZT2ICjA",
    title: "Introduction to Limits & Calculus",
    channelTitle: "Khan Academy",
    topic: "Limits & First Principles",
    subject: "Pure Mathematics",
    youtubeUrl: "https://www.youtube.com/watch?v=riXcZT2ICjA",
    embedUrl: "https://www.youtube.com/embed/riXcZT2ICjA",
    thumbnail: "https://i.ytimg.com/vi/riXcZT2ICjA/hqdefault.jpg",
    description: "Understand limits, delta-epsilon concepts, and instantaneous rate of change.",
    keywords: ["limits", "first principles", "calculus", "derivatives", "slope", "rate of change"],
  },
  {
    id: "x97Tff41y1I",
    title: "Trigonometric Identities & Proofs - A-Level Pure Maths",
    channelTitle: "TLMaths",
    topic: "Trigonometric Identities",
    subject: "Pure Mathematics",
    youtubeUrl: "https://www.youtube.com/watch?v=x97Tff41y1I",
    embedUrl: "https://www.youtube.com/embed/x97Tff41y1I",
    thumbnail: "https://i.ytimg.com/vi/x97Tff41y1I/hqdefault.jpg",
    description: "Proof and application of sin^2+cos^2=1, compound angles, and double angle identities.",
    keywords: ["trig", "trigonometric", "identities", "sine", "cosine", "tangent", "double angle", "compound"],
  },
  {
    id: "gYnqn_q9bK0",
    title: "Differentiation from First Principles Step by Step",
    channelTitle: "The Organic Chemistry Tutor",
    topic: "Differentiation from First Principles",
    subject: "Pure Mathematics",
    youtubeUrl: "https://www.youtube.com/watch?v=gYnqn_q9bK0",
    embedUrl: "https://www.youtube.com/embed/gYnqn_q9bK0",
    thumbnail: "https://i.ytimg.com/vi/gYnqn_q9bK0/hqdefault.jpg",
    description: "Master finding derivatives using limit as h approaches 0 definition.",
    keywords: ["differentiation", "first principles", "derivative", "dy/dx", "tangent", "gradient"],
  },
  {
    id: "lG7fA-Xk3sQ",
    title: "Integration by Substitution (u-substitution) - Complete Guide",
    channelTitle: "Khan Academy",
    topic: "Integration by Substitution",
    subject: "Pure Mathematics",
    youtubeUrl: "https://www.youtube.com/watch?v=lG7fA-Xk3sQ",
    embedUrl: "https://www.youtube.com/embed/lG7fA-Xk3sQ",
    thumbnail: "https://i.ytimg.com/vi/lG7fA-Xk3sQ/hqdefault.jpg",
    description: "How to integrate complex expressions using algebraic and trigonometric substitutions.",
    keywords: ["integration", "substitution", "u-substitution", "integral", "dx", "calculus"],
  },
  {
    id: "gB4gYlA1r_8",
    title: "Quadratic Equations, Discriminant & Completing the Square",
    channelTitle: "The Organic Chemistry Tutor",
    topic: "Quadratic Equations & Discriminant",
    subject: "Pure Mathematics",
    youtubeUrl: "https://www.youtube.com/watch?v=gB4gYlA1r_8",
    embedUrl: "https://www.youtube.com/embed/gB4gYlA1r_8",
    thumbnail: "https://i.ytimg.com/vi/gB4gYlA1r_8/hqdefault.jpg",
    description: "Understanding real, distinct, and repeated roots using the discriminant b^2 - 4ac.",
    keywords: ["quadratic", "discriminant", "roots", "completing the square", "parabola", "algebra"],
  },
  {
    id: "mQTWzLpCcW0",
    title: "Logarithms & Exponential Functions Explained",
    channelTitle: "Khan Academy",
    topic: "Logarithms & Exponential Functions",
    subject: "Pure Mathematics",
    youtubeUrl: "https://www.youtube.com/watch?v=mQTWzLpCcW0",
    embedUrl: "https://www.youtube.com/embed/mQTWzLpCcW0",
    thumbnail: "https://i.ytimg.com/vi/mQTWzLpCcW0/hqdefault.jpg",
    description: "Laws of logarithms, change of base rule, and solving exponential equations.",
    keywords: ["logarithms", "logs", "exponentials", "natural log", "ln", "e", "powers"],
  },
  {
    id: "zIVw_0F_xR8",
    title: "Arithmetic & Geometric Progressions (AP and GP)",
    channelTitle: "TLMaths",
    topic: "Sequences & Series (AP and GP)",
    subject: "Pure Mathematics",
    youtubeUrl: "https://www.youtube.com/watch?v=zIVw_0F_xR8",
    embedUrl: "https://www.youtube.com/embed/zIVw_0F_xR8",
    thumbnail: "https://i.ytimg.com/vi/zIVw_0F_xR8/hqdefault.jpg",
    description: "Formulas for nth term, sum to n terms, and sum to infinity for AP and GP.",
    keywords: ["sequences", "series", "ap", "gp", "arithmetic", "geometric", "progression", "sum"],
  },
  {
    id: "G_kZJ2-rI9Q",
    title: "Coordinate Geometry of Circles - Tangents & Radii",
    channelTitle: "The Organic Chemistry Tutor",
    topic: "Coordinate Geometry of Circles",
    subject: "Pure Mathematics",
    youtubeUrl: "https://www.youtube.com/watch?v=G_kZJ2-rI9Q",
    embedUrl: "https://www.youtube.com/embed/G_kZJ2-rI9Q",
    thumbnail: "https://i.ytimg.com/vi/G_kZJ2-rI9Q/hqdefault.jpg",
    description: "Finding equations of circles (x-a)^2 + (y-b)^2 = r^2 and tangents to circles.",
    keywords: ["coordinate geometry", "circles", "radius", "center", "tangents", "normals"],
  },
  {
    id: "ml4C3x9ZUzI",
    title: "Vectors in 2D and 3D - Dot Product & Equations of Lines",
    channelTitle: "3Blue1Brown",
    topic: "Vectors in 2D and 3D",
    subject: "Pure Mathematics",
    youtubeUrl: "https://www.youtube.com/watch?v=ml4C3x9ZUzI",
    embedUrl: "https://www.youtube.com/embed/ml4C3x9ZUzI",
    thumbnail: "https://i.ytimg.com/vi/ml4C3x9ZUzI/hqdefault.jpg",
    description: "Visual introduction to vector components, scalar product, and 3D space.",
    keywords: ["vectors", "2d", "3d", "dot product", "scalar product", "vector equation", "magnitude"],
  },
  {
    id: "8c7Lq9K5yX4",
    title: "Partial Fractions Decomposition - All Cases Explained",
    channelTitle: "The Organic Chemistry Tutor",
    topic: "Partial Fractions",
    subject: "Pure Mathematics",
    youtubeUrl: "https://www.youtube.com/watch?v=8c7Lq9K5yX4",
    embedUrl: "https://www.youtube.com/embed/8c7Lq9K5yX4",
    thumbnail: "https://i.ytimg.com/vi/8c7Lq9K5yX4/hqdefault.jpg",
    description: "Decomposing rational expressions into partial fractions for calculus integration.",
    keywords: ["partial fractions", "linear factors", "repeated factors", "quadratic factors", "algebra"],
  },

  /* ------------------------------------------------------------------ */
  /*  Physics                                                           */
  /* ------------------------------------------------------------------ */
  {
    id: "ZM8ECpBuQYE",
    title: "Newton's Laws of Motion - Full Course Breakdown",
    channelTitle: "Khan Academy",
    topic: "Newton's Laws of Motion",
    subject: "Physics",
    youtubeUrl: "https://www.youtube.com/watch?v=ZM8ECpBuQYE",
    embedUrl: "https://www.youtube.com/embed/ZM8ECpBuQYE",
    thumbnail: "https://i.ytimg.com/vi/ZM8ECpBuQYE/hqdefault.jpg",
    description: "Detailed study of inertia, F=ma, action-reaction, and free body diagrams.",
    keywords: ["newton", "laws of motion", "force", "mass", "acceleration", "inertia", "mechanics"],
  },
  {
    id: "kKKM8Y-u7ds",
    title: "Electromagnetic Induction & Faraday's Law Explained",
    channelTitle: "The Organic Chemistry Tutor",
    topic: "Electromagnetic Induction",
    subject: "Physics",
    youtubeUrl: "https://www.youtube.com/watch?v=kKKM8Y-u7ds",
    embedUrl: "https://www.youtube.com/embed/kKKM8Y-u7ds",
    thumbnail: "https://i.ytimg.com/vi/kKKM8Y-u7ds/hqdefault.jpg",
    description: "Magnetic flux, induced EMF, Lenz's law, and Faraday's law of induction.",
    keywords: ["electromagnetic", "induction", "faraday", "lenz", "magnetic flux", "emf", "current"],
  },
  {
    id: "qAn0rY4_Hjg",
    title: "Wave-Particle Duality & Photoelectric Effect",
    channelTitle: "Professor Dave Explains",
    topic: "Wave-Particle Duality",
    subject: "Physics",
    youtubeUrl: "https://www.youtube.com/watch?v=qAn0rY4_Hjg",
    embedUrl: "https://www.youtube.com/embed/qAn0rY4_Hjg",
    thumbnail: "https://i.ytimg.com/vi/qAn0rY4_Hjg/hqdefault.jpg",
    description: "Einstein's photoelectric equation, photons, work function, and de Broglie wavelength.",
    keywords: ["wave", "particle", "duality", "photoelectric", "photon", "quantum", "de broglie"],
  },
  {
    id: "rA_c9p-Vp0E",
    title: "Projectile Motion - Calculating Velocity, Height & Range",
    channelTitle: "The Organic Chemistry Tutor",
    topic: "Projectile Motion",
    subject: "Physics",
    youtubeUrl: "https://www.youtube.com/watch?v=rA_c9p-Vp0E",
    embedUrl: "https://www.youtube.com/embed/rA_c9p-Vp0E",
    thumbnail: "https://i.ytimg.com/vi/rA_c9p-Vp0E/hqdefault.jpg",
    description: "Resolving horizontal and vertical components of 2D kinematic motion.",
    keywords: ["projectile", "motion", "kinematics", "trajectory", "velocity", "gravity", "range"],
  },
  {
    id: "w4QFJb9a8vo",
    title: "Conservation of Energy - Work, Kinetic & Potential Energy",
    channelTitle: "Khan Academy",
    topic: "Conservation of Energy",
    subject: "Physics",
    youtubeUrl: "https://www.youtube.com/watch?v=w4QFJb9a8vo",
    embedUrl: "https://www.youtube.com/embed/w4QFJb9a8vo",
    thumbnail: "https://i.ytimg.com/vi/w4QFJb9a8vo/hqdefault.jpg",
    description: "Law of conservation of energy and mechanical energy conversions.",
    keywords: ["conservation of energy", "work", "kinetic", "potential", "power", "efficiency"],
  },
  {
    id: "Z3H_kE1qM9s",
    title: "Electric Circuits & Kirchhoff's Laws (KCL & KVL)",
    channelTitle: "The Organic Chemistry Tutor",
    topic: "Electric Circuits & Kirchhoff's Laws",
    subject: "Physics",
    youtubeUrl: "https://www.youtube.com/watch?v=Z3H_kE1qM9s",
    embedUrl: "https://www.youtube.com/embed/Z3H_kE1qM9s",
    thumbnail: "https://i.ytimg.com/vi/Z3H_kE1qM9s/hqdefault.jpg",
    description: "Solving series and parallel circuit networks with Kirchhoff's voltage and current laws.",
    keywords: ["circuits", "kirchhoff", "resistors", "ohm", "voltage", "current", "potential divider"],
  },
  {
    id: "tqnOt7VfP-8",
    title: "Simple Harmonic Motion (SHM) - Pendulum & Springs",
    channelTitle: "Khan Academy",
    topic: "Simple Harmonic Motion",
    subject: "Physics",
    youtubeUrl: "https://www.youtube.com/watch?v=tqnOt7VfP-8",
    embedUrl: "https://www.youtube.com/embed/tqnOt7VfP-8",
    thumbnail: "https://i.ytimg.com/vi/tqnOt7VfP-8/hqdefault.jpg",
    description: "Displacement, velocity, acceleration, and energy oscillations in SHM.",
    keywords: ["simple harmonic motion", "shm", "oscillations", "pendulum", "frequency", "amplitude"],
  },
  {
    id: "7gf6YpdvtE0",
    title: "Gravitational Fields & Newton's Law of Universal Gravitation",
    channelTitle: "Professor Dave Explains",
    topic: "Gravitational Fields",
    subject: "Physics",
    youtubeUrl: "https://www.youtube.com/watch?v=7gf6YpdvtE0",
    embedUrl: "https://www.youtube.com/embed/7gf6YpdvtE0",
    thumbnail: "https://i.ytimg.com/vi/7gf6YpdvtE0/hqdefault.jpg",
    description: "Gravitational field strength, potential, orbital mechanics, and satellite motion.",
    keywords: ["gravitational", "fields", "gravity", "orbit", "potential", "escape velocity"],
  },
  {
    id: "o-9yt7O443g",
    title: "Nuclear Physics & Radioactivity (Alpha, Beta, Gamma Decay)",
    channelTitle: "The Organic Chemistry Tutor",
    topic: "Nuclear Physics & Radioactivity",
    subject: "Physics",
    youtubeUrl: "https://www.youtube.com/watch?v=o-9yt7O443g",
    embedUrl: "https://www.youtube.com/embed/o-9yt7O443g",
    thumbnail: "https://i.ytimg.com/vi/o-9yt7O443g/hqdefault.jpg",
    description: "Half-life calculations, nuclear decay equations, and mass-energy equivalence.",
    keywords: ["nuclear", "radioactivity", "alpha", "beta", "gamma", "half-life", "decay", "binding energy"],
  },

  /* ------------------------------------------------------------------ */
  /*  ICT & Computing                                                   */
  /* ------------------------------------------------------------------ */
  {
    id: "UrYLYV7WSHM",
    title: "Database Normalization (1NF, 2NF, 3NF Explained)",
    channelTitle: "Decomplexify",
    topic: "Database Normalization 1NF 2NF 3NF",
    subject: "ICT",
    youtubeUrl: "https://www.youtube.com/watch?v=UrYLYV7WSHM",
    embedUrl: "https://www.youtube.com/embed/UrYLYV7WSHM",
    thumbnail: "https://i.ytimg.com/vi/UrYLYV7WSHM/hqdefault.jpg",
    description: "Step-by-step breakdown of eliminating redundancy and normal forms in relational databases.",
    keywords: ["database", "normalization", "1nf", "2nf", "3nf", "primary key", "foreign key", "sql"],
  },
  {
    id: "H8W9oMNSuwo",
    title: "Network Topologies (Star, Bus, Ring, Mesh) & OSI Model",
    channelTitle: "PowerCert Animated Videos",
    topic: "Network Topologies & Protocols",
    subject: "ICT",
    youtubeUrl: "https://www.youtube.com/watch?v=H8W9oMNSuwo",
    embedUrl: "https://www.youtube.com/embed/H8W9oMNSuwo",
    thumbnail: "https://i.ytimg.com/vi/H8W9oMNSuwo/hqdefault.jpg",
    description: "Learn how computers connect via star, mesh, bus topologies, and network protocols.",
    keywords: ["network", "topologies", "protocols", "lan", "wan", "star", "bus", "mesh", "tcp/ip"],
  },
  {
    id: "HXV3zeRR3h4",
    title: "SQL Tutorial - Full Database Course for Beginners",
    channelTitle: "freeCodeCamp.org",
    topic: "SQL Queries SELECT INSERT UPDATE",
    subject: "ICT",
    youtubeUrl: "https://www.youtube.com/watch?v=HXV3zeRR3h4",
    embedUrl: "https://www.youtube.com/embed/HXV3zeRR3h4",
    thumbnail: "https://i.ytimg.com/vi/HXV3zeRR3h4/hqdefault.jpg",
    description: "Master SQL commands: SELECT, WHERE, INSERT, UPDATE, DELETE, and JOINs.",
    keywords: ["sql", "queries", "select", "insert", "update", "delete", "database", "rdbms"],
  },
  {
    id: "qWmsZq3Xm-U",
    title: "System Development Life Cycle (SDLC) Explained",
    channelTitle: "Eye on Tech",
    topic: "System Development Life Cycle",
    subject: "ICT",
    youtubeUrl: "https://www.youtube.com/watch?v=qWmsZq3Xm-U",
    embedUrl: "https://www.youtube.com/embed/qWmsZq3Xm-U",
    thumbnail: "https://i.ytimg.com/vi/qWmsZq3Xm-U/hqdefault.jpg",
    description: "The 7 stages of SDLC: Planning, Analysis, Design, Implementation, Testing, Deployment, Maintenance.",
    keywords: ["sdlc", "system development", "analysis", "design", "waterfall", "agile", "testing"],
  },
  {
    id: "FFDMzbrEXaE",
    title: "Binary, Decimal and Hexadecimal Number Systems",
    channelTitle: "The Organic Chemistry Tutor",
    topic: "Binary & Hexadecimal Number Systems",
    subject: "ICT",
    youtubeUrl: "https://www.youtube.com/watch?v=FFDMzbrEXaE",
    embedUrl: "https://www.youtube.com/embed/FFDMzbrEXaE",
    thumbnail: "https://i.ytimg.com/vi/FFDMzbrEXaE/hqdefault.jpg",
    description: "Conversions between binary, denary, and hexadecimal number bases.",
    keywords: ["binary", "hexadecimal", "number systems", "bits", "bytes", "conversions", "base 2"],
  },

  /* ------------------------------------------------------------------ */
  /*  Chemistry                                                         */
  /* ------------------------------------------------------------------ */
  {
    id: "xuPl_8wv9xo",
    title: "Atomic Structure & Electron Configuration",
    channelTitle: "Professor Dave Explains",
    topic: "Atomic Structure & Electron Configuration",
    subject: "Chemistry",
    youtubeUrl: "https://www.youtube.com/watch?v=xuPl_8wv9xo",
    embedUrl: "https://www.youtube.com/embed/xuPl_8wv9xo",
    thumbnail: "https://i.ytimg.com/vi/xuPl_8wv9xo/hqdefault.jpg",
    description: "Orbitals (s, p, d, f), Pauli exclusion principle, Hund's rule, and electron filling.",
    keywords: ["atomic", "structure", "electron", "configuration", "orbitals", "protons", "neutrons"],
  },
  {
    id: "po5kO_v1hRw",
    title: "Rates of Reaction & Collision Theory Explained",
    channelTitle: "Freesciencelessons",
    topic: "Rates of Reaction & Collision Theory",
    subject: "Chemistry",
    youtubeUrl: "https://www.youtube.com/watch?v=po5kO_v1hRw",
    embedUrl: "https://www.youtube.com/embed/po5kO_v1hRw",
    thumbnail: "https://i.ytimg.com/vi/po5kO_v1hRw/hqdefault.jpg",
    description: "Factors affecting reaction rates: temperature, surface area, concentration, and catalysts.",
    keywords: ["rates of reaction", "collision theory", "activation energy", "catalyst", "kinetics"],
  },
  {
    id: "m8bX_yLg9s0",
    title: "Le Chatelier's Principle & Chemical Equilibrium",
    channelTitle: "Khan Academy",
    topic: "Equilibrium & Le Chatelier's Principle",
    subject: "Chemistry",
    youtubeUrl: "https://www.youtube.com/watch?v=m8bX_yLg9s0",
    embedUrl: "https://www.youtube.com/embed/m8bX_yLg9s0",
    thumbnail: "https://i.ytimg.com/vi/m8bX_yLg9s0/hqdefault.jpg",
    description: "How changes in concentration, pressure, and temperature shift equilibrium positions.",
    keywords: ["equilibrium", "le chatelier", "reversible", "dynamic", "kc", "kp"],
  },

  /* ------------------------------------------------------------------ */
  /*  Biology                                                           */
  /* ------------------------------------------------------------------ */
  {
    id: "URUJD5NEXC8",
    title: "Cell Structure and Function: Microscopic World",
    channelTitle: "Amoeba Sisters",
    topic: "Cell Structure & Organelles",
    subject: "Biology",
    youtubeUrl: "https://www.youtube.com/watch?v=URUJD5NEXC8",
    embedUrl: "https://www.youtube.com/embed/URUJD5NEXC8",
    thumbnail: "https://i.ytimg.com/vi/URUJD5NEXC8/hqdefault.jpg",
    description: "Explore prokaryotic vs eukaryotic cells, nucleus, mitochondria, ribosomes, and membranes.",
    keywords: ["cell", "structure", "organelles", "mitochondria", "eukaryote", "prokaryote", "membrane"],
  },
  {
    id: "8kK2zwjRV0M",
    title: "DNA Replication & Protein Synthesis (Transcription & Translation)",
    channelTitle: "Amoeba Sisters",
    topic: "DNA Replication & Protein Synthesis",
    subject: "Biology",
    youtubeUrl: "https://www.youtube.com/watch?v=8kK2zwjRV0M",
    embedUrl: "https://www.youtube.com/embed/8kK2zwjRV0M",
    thumbnail: "https://i.ytimg.com/vi/8kK2zwjRV0M/hqdefault.jpg",
    description: "DNA helicase, polymerase, mRNA transcription, and tRNA ribosome translation.",
    keywords: ["dna", "replication", "protein synthesis", "transcription", "translation", "rna"],
  },

  /* ------------------------------------------------------------------ */
  /*  Further Mathematics                                               */
  /* ------------------------------------------------------------------ */
  {
    id: "sW9npfMcMEI",
    title: "Complex Numbers & Argand Diagrams Explained Visually",
    channelTitle: "3Blue1Brown",
    topic: "Complex Numbers & Argand Diagrams",
    subject: "Further Mathematics",
    youtubeUrl: "https://www.youtube.com/watch?v=sW9npfMcMEI",
    embedUrl: "https://www.youtube.com/embed/sW9npfMcMEI",
    thumbnail: "https://i.ytimg.com/vi/sW9npfMcMEI/hqdefault.jpg",
    description: "Visual geometry of imaginary numbers, Euler's formula, and multiplication as rotation.",
    keywords: ["complex numbers", "argand", "imaginary", "euler", "polar form", "de moivre"],
  },
];

/* ------------------------------------------------------------------ */
/*  Canonical Subject Map & Aliases                                    */
/* ------------------------------------------------------------------ */
export const CANONICAL_SUBJECT_MAP: Record<string, string> = {
  physics: "Physics",
  phys: "Physics",
  math: "Pure Mathematics",
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

/**
 * Intelligent topic video resolver.
 * 1. Checks exact subject & topic match.
 * 2. Checks token & keyword overlap against curated catalog.
 * 3. Falls back to subject-level top video if no topic tokens match.
 */
export function findVideoForTopic(subjectInput?: string, topicInput?: string): VideoCatalogItem {
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
      const itemText = `${item.topic} ${item.title} ${item.keywords.join(" ")}`.toLowerCase();

      for (const token of topicTokens) {
        if (itemText.includes(token)) {
          // Extra weight for topic name matches
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

    if (maxScore > 0) {
      return bestItem;
    }
  }

  // 3. Fallback across all subjects if subject not matched
  if (topicClean) {
    const topicTokens = topicClean
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length >= 3);

    for (const item of GCE_VIDEO_CATALOG) {
      for (const token of topicTokens) {
        if (item.keywords.includes(token) || item.topic.toLowerCase().includes(token)) {
          return item;
        }
      }
    }
  }

  // 4. Final safety fallback to subject default or first item
  return subjectPool[0] || GCE_VIDEO_CATALOG[0];
}
