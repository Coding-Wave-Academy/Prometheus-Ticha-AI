export interface TopicItem {
  id: string;
  title: string;
  subtitle: string;
  order: number;
}

export interface TopicCategory {
  categoryName: string;
  topics: TopicItem[];
}

export interface SubjectSyllabus {
  id: string;
  name: string;
  code: string;
  category: "Sciences" | "Mathematics" | "Technology" | "Arts & Humanities" | "Commercial";
  level: "al" | "ol"; // A-Level vs O-Level
  bgColor: string;
  categories: TopicCategory[];
}

export const GCE_SYLLABUS_DATA: Record<string, SubjectSyllabus> = {
  physics: {
    id: "physics",
    name: "Physics",
    code: "PHY770",
    category: "Sciences",
    level: "al",
    bgColor: "bg-[#FFB040]",
    categories: [
      {
        categoryName: "Module 1: Mechanics & Motion",
        topics: [
          { id: "phy-1", title: "Kinematics & Linear Motion", subtitle: "Displacement, velocity, acceleration, and equations of motion", order: 1 },
          { id: "phy-2", title: "Dynamics & Newton's Laws", subtitle: "Force, mass, momentum, and impulse", order: 2 },
          { id: "phy-3", title: "Work, Energy & Power", subtitle: "Kinetic, potential energy, and mechanical efficiency", order: 3 },
          { id: "phy-4", title: "Circular Motion & Gravitation", subtitle: "Centripetal acceleration and Newton's law of gravitation", order: 4 },
        ],
      },
      {
        categoryName: "Module 2: Waves & Electricity",
        topics: [
          { id: "phy-5", title: "Wave Motion & Superposition", subtitle: "Transverse, longitudinal waves, and interference", order: 5 },
          { id: "phy-6", title: "Electric Fields & Potential", subtitle: "Coulomb's law, electric field strength, and potential", order: 6 },
          { id: "phy-7", title: "Current Electricity & DC Circuits", subtitle: "Ohm's law, Kirchhoff's laws, and potential dividers", order: 7 },
        ],
      },
      {
        categoryName: "Module 3: Fields & Modern Physics",
        topics: [
          { id: "phy-8", title: "Magnetic Fields & Induction", subtitle: "Magnetic flux, Faraday's law, and Lenz's law", order: 8 },
          { id: "phy-9", title: "Quantum Physics & Photoelectric Effect", subtitle: "Photon energy, work function, and de Broglie wavelength", order: 9 },
          { id: "phy-10", title: "Nuclear Physics & Radioactivity", subtitle: "Alpha, beta, gamma decay, and half-life calculations", order: 10 },
        ],
      },
    ],
  },
  math: {
    id: "math",
    name: "Pure Mathematics",
    code: "PMA775",
    category: "Mathematics",
    level: "al",
    bgColor: "bg-[#B6FF00]",
    categories: [
      {
        categoryName: "Module 1: Algebra & Trigonometry",
        topics: [
          { id: "math-1", title: "Polynomials & Quadratics", subtitle: "Roots, discriminant, and factor theorem", order: 1 },
          { id: "math-2", title: "Logarithms & Exponentials", subtitle: "Logarithmic laws and solving exponential equations", order: 2 },
          { id: "math-3", title: "Sequences & Series", subtitle: "Arithmetic and Geometric progressions (AP & GP)", order: 3 },
          { id: "math-4", title: "Trigonometric Identities & Equations", subtitle: "Sine, cosine rules, compound angles, and double angle formulas", order: 4 },
        ],
      },
      {
        categoryName: "Module 2: Differential & Integral Calculus",
        topics: [
          { id: "math-5", title: "Limits & First Principles", subtitle: "Definition of derivative via limit processes", order: 5 },
          { id: "math-6", title: "Differentiation Rules", subtitle: "Product, quotient, and chain rules", order: 6 },
          { id: "math-7", title: "Applications of Derivatives", subtitle: "Tangents, normals, and turning points (maxima/minima)", order: 7 },
          { id: "math-8", title: "Integration Techniques", subtitle: "Integration by substitution, parts, and partial fractions", order: 8 },
        ],
      },
      {
        categoryName: "Module 3: Geometry & Vectors",
        topics: [
          { id: "math-9", title: "Coordinate Geometry of Circles", subtitle: "Circle equations, tangents, and intersections", order: 9 },
          { id: "math-10", title: "Vectors in 2D & 3D", subtitle: "Vector addition, scalar product, and line equations", order: 10 },
        ],
      },
    ],
  },
  ict: {
    id: "ict",
    name: "ICT & Computing",
    code: "ICT795",
    category: "Technology",
    level: "al",
    bgColor: "bg-[#FFDF9E]",
    categories: [
      {
        categoryName: "Module 1: Data Representation & Hardware",
        topics: [
          { id: "ict-1", title: "Binary & Hexadecimal Systems", subtitle: "Number conversions, Two's complement, and ASCII/Unicode", order: 1 },
          { id: "ict-2", title: "Computer Architecture & Hardware", subtitle: "CPU components, Von Neumann architecture, and memory", order: 2 },
          { id: "ict-3", title: "Networking & Internet Protocols", subtitle: "Topologies, OSI model, IP addressing, and routers", order: 3 },
        ],
      },
      {
        categoryName: "Module 2: Databases & Software Development",
        topics: [
          { id: "ict-4", title: "Relational Database Concepts", subtitle: "Entities, attributes, primary keys, and foreign keys", order: 4 },
          { id: "ict-5", title: "Database Normalization (1NF to 3NF)", subtitle: "Eliminating repeating groups and functional dependencies", order: 5 },
          { id: "ict-6", title: "SQL & Data Manipulation", subtitle: "SELECT, INSERT, UPDATE, DELETE, and JOIN operations", order: 6 },
          { id: "ict-7", title: "System Development Life Cycle (SDLC)", subtitle: "Analysis, design, testing, implementation, and maintenance", order: 7 },
        ],
      },
      {
        categoryName: "Module 3: Security & Logic",
        topics: [
          { id: "ict-8", title: "Cybersecurity & Encryption", subtitle: "Symmetric, asymmetric encryption, firewalls, and malware", order: 8 },
          { id: "ict-9", title: "Boolean Logic & Truth Tables", subtitle: "AND, OR, NOT, NAND, NOR, and XOR logic gates", order: 9 },
        ],
      },
    ],
  },
  chemistry: {
    id: "chemistry",
    name: "Chemistry",
    code: "CHE715",
    category: "Sciences",
    level: "al",
    bgColor: "bg-[#FFD9E0]",
    categories: [
      {
        categoryName: "Module 1: Physical Chemistry",
        topics: [
          { id: "che-1", title: "Atomic Structure & Isotopes", subtitle: "Subatomic particles, s/p/d orbitals, and mass spectrometry", order: 1 },
          { id: "che-2", title: "Chemical Bonding & Shapes", subtitle: "Ionic, covalent, metallic bonding, and VSEPR theory", order: 2 },
          { id: "che-3", title: "Energetics & Thermochemistry", subtitle: "Enthalpy changes, Hess's law, and bond energies", order: 3 },
          { id: "che-4", title: "Reaction Kinetics & Equilibrium", subtitle: "Rate equations, catalysts, and Le Chatelier's principle", order: 4 },
        ],
      },
      {
        categoryName: "Module 2: Organic Chemistry",
        topics: [
          { id: "che-5", title: "Alkanes, Alkenes & Haloalkanes", subtitle: "Nomenclature, isomerism, and addition reactions", order: 5 },
          { id: "che-6", title: "Reaction Mechanisms", subtitle: "Nucleophilic substitution and electrophilic addition", order: 6 },
        ],
      },
    ],
  },
  biology: {
    id: "biology",
    name: "Biology",
    code: "BIO710",
    category: "Sciences",
    level: "al",
    bgColor: "bg-[#C8F7C5]",
    categories: [
      {
        categoryName: "Module 1: Cell Biology & Biochemistry",
        topics: [
          { id: "bio-1", title: "Cell Structure & Organelles", subtitle: "Eukaryotic vs prokaryotic cells and electron microscopy", order: 1 },
          { id: "bio-2", title: "Biological Molecules & Enzymes", subtitle: "Carbohydrates, lipids, proteins, and enzyme kinetics", order: 2 },
          { id: "bio-3", title: "Cell Transport Mechanisms", subtitle: "Active transport, diffusion, osmosis, and endocytosis", order: 3 },
        ],
      },
      {
        categoryName: "Module 2: Genetics & Physiology",
        topics: [
          { id: "bio-4", title: "DNA Replication & Protein Synthesis", subtitle: "Transcription, translation, and genetic code", order: 4 },
          { id: "bio-5", title: "Photosynthesis & Respiration", subtitle: "Light reactions, Calvin cycle, and ATP synthesis", order: 5 },
        ],
      },
    ],
  },
  furthermath: {
    id: "furthermath",
    name: "Further Mathematics",
    code: "FMA778",
    category: "Mathematics",
    level: "al",
    bgColor: "bg-[#D3E2FF]",
    categories: [
      {
        categoryName: "Module 1: Complex Numbers & Matrices",
        topics: [
          { id: "fma-1", title: "Complex Numbers & Argand Diagrams", subtitle: "Modulus-argument form, de Moivre's theorem", order: 1 },
          { id: "fma-2", title: "Matrix Transformations & Determinants", subtitle: "2x2 and 3x3 matrices, inverses, and eigenvalues", order: 2 },
        ],
      },
    ],
  },
  french: {
    id: "french",
    name: "French Language",
    code: "FRE745",
    category: "Arts & Humanities",
    level: "al",
    bgColor: "bg-[#A8FFD3]",
    categories: [
      {
        categoryName: "Module 1: Expression & Grammar",
        topics: [
          { id: "fre-1", title: "Grammar & Verb Conjugations", subtitle: "Subjonctif, conditionnel, and complex tenses", order: 1 },
          { id: "fre-2", title: "Expression Écrite & Essay Writing", subtitle: "Structuring argumentative essays in French", order: 2 },
        ],
      },
    ],
  },
};

// All available subjects by education level for adding subjects
export const ALL_AVAILABLE_SUBJECTS = [
  { id: "physics", name: "Physics", category: "Sciences", level: "al", bgColor: "bg-[#FFB040]" },
  { id: "math", name: "Pure Mathematics", category: "Mathematics", level: "al", bgColor: "bg-[#B6FF00]" },
  { id: "ict", name: "ICT & Computing", category: "Technology", level: "al", bgColor: "bg-[#FFDF9E]" },
  { id: "chemistry", name: "Chemistry", category: "Sciences", level: "al", bgColor: "bg-[#FFD9E0]" },
  { id: "biology", name: "Biology", category: "Sciences", level: "al", bgColor: "bg-[#C8F7C5]" },
  { id: "furthermath", name: "Further Mathematics", category: "Mathematics", level: "al", bgColor: "bg-[#D3E2FF]" },
  { id: "french", name: "French Language", category: "Arts & Humanities", level: "al", bgColor: "bg-[#A8FFD3]" },
  { id: "economics", name: "Economics", category: "Commercial", level: "al", bgColor: "bg-[#FFD9E0]" },
  { id: "geography", name: "Geography", category: "Arts & Humanities", level: "ol", bgColor: "bg-[#C8F7C5]" },
];
