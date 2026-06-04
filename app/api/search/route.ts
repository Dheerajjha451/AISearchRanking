import { NextResponse } from 'next/server';
import { providerAdapters } from '@/lib/adapters';
import { getOpenRouterApiKey } from '@/lib/config/api-keys';
import { extractToolsFromPayload } from '@/lib/ranking/tools';
import { createClient } from '@/lib/supabase/server';
import type { ProviderName } from '@/lib/types';

const SEARCH_PROVIDERS: ProviderName[] = ['perplexity', 'chatgpt', 'gemini'];

type SearchBody = {
  query?: unknown;
  product?: unknown;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as SearchBody;
    const query = typeof body.query === 'string' ? body.query.trim() : '';
    const product = typeof body.product === 'string' ? body.product.trim() : '';

    if (!query) {
      return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
    }

    const apiKey = getOpenRouterApiKey();

    if (!apiKey) {
      return NextResponse.json(
        { error: 'No OpenRouter API key configured. Set OPENROUTER_API_KEY in your environment.' },
        { status: 400 }
      );
    }

    const results = await Promise.all(
      SEARCH_PROVIDERS.map(async (provider) => {
        const adapter = providerAdapters[provider];
        if (!adapter) {
          return {
            provider,
            appears: false,
            rank: null,
            url: null,
            tools: [],
            error: `No adapter configured for ${provider}`,
          };
        }

        const result = await adapter(query, product, apiKey);

        return {
          provider,
          appears: result.appears,
          rank: result.rank,
          url: result.url ?? null,
          tools: extractToolsFromPayload(result.rawPayload),
          modelUsed:
            result.rawPayload && typeof result.rawPayload === 'object'
              ? (result.rawPayload as { modelUsed?: unknown }).modelUsed ?? null
              : null,
          error:
            result.rawPayload && typeof result.rawPayload === 'object'
              ? (result.rawPayload as { error?: unknown }).error ?? null
              : null,
        };
      })
    );

    try {
      const supabase = await createClient();
      const { error: historyError } = await supabase.from('search_history').insert({
        query_text: query,
        product_text: product || null,
        results,
      });

      if (historyError) {
        console.error('[Search] Failed to save history:', historyError.message);
      }
    } catch (historyError) {
      console.error('[Search] Failed to save history:', historyError);
    }

    return NextResponse.json({ query, product, results });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
