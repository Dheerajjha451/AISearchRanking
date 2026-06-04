import { createClient } from '@/lib/supabase/server';
import type { DbResult, ResultWithMeta } from '@/lib/types';

/** Insert a single result row */
export async function insertResult(result: {
  run_id: string;
  product_id: string;
  query_id: string;
  provider_id: string;
  appears: boolean;
  rank: number | null;
  url: string | null;
  raw_payload: unknown;
}): Promise<DbResult> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('results')
    .insert(result)
    .select()
    .single();

  if (error) throw new Error(`Failed to insert result: ${error.message}`);
  return data;
}

/**
 * Fetch recent results for a product + query combination,
 * joined with run and provider info for dashboard display.
 */
export async function getResultsForProductQuery(
  productId: string,
  queryId: string,
  providerFilter?: string,
  limit = 30
): Promise<ResultWithMeta[]> {
  const supabase = await createClient();

  // We use a raw query via RPC or a joined select.
  // Supabase JS supports foreign table references with select syntax.
  let query = supabase
    .from('results')
    .select(`
      *,
      runs!inner ( run_at ),
      providers!inner ( name )
    `)
    .eq('product_id', productId)
    .eq('query_id', queryId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (providerFilter) {
    query = query.eq('providers.name', providerFilter);
  }

  const { data, error } = await query;

  if (error) throw new Error(`Failed to fetch results: ${error.message}`);

  // Flatten joined data into ResultWithMeta shape
  return (data ?? []).map((row: Record<string, unknown>) => {
    const runs = row.runs as Record<string, unknown> | undefined;
    const providers = row.providers as Record<string, unknown> | undefined;
    return {
      id: row.id as string,
      run_id: row.run_id as string,
      product_id: row.product_id as string,
      query_id: row.query_id as string,
      provider_id: row.provider_id as string,
      appears: row.appears as boolean,
      rank: row.rank as number | null,
      url: row.url as string | null,
      raw_payload: row.raw_payload,
      created_at: row.created_at as string,
      run_at: (runs?.run_at as string) ?? '',
      provider_name: (providers?.name as string) ?? '',
    } as ResultWithMeta;
  });
}

/**
 * Fetch the latest result per provider for a given product + query.
 * Returns one row per provider (the most recent).
 */
export async function getLatestResultsPerProvider(
  productId: string,
  queryId: string
): Promise<ResultWithMeta[]> {
  const allResults = await getResultsForProductQuery(productId, queryId, undefined, 100);

  // Group by provider and pick the latest per provider
  const latestByProvider = new Map<string, ResultWithMeta>();
  for (const result of allResults) {
    if (!latestByProvider.has(result.provider_name)) {
      latestByProvider.set(result.provider_name, result);
    }
  }

  return Array.from(latestByProvider.values());
}
