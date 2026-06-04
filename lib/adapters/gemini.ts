import type { ProviderResult } from '@/lib/types';
import { openRouterChatWithFallback } from './openrouter';
import { extractToolsFromPayload, findToolMatch } from '@/lib/ranking/tools';

/**
 * Gemini Adapter — via OpenRouter
 *
 * Uses the latest Gemini candidates first, then free Gemini
 * fallback models if the latest model fails.
 *
 * Primary model: google/gemini-3.1-pro-preview
 */
export async function checkGemini(
  query: string,
  productDomain: string,
  apiKey: string
): Promise<ProviderResult> {
  const baseResult: ProviderResult = {
    provider: 'gemini',
    query,
    appears: false,
    rank: null,
    rawPayload: null,
  };

  try {
    const res = await openRouterChatWithFallback({
      apiKey,
      models: [
        'google/gemini-3.1-pro-preview',
        'google/gemini-3-flash-preview',
        'google/gemini-2.5-pro',
        'google/gemini-2.0-flash-exp:free',
        'google/gemini-1.5-flash:free',
        'google/gemini-1.5-pro:free',
      ],
      messages: [
        {
          role: 'system',
          content:
            'You rank products/tools for the user. Use web search. Return JSON only, no markdown, no explanation.',
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
