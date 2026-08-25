import { EducationalLevel, Subject, Paper, PaginatedPapersResponse, PaperFilterParams } from "@/types/paper";

const API_BASE_URL = "/api/papers";

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
    } catch {
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
    console.warn("Failed to load educational levels from API:", err);
    return [
      { id: "level-ol", code: "O/L", name: "Ordinary Level (GCE O-Level)", sort_order: 1 },
      { id: "level-al", code: "A/L", name: "Advanced Level (GCE A-Level)", sort_order: 2 },
      { id: "level-uni", code: "UNIVERSITY", name: "University Studies", sort_order: 3 },
    ];
  }
}

export async function fetchSubjectsByLevel(levelCodeOrId?: string): Promise<Subject[]> {
  try {
    const url = new URL(`${API_BASE_URL}/subjects`, typeof window !== "undefined" ? window.location.origin : "http://localhost:3000");
    if (levelCodeOrId) {
      url.searchParams.set("level", levelCodeOrId);
    }
    const json = await fetchJson<{ success: boolean; data: Subject[] }>(url.pathname + url.search);
    return json.data || [];
  } catch (err) {
    console.warn("Failed to load subjects from API:", err);
    return [];
  }
}

export async function fetchPapers(params: PaperFilterParams = {}): Promise<PaginatedPapersResponse> {
  try {
    const url = new URL(API_BASE_URL, typeof window !== "undefined" ? window.location.origin : "http://localhost:3000");
    if (params.level) url.searchParams.set("level", params.level);
    if (params.subject) url.searchParams.set("subject", params.subject);
    if (params.year) url.searchParams.set("year", params.year.toString());
    if (params.q) url.searchParams.set("q", params.q);
    if (params.page) url.searchParams.set("page", params.page.toString());
    if (params.limit) url.searchParams.set("limit", params.limit.toString());

    return await fetchJson<PaginatedPapersResponse>(url.pathname + url.search);
  } catch (err: unknown) {
    console.error("Failed to fetch papers:", err);
    throw err;
  }
}

export async function fetchPaperById(id: string): Promise<Paper | null> {
  try {
    const json = await fetchJson<{ success: boolean; data: Paper }>(`${API_BASE_URL}/${id}`);
    return json.data || null;
  } catch (err) {
    console.error(`Failed to fetch paper by ID ${id}:`, err);
    return null;
  }
}

export async function getPaperDownloadUrl(paperId: string): Promise<{ download_url: string; expires_in: number; paper?: Paper }> {
  try {
    const json = await fetchJson<{ success: boolean; data: { download_url: string; expires_in: number; paper?: Paper } }>(
      `${API_BASE_URL}/${paperId}/download`
    );
    return json.data;
  } catch (err) {
    console.warn("Download endpoint warning:", err);
    return {
      download_url: `/api/papers/${paperId}/download`,
      expires_in: 3600,
    };
  }
}
