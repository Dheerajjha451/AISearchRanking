import { NextResponse } from 'next/server';
import { checkFreeModel } from '@/lib/adapters/free-model';
import { getOpenRouterApiKey } from '@/lib/config/api-keys';
import { DEFAULT_MODEL_IDS, isOpenRouterModelId } from '@/lib/models/free-models';
import { extractToolsFromPayload } from '@/lib/ranking/tools';
import { createAdminClient } from '@/lib/supabase/server';
type SearchBody = {
  query?: unknown;
  product?: unknown;
  models?: unknown;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as SearchBody;
    const query = typeof body.query === 'string' ? body.query.trim() : '';
    const product = typeof body.product === 'string' ? body.product.trim() : '';
    const requestedModels = Array.isArray(body.models)
      ? body.models.filter((model): model is string => typeof model === 'string')
      : DEFAULT_MODEL_IDS;
    const models = [...new Set(requestedModels)].filter(isOpenRouterModelId);

    if (!query) {
      return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
    }

    if (models.length === 0) {
      return NextResponse.json({ error: 'Select at least one supported model' }, { status: 400 });
    }

    const apiKey = getOpenRouterApiKey();

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Search is temporarily unavailable. Please try again later.' },
        { status: 503 }
      );
    }

    const results = await Promise.all(
      models.map(async (model) => {
        const result = await checkFreeModel(model, query, product, apiKey);
        const modelError =
          result.rawPayload && typeof result.rawPayload === 'object'
            ? (result.rawPayload as { error?: unknown }).error ?? null
            : null;

        if (modelError) {
          console.error(`[Search] Model request failed for ${model}:`, modelError);
        }

        return {
          model,
          appears: result.appears,
          rank: result.rank,
          url: result.url ?? null,
          tools: extractToolsFromPayload(result.rawPayload),
          modelUsed:
            result.rawPayload && typeof result.rawPayload === 'object'
              ? (result.rawPayload as { modelUsed?: unknown }).modelUsed ?? null
              : null,
          error: modelError ? 'Model unavailable' : null,
        };
      })
    );

    try {
      const supabase = createAdminClient();
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

    return NextResponse.json({ query, product, models, results });
  } catch (error) {
    console.error('[Search] Request failed:', error);
    return NextResponse.json(
      { error: 'We couldn\'t run the visibility check. Please try again.' },
      { status: 500 }
    );
  }
}
