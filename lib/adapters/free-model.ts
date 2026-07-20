import type { ProviderResult } from '@/lib/types';
import { extractToolsFromPayload, findToolMatch } from '@/lib/ranking/tools';
import { openRouterChatCompletion } from './openrouter';

/** Runs one explicitly selected OpenRouter free model, without paid plugins or fallbacks. */
export async function checkFreeModel(
  model: string,
  query: string,
  productDomain: string,
  apiKey: string
): Promise<ProviderResult> {
  const baseResult: ProviderResult = {
    provider: model,
    query,
    appears: false,
    rank: null,
    rawPayload: null,
  };

  try {
    const res = await openRouterChatCompletion({
      apiKey,
      model,
      plugins: [],
      messages: [
        {
          role: 'system',
          content: 'You rank products and tools. Return JSON only, with no markdown or explanation.',
        },
        {
          role: 'user',
          content: `Return the top 10 products/tools for the query "${query}". Output strictly as JSON: { "tools": [{ "name": "...", "url": "..." }, ...] }. Include the full URL for each tool.`,
        },
      ],
    });

    if (!res.ok) {
      return {
        ...baseResult,
        rawPayload: {
          error: res.data?.error?.message || `HTTP ${res.status}`,
          data: res.data,
          modelUsed: model,
        },
      };
    }

    const tools = extractToolsFromPayload(res.data);
    const match = findToolMatch(tools, productDomain);
    baseResult.rawPayload = { data: res.data, modelUsed: model, tools };

    if (match) {
      baseResult.appears = true;
      baseResult.rank = match.rank;
      baseResult.url = match.tool.url;
    }

    return baseResult;
  } catch (error) {
    return {
      ...baseResult,
      rawPayload: { error: error instanceof Error ? error.message : 'Unknown error', modelUsed: model },
    };
  }
}
