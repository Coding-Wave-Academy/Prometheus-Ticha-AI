export interface EducationalLevel {
  id: string;
  code: 'O/L' | 'A/L' | 'UNIVERSITY';
  name: string;
  sort_order: number;
  created_at?: string;
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  is_active: boolean;
  level?: EducationalLevel;
  created_at?: string;
}

export interface Paper {
  id: string;
  title: string;
  year: number;
  exam_session?: string | null;
  description?: string | null;
  file_path: string;
  file_size: number;
  file_type: string;
  downloads_count: number;
  is_active: boolean;
  created_at: string;
  subject: {
    id: string;
    name: string;
    code: string;
  };
  level: {
    id: string;
    name: string;
    code: string;
  };
}

export interface PaginatedPapersResponse {
  success: boolean;
  data: Paper[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PaperFilterParams {
  level?: string;
  subject?: string;
  year?: number;
  q?: string;
  page?: number;
  limit?: number;
}
