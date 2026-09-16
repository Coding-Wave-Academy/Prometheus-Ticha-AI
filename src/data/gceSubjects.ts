/**
 * Comprehensive Cameroon GCE Board (Ordinary Level & Advanced Level) Subjects Catalog.
 * Used for onboarding challenge selection, past papers, syllabus breakdown, and AI tutoring.
 */

export interface GceSubject {
  id: string;
  name: string;
  code: string;
  category: "sciences" | "commercial" | "arts";
  level: "both" | "ol" | "al";
  iconEmoji: string;
  iconBg: string;
  iconBorder: string;
  popular?: boolean;
}

// ─── GCE ORDINARY LEVEL (O/L) EXAM SUBJECTS ───
export const GCE_OL_SUBJECTS: GceSubject[] = [
  // Sciences & Mathematics
  {
    id: "math_ol",
    name: "Mathematics",
    code: "MATH-570",
    category: "sciences",
    level: "ol",
    iconEmoji: "🔢",
    iconBg: "bg-[#DBEAFE]",
    iconBorder: "border-[#93C5FD]",
    popular: true,
  },
  {
    id: "additional_math_ol",
    name: "Additional Mathematics",
    code: "ADDMATH-575",
    category: "sciences",
    level: "ol",
    iconEmoji: "📊",
    iconBg: "bg-[#EDE9FE]",
    iconBorder: "border-[#DDD6FE]",
    popular: true,
  },
  {
    id: "physics_ol",
    name: "Physics",
    code: "PHY-580",
    category: "sciences",
    level: "ol",
    iconEmoji: "⚡",
    iconBg: "bg-[#FEF9C3]",
    iconBorder: "border-[#FDE68A]",
    popular: true,
  },
  {
    id: "chemistry_ol",
    name: "Chemistry",
    code: "CHEM-515",
    category: "sciences",
    level: "ol",
    iconEmoji: "🧪",
    iconBg: "bg-[#CCFBF1]",
    iconBorder: "border-[#99F6E4]",
    popular: true,
  },
  {
    id: "biology_ol",
    name: "Biology",
    code: "BIO-510",
    category: "sciences",
    level: "ol",
    iconEmoji: "🧬",
    iconBg: "bg-[#D1FAE5]",
    iconBorder: "border-[#A7F3D0]",
    popular: true,
  },
  {
    id: "human_biology_ol",
    name: "Human Biology",
    code: "HBIO-565",
    category: "sciences",
    level: "ol",
    iconEmoji: "🫀",
    iconBg: "bg-[#FFE4E6]",
    iconBorder: "border-[#FECDD3]",
  },
  {
    id: "cs_ict_ol",
    name: "Computer Science & ICT",
    code: "CSC-595",
    category: "sciences",
    level: "ol",
    iconEmoji: "💻",
    iconBg: "bg-[#E0F2FE]",
    iconBorder: "border-[#BAE6FD]",
    popular: true,
  },

  // Commercial & Social Sciences
  {
    id: "economics_ol",
    name: "Economics",
    code: "ECON-525",
    category: "commercial",
    level: "ol",
    iconEmoji: "📈",
    iconBg: "bg-[#DCFCE7]",
    iconBorder: "border-[#BBF7D0]",
    popular: true,
  },
  {
    id: "commerce_ol",
    name: "Commerce",
    code: "COM-520",
    category: "commercial",
    level: "ol",
    iconEmoji: "🏢",
    iconBg: "bg-[#F1F5F9]",
    iconBorder: "border-[#CBD5E1]",
  },
  {
    id: "accounts_ol",
    name: "Principles of Accounts",
    code: "ACC-505",
    category: "commercial",
    level: "ol",
    iconEmoji: "🧮",
    iconBg: "bg-[#FEF3C7]",
    iconBorder: "border-[#FDE68A]",
    popular: true,
  },
  {
    id: "geography_ol",
    name: "Geography",
    code: "GEO-550",
    category: "commercial",
    level: "ol",
    iconEmoji: "🌍",
    iconBg: "bg-[#E0F2FE]",
    iconBorder: "border-[#BAE6FD]",
    popular: true,
  },
  {
    id: "history_ol",
    name: "History",
    code: "HIST-560",
    category: "commercial",
    level: "ol",
    iconEmoji: "📜",
    iconBg: "bg-[#FFF7ED]",
    iconBorder: "border-[#FED7AA]",
    popular: true,
  },
  {
    id: "citizenship_ol",
    name: "Citizenship Education",
    code: "CIT-535",
    category: "commercial",
    level: "ol",
    iconEmoji: "🇨🇲",
    iconBg: "bg-[#FEF9C3]",
    iconBorder: "border-[#FDE68A]",
  },

  // Arts, Languages & Humanities
  {
    id: "english_language_ol",
    name: "English Language",
    code: "ENG-530",
    category: "arts",
    level: "ol",
    iconEmoji: "📖",
    iconBg: "bg-[#FFE4E6]",
    iconBorder: "border-[#FECDD3]",
    popular: true,
  },
  {
    id: "literature_english_ol",
    name: "Literature in English",
    code: "LIT-540",
    category: "arts",
    level: "ol",
    iconEmoji: "📚",
    iconBg: "bg-[#FCE7F3]",
    iconBorder: "border-[#FBCFE8]",
    popular: true,
  },
  {
    id: "french_ol",
    name: "French Language",
    code: "FRE-545",
    category: "arts",
    level: "ol",
    iconEmoji: "🇫🇷",
    iconBg: "bg-[#DBEAFE]",
    iconBorder: "border-[#BFDBFE]",
    popular: true,
  },
  {
    id: "special_french_ol",
    name: "Special Bilingual French",
    code: "SBF-555",
    category: "arts",
    level: "ol",
    iconEmoji: "🗣️",
    iconBg: "bg-[#E0E7FF]",
    iconBorder: "border-[#C7D2FE]",
  },
  {
    id: "religious_studies_ol",
    name: "Religious Studies",
    code: "REL-585",
    category: "arts",
    level: "ol",
    iconEmoji: "🕊️",
    iconBg: "bg-[#FEF3C7]",
    iconBorder: "border-[#FDE68A]",
  },
  {
    id: "food_nutrition_ol",
    name: "Food & Nutrition",
    code: "FN-540",
    category: "arts",
    level: "ol",
    iconEmoji: "🥗",
    iconBg: "bg-[#ECFDF5]",
    iconBorder: "border-[#A7F3D0]",
  },
];

// ─── GCE ADVANCED LEVEL (A/L) EXAM SUBJECTS ───
export const GCE_AL_SUBJECTS: GceSubject[] = [
  // Sciences & Mathematics
  {
    id: "pure_math_stats_al",
    name: "Pure Mathematics with Statistics",
    code: "PMS-770",
    category: "sciences",
    level: "al",
    iconEmoji: "➗",
    iconBg: "bg-[#DBEAFE]",
    iconBorder: "border-[#93C5FD]",
    popular: true,
  },
  {
    id: "pure_math_mech_al",
    name: "Pure Mathematics with Mechanics",
    code: "PMM-765",
    category: "sciences",
    level: "al",
    iconEmoji: "📐",
    iconBg: "bg-[#DBEAFE]",
    iconBorder: "border-[#93C5FD]",
    popular: true,
  },
  {
    id: "further_math_al",
    name: "Further Mathematics",
    code: "FM-775",
    category: "sciences",
    level: "al",
    iconEmoji: "♾️",
    iconBg: "bg-[#F3E8FF]",
    iconBorder: "border-[#E9D5FF]",
    popular: true,
  },
  {
    id: "physics_al",
    name: "Physics",
    code: "PHY-780",
    category: "sciences",
    level: "al",
    iconEmoji: "⚡",
    iconBg: "bg-[#FEF9C3]",
    iconBorder: "border-[#FDE68A]",
    popular: true,
  },
  {
    id: "chemistry_al",
    name: "Chemistry",
    code: "CHEM-715",
    category: "sciences",
    level: "al",
    iconEmoji: "🧪",
    iconBg: "bg-[#CCFBF1]",
    iconBorder: "border-[#99F6E4]",
    popular: true,
  },
  {
    id: "biology_al",
    name: "Biology",
    code: "BIO-710",
    category: "sciences",
    level: "al",
    iconEmoji: "🧬",
    iconBg: "bg-[#D1FAE5]",
    iconBorder: "border-[#A7F3D0]",
    popular: true,
  },
  {
    id: "geology_al",
    name: "Geology",
    code: "GEOL-755",
    category: "sciences",
    level: "al",
    iconEmoji: "🪨",
    iconBg: "bg-[#FEF3C7]",
    iconBorder: "border-[#FDE68A]",
  },
  {
    id: "cs_ict_al",
    name: "Computer Science & ICT",
    code: "CSC-795",
    category: "sciences",
    level: "al",
    iconEmoji: "💻",
    iconBg: "bg-[#E0F2FE]",
    iconBorder: "border-[#BAE6FD]",
    popular: true,
  },

  // Commercial & Social Sciences
  {
    id: "economics_al",
    name: "Economics",
    code: "ECON-725",
    category: "commercial",
    level: "al",
    iconEmoji: "📈",
    iconBg: "bg-[#DCFCE7]",
    iconBorder: "border-[#BBF7D0]",
    popular: true,
  },
  {
    id: "accounting_al",
    name: "Accounting & Finance",
    code: "ACC-705",
    category: "commercial",
    level: "al",
    iconEmoji: "🧮",
    iconBg: "bg-[#FEF3C7]",
    iconBorder: "border-[#FDE68A]",
    popular: true,
  },
  {
    id: "commerce_finance_al",
    name: "Commerce & Business Finance",
    code: "COM-720",
    category: "commercial",
    level: "al",
    iconEmoji: "🏢",
    iconBg: "bg-[#F1F5F9]",
    iconBorder: "border-[#CBD5E1]",
  },
  {
    id: "geography_al",
    name: "Geography",
    code: "GEO-750",
    category: "commercial",
    level: "al",
    iconEmoji: "🌍",
    iconBg: "bg-[#E0F2FE]",
    iconBorder: "border-[#BAE6FD]",
    popular: true,
  },
  {
    id: "history_al",
    name: "History",
    code: "HIST-760",
    category: "commercial",
    level: "al",
    iconEmoji: "📜",
    iconBg: "bg-[#FFF7ED]",
    iconBorder: "border-[#FED7AA]",
    popular: true,
  },

  // Arts, Languages & Humanities
  {
    id: "literature_english_al",
    name: "Literature in English",
    code: "LIT-735",
    category: "arts",
    level: "al",
    iconEmoji: "📚",
    iconBg: "bg-[#FCE7F3]",
    iconBorder: "border-[#FBCFE8]",
    popular: true,
  },
  {
    id: "english_language_al",
    name: "English Language",
    code: "ENG-730",
    category: "arts",
    level: "al",
    iconEmoji: "📖",
    iconBg: "bg-[#FFE4E6]",
    iconBorder: "border-[#FECDD3]",
    popular: true,
  },
  {
    id: "french_al",
    name: "French Language",
    code: "FRE-745",
    category: "arts",
    level: "al",
    iconEmoji: "🇫🇷",
    iconBg: "bg-[#DBEAFE]",
    iconBorder: "border-[#BFDBFE]",
  },
  {
    id: "philosophy_logic_al",
    name: "Philosophy & Logic",
    code: "PHIL-790",
    category: "arts",
    level: "al",
    iconEmoji: "💭",
    iconBg: "bg-[#F3E8FF]",
    iconBorder: "border-[#E9D5FF]",
    popular: true,
  },
  {
    id: "religious_studies_al",
    name: "Religious Studies",
    code: "REL-785",
    category: "arts",
    level: "al",
    iconEmoji: "🕊️",
    iconBg: "bg-[#FEF3C7]",
    iconBorder: "border-[#FDE68A]",
  },
  {
    id: "food_nutrition_al",
    name: "Food Science & Nutrition",
    code: "FSN-740",
    category: "arts",
    level: "al",
    iconEmoji: "🥗",
    iconBg: "bg-[#ECFDF5]",
    iconBorder: "border-[#A7F3D0]",
  },
];

// Unified Master List for search, backwards compatibility, and general lookup
export const CAMEROON_GCE_SUBJECTS: GceSubject[] = [
  ...GCE_AL_SUBJECTS,
  ...GCE_OL_SUBJECTS.filter(
    (ol) => !GCE_AL_SUBJECTS.some((al) => al.id === ol.id)
  ),
];

/**
 * Returns the exact list of Cameroon GCE subjects according to user education level ('ol' | 'al' | 'both')
 */
export function getGceSubjectsForLevel(level: string): GceSubject[] {
  const normalized = (level || "al").toLowerCase();
  if (normalized === "ol" || normalized === "o-level" || normalized === "ordinary") {
    return GCE_OL_SUBJECTS;
  }
  if (normalized === "al" || normalized === "a-level" || normalized === "advanced") {
    return GCE_AL_SUBJECTS;
  }
  // Default to A-Level or combined if ambiguous
  return GCE_AL_SUBJECTS;
}
