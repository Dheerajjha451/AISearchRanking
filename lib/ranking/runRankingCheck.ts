import { createAdminClient } from '@/lib/supabase/server';
import { checkFreeModel } from '@/lib/adapters/free-model';
import { getOpenRouterApiKey } from '@/lib/config/api-keys';
import { OPENROUTER_MODELS, isOpenRouterModelId } from '@/lib/models/free-models';
import type { DbProduct, DbQuery, DbProvider, RunSummary } from '@/lib/types';

/** Concurrency limiter — simple semaphore */
class Semaphore {
  private queue: (() => void)[] = [];
  private running = 0;

  constructor(private max: number) {}

  async acquire(): Promise<void> {
    if (this.running < this.max) {
      this.running++;
      return;
    }
    await new Promise<void>((resolve) => this.queue.push(resolve));
    this.running++;
  }

  release(): void {
    this.running--;
    const next = this.queue.shift();
    if (next) next();
  }
}

/** Default concurrency limit per provider */
const CONCURRENCY_LIMIT = 2;

/**
 * Main orchestrator: runs a ranking check across all products × queries × selected OpenRouter models.
 *
 * 1. Creates a new `runs` row with status='pending'
 * 2. Loads all products, queries, providers, and the OpenRouter API key from env
 * 3. For each (product, query, model) combination, calls that model
 * 4. Inserts result rows
 * 5. Marks run as completed or failed
 */
export async function runRankingCheck(): Promise<RunSummary> {
  const supabase = createAdminClient();

  // 1. Create a new run
  const { data: run, error: runError } = await supabase
    .from('runs')
    .insert({ status: 'pending' })
    .select()
    .single();

  if (runError || !run) {
    throw new Error(`Failed to create run: ${runError?.message}`);
  }

  const runId = run.id;
  let successCount = 0;
  let errorCount = 0;
  const errors: string[] = [];

  try {
    // 2. Load all data
    const [productsRes, queriesRes, providersRes] = await Promise.all([
      supabase.from('products').select('*'),
      supabase.from('queries').select('*'),
      supabase.from('providers').select('*').in('name', OPENROUTER_MODELS.map((model) => model.id)),
    ]);

    const products: DbProduct[] = productsRes.data ?? [];
    const queries: DbQuery[] = queriesRes.data ?? [];
    const providers: DbProvider[] = providersRes.data ?? [];
    const apiKey = getOpenRouterApiKey();

    if (products.length === 0 || queries.length === 0) {
      await supabase.from('runs').update({ status: 'completed' }).eq('id', runId);
      return {
        runId,
        status: 'completed',
        totalChecks: 0,
        successCount: 0,
        errorCount: 0,
        errors: ['No products or queries configured'],
      };
    }

    // 3. Build task list
    const tasks: {
      product: DbProduct;
      query: DbQuery;
      provider: DbProvider;
    }[] = [];

    for (const product of products) {
      for (const query of queries) {
        for (const provider of providers) {
          tasks.push({ product, query, provider });
        }
      }
    }

    // 4. Execute with concurrency control
    const semaphore = new Semaphore(CONCURRENCY_LIMIT);

    const taskPromises = tasks.map(async ({ product, query, provider }) => {
      await semaphore.acquire();
      try {
        const model = provider.name;
        if (!isOpenRouterModelId(model)) {
          const msg = `Unsupported OpenRouter model in providers table: ${model}`;
          errors.push(msg);
          errorCount++;
          console.error(`[Orchestrator] ${msg}`);
          return;
        }

        if (!apiKey) {
          const msg = `No OpenRouter API key configured. Set OPENROUTER_API_KEY in your environment.`;
          errors.push(msg);
          errorCount++;

          // Insert a result row recording the missing key
          await supabase.from('results').insert({
            run_id: runId,
            product_id: product.id,
            query_id: query.id,
            provider_id: provider.id,
            appears: false,
            rank: null,
            url: null,
            raw_payload: { error: msg },
          });
          return;
        }



        const result = await checkFreeModel(model, query.search_text, product.primary_domain, apiKey);

        // Insert result row
        await supabase.from('results').insert({
          run_id: runId,
          product_id: product.id,
          query_id: query.id,
          provider_id: provider.id,
          appears: result.appears,
          rank: result.rank,
          url: result.url ?? null,
          raw_payload: result.rawPayload,
        });

        successCount++;
      } catch (err) {
        errorCount++;
        const msg =
          err instanceof Error ? err.message : `Unknown error for ${provider.name}`;
        errors.push(msg);
        console.error(`[Orchestrator] Error:`, msg);
      } finally {
        semaphore.release();
      }
    });

    await Promise.allSettled(taskPromises);

    // 5. Update run status
    const status = errorCount === tasks.length ? 'failed' : 'completed';
    await supabase.from('runs').update({ status }).eq('id', runId);

    return {
      runId,
      status: status as 'completed' | 'failed',
      totalChecks: tasks.length,
      successCount,
      errorCount,
      errors,
    };
  } catch (err) {
    // Fatal error — mark run as failed
    await supabase.from('runs').update({ status: 'failed' }).eq('id', runId);
    throw err;
  }
}
