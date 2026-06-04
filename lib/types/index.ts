export type ProviderName = 'perplexity' | 'chatgpt' | 'gemini' | 'openrouter';

/** Normalized result from any provider adapter */
export type ProviderResult = {
  provider: ProviderName;
  query: string;
  appears: boolean;
  rank: number | null;       // 1-based position, null if not found
  url?: string;              // first matching URL, if found
  rawPayload: unknown;       // full parsed response for debugging
};

// ----- Database Row Types -----

export type DbProduct = {
  id: string;
  name: string;
  primary_domain: string;
  created_at: string;
};

export type DbQuery = {
  id: string;
  label: string;
  search_text: string;
  created_at: string;
};

export type DbProvider = {
  id: string;
  name: ProviderName;
  created_at: string;
};

export type RunStatus = 'pending' | 'completed' | 'failed';

export type DbRun = {
  id: string;
  run_at: string;
  status: RunStatus;
  created_at: string;
};

export type DbResult = {
  id: string;
  run_id: string;
  product_id: string;
  query_id: string;
  provider_id: string;
  appears: boolean;
  rank: number | null;
  url: string | null;
  raw_payload: unknown;
  created_at: string;
};

/** Result row joined with run + provider info for dashboard display */
export type ResultWithMeta = DbResult & {
  run_at: string;
  provider_name: ProviderName;
};

export type SearchHistoryTool = {
  name: string;
  url: string | null;
};

export type SearchHistoryResult = {
  provider: ProviderName;
  appears: boolean;
  rank: number | null;
  url: string | null;
  tools: SearchHistoryTool[];
  modelUsed: string | null;
  error: string | null;
};

export type SearchHistory = {
  id: string;
  query_text: string;
  product_text: string | null;
  results: SearchHistoryResult[];
  created_at: string;
};

/** Summary returned by the orchestrator after a ranking check */
export type RunSummary = {
  runId: string;
  status: RunStatus;
  totalChecks: number;
  successCount: number;
  errorCount: number;
  errors: string[];
};
