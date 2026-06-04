import type { ProviderResult } from '@/lib/types';
import { openRouterChatWithFallback } from './openrouter';
import { extractToolsFromPayload, findToolMatch } from '@/lib/ranking/tools';

/**
 * Perplexity Adapter — via OpenRouter
 *
 * Uses Perplexity Sonar first, then free web-capable fallback
 * models if the Perplexity model fails.
 *
 * Primary model: perplexity/sonar-pro
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
        'perplexity/sonar-pro',
        'perplexity/sonar',
        // Free slugs rotate frequently; keep current resilient fallbacks.
        { model: 'qwen/qwen3-next-80b-a3b-instruct:free', plugins: [] },
        { model: 'openai/gpt-oss-120b:free', plugins: [] },
        { model: 'openai/gpt-oss-20b:free', plugins: [] },
        { model: 'google/gemma-4-31b-it:free', plugins: [] },
        { model: 'google/gemma-4-26b-a4b-it:free', plugins: [] },
        { model: 'meta-llama/llama-3.3-70b-instruct:free', plugins: [] },
        { model: 'meta-llama/llama-3.2-3b-instruct:free', plugins: [] },
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
        rawPayload: {
          error: msg + ' (last model: ' + res.modelUsed + ')',
          data: res.data,
          modelUsed: res.modelUsed,
          attempts: res.attempts,
        },
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
