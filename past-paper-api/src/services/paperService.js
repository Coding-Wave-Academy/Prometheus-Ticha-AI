import { supabase } from '../config/supabase.js';
import { env } from '../config/env.js';

const MOCK_PAPERS = [
  {
    id: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    title: 'GCE O-Level Mathematics Paper 1',
    year: 2023,
    exam_session: 'June',
    description: 'Official GCE Ordinary Level Mathematics Paper 1 with detailed solution key.',
    file_path: 'ol/math/2023_june_paper1.pdf',
    file_size: 2450000,
    file_type: 'application/pdf',
    downloads_count: 124,
    is_active: true,
    created_at: new Date().toISOString(),
    subject: { id: 'sub-1', name: 'Mathematics', code: 'MATH-OL' },
    level: { id: '11111111-1111-1111-1111-111111111111', name: 'Ordinary Level (GCE O-Level)', code: 'O/L' },
  },
  {
    id: 'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
    title: 'GCE O-Level Mathematics Paper 2',
    year: 2023,
    exam_session: 'June',
    description: 'Official GCE Ordinary Level Mathematics Paper 2 comprehensive problem solving.',
    file_path: 'ol/math/2023_june_paper2.pdf',
    file_size: 3120000,
    file_type: 'application/pdf',
    downloads_count: 98,
    is_active: true,
    created_at: new Date().toISOString(),
    subject: { id: 'sub-1', name: 'Mathematics', code: 'MATH-OL' },
    level: { id: '11111111-1111-1111-1111-111111111111', name: 'Ordinary Level (GCE O-Level)', code: 'O/L' },
  },
  {
    id: 'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f',
    title: 'GCE A-Level Physics Paper 1 (MCQ & Structured)',
    year: 2023,
    exam_session: 'June',
    description: 'Advanced Level Physics Paper 1 covering Mechanics and Electromagnetism.',
    file_path: 'al/physics/2023_june_paper1.pdf',
    file_size: 4150000,
    file_type: 'application/pdf',
    downloads_count: 342,
    is_active: true,
    created_at: new Date().toISOString(),
    subject: { id: 'sub-3', name: 'Physics', code: 'PHYS-AL' },
    level: { id: '22222222-2222-2222-2222-222222222222', name: 'Advanced Level (GCE A-Level)', code: 'A/L' },
  },
];

export async function getPapers({ level, subject, year, q, page = 1, limit = 20 }) {
  try {
    const fromIndex = (page - 1) * limit;
    const toIndex = fromIndex + limit - 1;

    let query = supabase
      .from('papers')
      .select(`
        id,
        title,
        year,
        exam_session,
        description,
        file_path,
        file_size,
        file_type,
        downloads_count,
        is_active,
        created_at,
        subjects!inner (
          id,
          name,
          code
        ),
        educational_levels!inner (
          id,
          name,
          code
        )
      `, { count: 'exact' })
      .eq('is_active', true)
      .order('year', { ascending: false })
      .order('created_at', { ascending: false });

    if (level) {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(level);
      if (isUuid) {
        query = query.eq('level_id', level);
      } else {
        query = query.ilike('educational_levels.code', level);
      }
    }

    if (subject) {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(subject);
      if (isUuid) {
        query = query.eq('subject_id', subject);
      } else {
        query = query.or(`code.ilike.${subject},name.ilike.%${subject}%`, { foreignTable: 'subjects' });
      }
    }

    if (year) {
      query = query.eq('year', year);
    }

    if (q && q.trim()) {
      query = query.textSearch('fts', q.trim(), { config: 'english', type: 'websearch' });
    }

    query = query.range(fromIndex, toIndex);

    const { data, count, error } = await query;

    if (error) {
      console.warn('⚠️ Supabase fetch warning for papers (using dev fallback):', error.message);
      return filterMockPapers({ level, subject, year, q, page, limit });
    }

    if (!data || data.length === 0) {
      return filterMockPapers({ level, subject, year, q, page, limit });
    }

    return {
      papers: data.map(formatPaperObject),
      total: count || data.length,
      page,
      limit,
    };
  } catch (err) {
    console.warn('⚠️ Exception fetching papers (using dev fallback):', err.message);
    return filterMockPapers({ level, subject, year, q, page, limit });
  }
}

export async function getPaperById(id) {
  try {
    const { data, error } = await supabase
      .from('papers')
      .select(`
        id, title, year, exam_session, description, file_path, file_size, file_type, downloads_count, is_active, created_at,
        subjects!inner ( id, name, code ),
        educational_levels!inner ( id, name, code )
      `)
      .eq('id', id)
      .eq('is_active', true)
      .single();

    if (error || !data) {
      const mock = MOCK_PAPERS.find((p) => p.id === id);
      return mock || null;
    }

    return formatPaperObject(data);
  } catch (err) {
    const mock = MOCK_PAPERS.find((p) => p.id === id);
    return mock || null;
  }
}

export async function incrementDownloadAndGetSignedUrl(paperId, clientInfo = {}) {
  const paper = await getPaperById(paperId);
  if (!paper) {
    return null;
  }

  const newCount = (paper.downloads_count || 0) + 1;

  try {
    await supabase.from('papers').update({ downloads_count: newCount }).eq('id', paperId);
  } catch (e) {
    // Ignore db write error if table doesn't exist yet
  }

  try {
    await supabase.from('download_events').insert({
      paper_id: paperId,
      client_id: clientInfo.client_id || null,
      ip_address: clientInfo.ip_address || null,
      user_agent: clientInfo.user_agent || null,
    });
  } catch (e) {
    // Ignore logging error
  }

  const bucket = env.SUPABASE_STORAGE_BUCKET;
  const expiresIn = env.SIGNED_URL_EXPIRES_IN;

  let downloadUrl;
  try {
    const { data: signedData } = await supabase.storage
      .from(bucket)
      .createSignedUrl(paper.file_path, expiresIn);

    if (signedData?.signedUrl) {
      downloadUrl = signedData.signedUrl;
    } else {
      downloadUrl = `${env.SUPABASE_URL}/storage/v1/object/public/${bucket}/${paper.file_path}`;
    }
  } catch (err) {
    downloadUrl = `${env.SUPABASE_URL}/storage/v1/object/public/${bucket}/${paper.file_path}`;
  }

  return {
    download_url: downloadUrl,
    expires_in: expiresIn,
    paper: {
      ...paper,
      downloads_count: newCount,
    },
  };
}

function filterMockPapers({ level, subject, year, q, page = 1, limit = 20 }) {
  let list = [...MOCK_PAPERS];

  if (level) {
    const lvlStr = level.toLowerCase();
    list = list.filter((p) => p.level.code.toLowerCase() === lvlStr || p.level.id.toLowerCase() === lvlStr);
  }
  if (subject) {
    const subStr = subject.toLowerCase();
    list = list.filter((p) => p.subject.code.toLowerCase() === subStr || p.subject.name.toLowerCase().includes(subStr));
  }
  if (year) {
    list = list.filter((p) => p.year === year);
  }
  if (q && q.trim()) {
    const queryStr = q.trim().toLowerCase();
    list = list.filter((p) => p.title.toLowerCase().includes(queryStr) || p.description.toLowerCase().includes(queryStr));
  }

  const total = list.length;
  const start = (page - 1) * limit;
  const paginated = list.slice(start, start + limit);

  return {
    papers: paginated,
    total,
    page,
    limit,
  };
}

function formatPaperObject(paper) {
  return {
    id: paper.id,
    title: paper.title,
    year: paper.year,
    exam_session: paper.exam_session,
    description: paper.description,
    file_path: paper.file_path,
    file_size: Number(paper.file_size || 0),
    file_type: paper.file_type,
    downloads_count: paper.downloads_count,
    is_active: paper.is_active,
    created_at: paper.created_at,
    subject: {
      id: paper.subjects?.id || paper.subject?.id,
      name: paper.subjects?.name || paper.subject?.name,
      code: paper.subjects?.code || paper.subject?.code,
    },
    level: {
      id: paper.educational_levels?.id || paper.level?.id,
      name: paper.educational_levels?.name || paper.level?.name,
      code: paper.educational_levels?.code || paper.level?.code,
    },
  };
}
