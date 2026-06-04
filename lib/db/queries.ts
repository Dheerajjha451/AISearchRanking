import { createClient } from '@/lib/supabase/server';
import type { DbQuery } from '@/lib/types';

/** Fetch all queries */
export async function getQueries(): Promise<DbQuery[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('queries')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(`Failed to fetch queries: ${error.message}`);
  return data ?? [];
}

/** Create a new query */
export async function createQuery(
  label: string,
  searchText: string
): Promise<DbQuery> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('queries')
    .insert({ label, search_text: searchText })
    .select()
    .single();

  if (error) throw new Error(`Failed to create query: ${error.message}`);
  return data;
}

/** Delete a query by ID */
export async function deleteQuery(queryId: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('queries')
    .delete()
    .eq('id', queryId);

  if (error) throw new Error(`Failed to delete query: ${error.message}`);
}
