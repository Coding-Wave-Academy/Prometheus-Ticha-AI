import { supabase } from '../config/supabase.js';

const MOCK_LEVELS = [
  { id: '11111111-1111-1111-1111-111111111111', code: 'O/L', name: 'Ordinary Level (GCE O-Level)', sort_order: 1 },
  { id: '22222222-2222-2222-2222-222222222222', code: 'A/L', name: 'Advanced Level (GCE A-Level)', sort_order: 2 },
  { id: '33333333-3333-3333-3333-333333333333', code: 'UNIVERSITY', name: 'University Undergraduate Studies', sort_order: 3 },
];

export async function getAllLevels() {
  try {
    const { data, error } = await supabase
      .from('educational_levels')
      .select('id, code, name, sort_order')
      .order('sort_order', { ascending: true });

    if (error) {
      console.warn('⚠️ Supabase fetch warning for educational_levels (using dev fallback):', error.message);
      return MOCK_LEVELS;
    }

    return (data && data.length > 0) ? data : MOCK_LEVELS;
  } catch (err) {
    console.warn('⚠️ Exception fetching educational_levels (using dev fallback):', err.message);
    return MOCK_LEVELS;
  }
}
