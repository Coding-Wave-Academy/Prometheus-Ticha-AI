import { supabase } from '../config/supabase.js';
import { hashApiKey } from '../utils/crypto.js';

export async function getApiClientByKey(apiKey) {
  if (!apiKey) return null;

  const keyHash = hashApiKey(apiKey);

  try {
    const { data, error } = await supabase
      .from('api_clients')
      .select('id, name, tier, is_active')
      .eq('api_key_hash', keyHash)
      .single();

    if (error || !data || !data.is_active) {
      return null;
    }

    return data;
  } catch (err) {
    console.error('Error fetching API client:', err);
    return null;
  }
}
