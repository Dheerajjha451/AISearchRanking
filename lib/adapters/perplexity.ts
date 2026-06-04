import type { ProviderResult } from '@/lib/types';
import { openRouterChatWithFallback } from './openrouter';
import { extractToolsFromPayload, findToolMatch } from '@/lib/ranking/tools';

/**
 * Perplexity Adapter — via OpenRouter
 *
 * Uses an OpenRouter free model with web plugin to simulate
 * Perplexity-like web-grounded results.
 *
 * Model: meta-llama/llama-4-maverick:free
 */
export async function checkPerplexity(
  query: string,
  productDomain: string,
  apiKey: string
): Promise<ProviderResult> {
  const baseResult: ProviderResult = {
    provider: 'perplexity',
    query,
    appears: false,
    rank: null,
    rawPayload: null,
  };

  try {
    const res = await openRouterChatWithFallback({
      apiKey,
      models: [
        // Slugs rotate frequently; keep a couple of resilient fallbacks.
        'meta-llama/llama-4-maverick:free',
        'meta-llama/llama-3.1-70b-instruct:free',
        'qwen/qwen2.5-72b-instruct:free',
        'openrouter/auto',
      ],
      messages: [
        {
          role: 'system',
          content:
            'You are a product ranking assistant with web search access. Return JSON only, no markdown, no explanation.',
        },
        {
          role: 'user',
          content: `Return the top 10 products/tools for the query "${query}". Output strictly as JSON: { "tools": [{ "name": "...", "url": "..." }, ...] }. Include the full URL for each tool.`,
        },
      ],
    });
    if (!res.ok) {
      const msg = res.data?.error?.message || `HTTP ${res.status}`;
      return {
        ...baseResult,
        rawPayload: { error: msg, data: res.data, modelUsed: res.modelUsed },
      };
    }

    const tools = extractToolsFromPayload(res.data);
    const match = findToolMatch(tools, productDomain);

    baseResult.rawPayload = { data: res.data, modelUsed: res.modelUsed, tools };

    if (match) {
      baseResult.appears = true;
      baseResult.rank = match.rank;
      baseResult.url = match.tool.url;
    }

    return baseResult;
  } catch (error) {
    return {
      ...baseResult,
      rawPayload: {
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    };
  }
}
