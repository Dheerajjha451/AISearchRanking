import { createClient } from '@/lib/supabase/server';
import type { DbRun, RunStatus } from '@/lib/types';

/** Create a new run */
export async function createRun(): Promise<DbRun> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('runs')
    .insert({ status: 'pending' as RunStatus })
    .select()
    .single();

  if (error) throw new Error(`Failed to create run: ${error.message}`);
  return data;
}

/** Update the status of a run */
export async function updateRunStatus(
  runId: string,
  status: RunStatus
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('runs')
    .update({ status })
    .eq('id', runId);

  if (error) throw new Error(`Failed to update run status: ${error.message}`);
}

/** Fetch recent runs */
export async function getRecentRuns(limit = 30): Promise<DbRun[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('runs')
    .select('*')
    .order('run_at', { ascending: false })
    .limit(limit);

  if (error) throw new Error(`Failed to fetch runs: ${error.message}`);
  return data ?? [];
}
