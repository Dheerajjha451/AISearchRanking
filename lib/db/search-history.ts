import { createAdminClient } from '@/lib/supabase/server';
import type { SearchHistory } from '@/lib/types';

export async function getSearchHistory(limit = 100): Promise<SearchHistory[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('search_history')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw new Error(`Failed to fetch search history: ${error.message}`);
  return (data ?? []) as SearchHistory[];
}
