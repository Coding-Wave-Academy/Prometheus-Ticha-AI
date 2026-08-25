import { useState, useEffect, useCallback } from "react";
import { EducationalLevel, Subject, Paper, PaperFilterParams } from "@/types/paper";
import { fetchEducationalLevels, fetchSubjectsByLevel, fetchPapers, getPaperDownloadUrl } from "@/lib/api/papers";

export function usePapers() {
  const [levels, setLevels] = useState<EducationalLevel[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [papers, setPapers] = useState<Paper[]>([]);

  const [activeLevel, setActiveLevel] = useState<string>("O/L");
  const [activeSubject, setActiveSubject] = useState<string>("");
  const [activeYear, setActiveYear] = useState<number | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(12);
  const [totalPapers, setTotalPapers] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);

  const [loading, setLoading] = useState<boolean>(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 1. Initial load of Educational Levels
  useEffect(() => {
    let isMounted = true;
    fetchEducationalLevels()
      .then((data) => {
        if (isMounted) {
          setLevels(data);
          setActiveLevel((curr) => (!curr && data.length > 0 ? data[0].code : curr));
        }
      })
      .catch((err) => {
        if (isMounted) console.error("Error loading educational levels:", err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Load Subjects when activeLevel changes
  useEffect(() => {
    let isMounted = true;
    fetchSubjectsByLevel(activeLevel)
      .then((data) => {
        if (isMounted) {
          setSubjects(data);
        }
      })
      .catch((err) => {
        if (isMounted) console.error("Error loading subjects:", err);
      });

    return () => {
      isMounted = false;
    };
  }, [activeLevel]);

  // 3. Fetch Papers matching current filters
  const loadPapers = useCallback(async () => {
    setLoading(true);
    setError(null);

    const filterParams: PaperFilterParams = {
      level: activeLevel || undefined,
      subject: activeSubject || undefined,
      year: activeYear || undefined,
      q: searchQuery.trim() || undefined,
      page,
      limit,
    };

    try {
      const response = await fetchPapers(filterParams);
      setPapers(response.data || []);
      setTotalPapers(response.meta?.total || 0);
      setTotalPages(response.meta?.totalPages || 1);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load past papers");
    } finally {
      setLoading(false);
    }
  }, [activeLevel, activeSubject, activeYear, searchQuery, page, limit]);

  useEffect(() => {
    loadPapers();
  }, [loadPapers]);

  // Handler helpers
  const handleLevelChange = (levelCode: string) => {
    setActiveLevel(levelCode);
    setActiveSubject(""); // Reset subject when level changes
    setPage(1);
  };

  const handleSubjectChange = (subjectCode: string) => {
    setActiveSubject(subjectCode === activeSubject ? "" : subjectCode);
    setPage(1);
  };

  const handleYearChange = (year?: number) => {
    setActiveYear(year);
    setPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setPage(1);
  };

  const clearFilters = () => {
    setActiveSubject("");
    setActiveYear(undefined);
    setSearchQuery("");
    setPage(1);
  };

  const handleDownload = async (paperId: string) => {
    setDownloadingId(paperId);
    try {
      const result = await getPaperDownloadUrl(paperId);

      // Increment local count optimistically
      setPapers((prev) =>
        prev.map((p) => (p.id === paperId ? { ...p, downloads_count: p.downloads_count + 1 } : p))
      );

      // Open signed URL or download trigger
      if (typeof window !== "undefined" && result.download_url) {
        window.open(result.download_url, "_blank", "noopener,noreferrer");
      }
    } catch (err) {
      console.error("Failed to download paper:", err);
    } finally {
      setDownloadingId(null);
    }
  };

  return {
    levels,
    subjects,
    papers,
    loading,
    downloadingId,
    error,
    activeLevel,
    activeSubject,
    activeYear,
    searchQuery,
    page,
    totalPages,
    totalPapers,
    setPage,
    handleLevelChange,
    handleSubjectChange,
    handleYearChange,
    handleSearchChange,
    clearFilters,
    handleDownload,
    reload: loadPapers,
  };
}
