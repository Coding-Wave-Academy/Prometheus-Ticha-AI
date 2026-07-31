import { supabase } from '../config/supabase.js';

const MOCK_SUBJECTS = [
  { id: 'sub-1', code: 'MATH-OL', name: 'Mathematics', is_active: true, level: { id: '11111111-1111-1111-1111-111111111111', code: 'O/L', name: 'Ordinary Level (GCE O-Level)' } },
  { id: 'sub-2', code: 'ENG-OL', name: 'English Language', is_active: true, level: { id: '11111111-1111-1111-1111-111111111111', code: 'O/L', name: 'Ordinary Level (GCE O-Level)' } },
  { id: 'sub-3', code: 'PHYS-AL', name: 'Physics', is_active: true, level: { id: '22222222-2222-2222-2222-222222222222', code: 'A/L', name: 'Advanced Level (GCE A-Level)' } },
  { id: 'sub-4', code: 'CHEM-AL', name: 'Chemistry', is_active: true, level: { id: '22222222-2222-2222-2222-222222222222', code: 'A/L', name: 'Advanced Level (GCE A-Level)' } },
  { id: 'sub-5', code: 'CS-201', name: 'Data Structures & Algorithms', is_active: true, level: { id: '33333333-3333-3333-3333-333333333333', code: 'UNIVERSITY', name: 'University Undergraduate Studies' } },
];

export async function getSubjectsByLevel(levelCodeOrId) {
  try {
    let query = supabase
      .from('subjects')
      .select(`
        id,
        code,
        name,
        is_active,
        level_id,
        educational_levels!inner (
          id,
          code,
          name
        )
      `)
      .eq('is_active', true)
      .order('name', { ascending: true });

    if (levelCodeOrId) {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(levelCodeOrId);
      if (isUuid) {
        query = query.eq('level_id', levelCodeOrId);
      } else {
        query = query.ilike('educational_levels.code', levelCodeOrId);
      }
    }

    const { data, error } = await query;

    if (error) {
      console.warn('⚠️ Supabase fetch warning for subjects (using dev fallback):', error.message);
      return filterMockSubjects(levelCodeOrId);
    }

    if (!data || data.length === 0) {
      return filterMockSubjects(levelCodeOrId);
    }

    return data.map((sub) => ({
      id: sub.id,
      code: sub.code,
      name: sub.name,
      is_active: sub.is_active,
      level: {
        id: sub.educational_levels.id,
        code: sub.educational_levels.code,
        name: sub.educational_levels.name,
      },
    }));
  } catch (err) {
    console.warn('⚠️ Exception fetching subjects (using dev fallback):', err.message);
    return filterMockSubjects(levelCodeOrId);
  }
}

function filterMockSubjects(levelCodeOrId) {
  if (!levelCodeOrId) return MOCK_SUBJECTS;
  const searchStr = levelCodeOrId.toLowerCase();
  return MOCK_SUBJECTS.filter((s) => 
    s.level.code.toLowerCase() === searchStr || 
    s.level.id.toLowerCase() === searchStr
  );
}
