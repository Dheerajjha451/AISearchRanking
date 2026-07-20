
-- 1. Providers (static lookup table)
CREATE TABLE IF NOT EXISTS providers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Seed providers
INSERT INTO providers (name) VALUES
  ('nvidia/nemotron-3-embed-1b:free'),
  ('tencent/hy3:free'),
  ('poolside/laguna-xs-2.1:free'),
  ('cohere/north-mini-code:free'),
  ('nvidia/llama-nemotron-rerank-vl-1b-v2:free'),
  ('nvidia/nemotron-3.5-content-safety:free'),
  ('nvidia/nemotron-3-ultra-550b-a55b:free'),
  ('nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free'),
  ('poolside/laguna-m.1:free'),
  ('openai/gpt-oss-20b:free'),
  ('google/gemma-4-31b-it:free'),
  ('google/gemma-4-26b-a4b-it:free'),
  ('nvidia/nemotron-3-super-120b-a12b:free'),
  ('nvidia/llama-nemotron-embed-vl-1b-v2:free'),
  ('nvidia/nemotron-3-nano-30b-a3b:free'),
  ('nvidia/nemotron-nano-12b-v2-vl:free'),
  ('nvidia/nemotron-nano-9b-v2:free')
ON CONFLICT (name) DO NOTHING;

-- 2. Products
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  primary_domain text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- 3. Queries
CREATE TABLE IF NOT EXISTS queries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  search_text text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- 4. Runs
CREATE TABLE IF NOT EXISTS runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  run_at timestamptz DEFAULT now(),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_runs_run_at ON runs(run_at DESC);

-- 5. Results
CREATE TABLE IF NOT EXISTS results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id uuid NOT NULL REFERENCES runs(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  query_id uuid NOT NULL REFERENCES queries(id) ON DELETE CASCADE,
  provider_id uuid NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  appears boolean NOT NULL DEFAULT false,
  rank int,
  url text,
  raw_payload jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_results_run_id ON results(run_id);
CREATE INDEX IF NOT EXISTS idx_results_product_query ON results(product_id, query_id);
CREATE INDEX IF NOT EXISTS idx_results_provider_id ON results(provider_id);

-- 6. Search History
CREATE TABLE IF NOT EXISTS search_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  query_text text NOT NULL,
  product_text text,
  results jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_search_history_created_at ON search_history(created_at DESC);


-- The application accesses these tables only through server-side code using
-- SUPABASE_SERVICE_ROLE_KEY. Keep RLS enabled and expose no anon/authenticated
-- policies; the service role bypasses RLS without being available to browsers.
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE results ENABLE ROW LEVEL SECURITY;
ALTER TABLE providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all on products" ON products;
DROP POLICY IF EXISTS "Allow all on queries" ON queries;
DROP POLICY IF EXISTS "Allow all on runs" ON runs;
DROP POLICY IF EXISTS "Allow all on results" ON results;
DROP POLICY IF EXISTS "Allow all on providers" ON providers;
DROP POLICY IF EXISTS "Allow all on search_history" ON search_history;
