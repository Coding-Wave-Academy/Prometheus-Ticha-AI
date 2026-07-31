import { EducationalLevel, Subject, Paper, PaginatedPapersResponse, PaperFilterParams } from "@/types/paper";

const API_BASE_URL = (process.env.NEXT_PUBLIC_PAST_PAPER_API_URL || "http://localhost:4000/api/v1").replace(/\/$/, "");

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    let errorMessage = `API request failed with status ${res.status}`;
    try {
      const errorJson = await res.json();
      if (errorJson?.error?.message) {
        errorMessage = errorJson.error.message;
      }
    } catch (e) {
      // fallback to default error message
    }
    throw new Error(errorMessage);
  }

  return res.json();
}

export async function fetchEducationalLevels(): Promise<EducationalLevel[]> {
  try {
    const json = await fetchJson<{ success: boolean; data: EducationalLevel[] }>(`${API_BASE_URL}/levels`);
    return json.data || [];
  } catch (err) {
    console.warn("Falling back to local levels mock:", err);
    return [
      { id: "1", code: "O/L", name: "Ordinary Level (GCE O-Level)", sort_order: 1 },
      { id: "2", code: "A/L", name: "Advanced Level (GCE A-Level)", sort_order: 2 },
      { id: "3", code: "UNIVERSITY", name: "University Studies", sort_order: 3 },
    ];
  }
}

export async function fetchSubjectsByLevel(levelCodeOrId?: string): Promise<Subject[]> {
  try {
    const url = new URL(`${API_BASE_URL}/subjects`);
    if (levelCodeOrId) {
      url.searchParams.set("level", levelCodeOrId);
    }
    const json = await fetchJson<{ success: boolean; data: Subject[] }>(url.toString());
    return json.data || [];
  } catch (err) {
    console.warn("Falling back to local subjects mock:", err);
    return [
      { id: "sub-1", code: "MATH-OL", name: "Mathematics", is_active: true },
      { id: "sub-2", code: "ENG-OL", name: "English Language", is_active: true },
      { id: "sub-3", code: "PHYS-AL", name: "Physics", is_active: true },
      { id: "sub-4", code: "CHEM-AL", name: "Chemistry", is_active: true },
    ];
  }
}

export async function fetchPapers(params: PaperFilterParams = {}): Promise<PaginatedPapersResponse> {
  try {
    const url = new URL(`${API_BASE_URL}/papers`);
    if (params.level) url.searchParams.set("level", params.level);
    if (params.subject) url.searchParams.set("subject", params.subject);
    if (params.year) url.searchParams.set("year", params.year.toString());
    if (params.q) url.searchParams.set("q", params.q);
    if (params.page) url.searchParams.set("page", params.page.toString());
    if (params.limit) url.searchParams.set("limit", params.limit.toString());

    return await fetchJson<PaginatedPapersResponse>(url.toString());
  } catch (err) {
    console.warn("Falling back to local papers mock payload:", err);
    return {
      success: true,
      data: [
        {
          id: "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
          title: "GCE O-Level Mathematics Paper 1",
          year: 2023,
          exam_session: "June",
          description: "Official GCE Ordinary Level Mathematics Paper 1 with detailed solution key.",
          file_path: "ol/math/2023_june_paper1.pdf",
          file_size: 2450000,
          file_type: "application/pdf",
          downloads_count: 124,
          is_active: true,
          created_at: new Date().toISOString(),
          subject: { id: "sub-1", name: "Mathematics", code: "MATH-OL" },
          level: { id: "1", name: "Ordinary Level (GCE O-Level)", code: "O/L" },
        },
        {
          id: "b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e",
          title: "GCE O-Level Mathematics Paper 2",
          year: 2023,
          exam_session: "June",
          description: "Official GCE Ordinary Level Mathematics Paper 2 comprehensive problem solving.",
          file_path: "ol/math/2023_june_paper2.pdf",
          file_size: 3120000,
          file_type: "application/pdf",
          downloads_count: 98,
          is_active: true,
          created_at: new Date().toISOString(),
          subject: { id: "sub-1", name: "Mathematics", code: "MATH-OL" },
          level: { id: "1", name: "Ordinary Level (GCE O-Level)", code: "O/L" },
        },
        {
          id: "c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f",
          title: "GCE A-Level Physics Paper 1 (MCQ & Structured)",
          year: 2023,
          exam_session: "June",
          description: "Advanced Level Physics Paper 1 covering Mechanics and Electromagnetism.",
          file_path: "al/physics/2023_june_paper1.pdf",
          file_size: 4150000,
          file_type: "application/pdf",
          downloads_count: 342,
          is_active: true,
          created_at: new Date().toISOString(),
          subject: { id: "sub-3", name: "Physics", code: "PHYS-AL" },
          level: { id: "2", name: "Advanced Level (GCE A-Level)", code: "A/L" },
        },
      ],
      meta: {
        page: params.page || 1,
        limit: params.limit || 20,
        total: 3,
        totalPages: 1,
      },
    };
  }
}

export async function fetchPaperById(id: string): Promise<Paper | null> {
  try {
    const json = await fetchJson<{ success: boolean; data: Paper }>(`${API_BASE_URL}/papers/${id}`);
    return json.data || null;
  } catch (err) {
    console.error(`Failed to fetch paper by ID ${id}:`, err);
    return null;
  }
}

export async function getPaperDownloadUrl(paperId: string): Promise<{ download_url: string; expires_in: number; paper?: Paper }> {
  try {
    const json = await fetchJson<{ success: boolean; data: { download_url: string; expires_in: number; paper: Paper } }>(
      `${API_BASE_URL}/papers/${paperId}/download?redirect=false`
    );
    return json.data;
  } catch (err) {
    console.warn("Direct API download endpoint fallback:", err);
    return {
      download_url: `${API_BASE_URL}/papers/${paperId}/download`,
      expires_in: 60,
    };
  }
}
