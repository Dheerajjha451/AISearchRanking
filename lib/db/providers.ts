import { createClient } from '@/lib/supabase/server';
import type { DbProvider } from '@/lib/types';

/** Fetch all providers from the seeded providers table */
export async function getProviders(): Promise<DbProvider[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('providers')
    .select('*')
    .order('name');

  if (error) throw new Error(`Failed to fetch providers: ${error.message}`);
  return data ?? [];
}

/** Get a single provider by name */
export async function getProviderByName(name: string): Promise<DbProvider | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('providers')
    .select('*')
    .eq('name', name)
    .single();

  if (error) return null;
  return data;
}
