type OpenRouterChatResponse = {
  choices?: Array<{ message?: { content?: string } }>;
  error?: { message?: string; code?: number };
};

export async function openRouterChatCompletion(options: {
  apiKey: string;
  model: string;
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>;
  plugins?: Array<{ id: string }>;
  max_tokens?: number;
  temperature?: number;
}): Promise<{ ok: boolean; status: number; data: OpenRouterChatResponse | null }>{
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${options.apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:3000',
      'X-Title': 'AI Ranking Monitor',
    },
    body: JSON.stringify({
      model: options.model,
      plugins: options.plugins ?? [{ id: 'web' }],
      messages: options.messages,
      max_tokens: options.max_tokens ?? 1024,
      temperature: options.temperature ?? 0.1,
    }),
  });

  const data = (await response.json().catch(() => null)) as OpenRouterChatResponse | null;
  return { ok: response.ok, status: response.status, data };
}

/**
 * Try model slugs in order until one works.
 * This protects the app from OpenRouter free model slugs being retired/renamed.
 */
export async function openRouterChatWithFallback(options: {
  apiKey: string;
  models: string[];
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>;
}): Promise<{ modelUsed: string; ok: boolean; status: number; data: OpenRouterChatResponse | null }>{
  let last: { ok: boolean; status: number; data: OpenRouterChatResponse | null } | null = null;
  for (const model of options.models) {
    const res = await openRouterChatCompletion({
      apiKey: options.apiKey,
      model,
      messages: options.messages,
    });
    last = res;
    if (res.ok) return { modelUsed: model, ...res };

    // If OpenRouter says no endpoints for this model, try next.
    const msg = res.data?.error?.message ?? '';
    if (res.status === 404 || msg.toLowerCase().includes('no endpoints found')) {
      continue;
    }

    // Other errors likely won't be fixed by switching model, but we still try next just in case.
  }

  return { modelUsed: options.models[options.models.length - 1] ?? 'unknown', ...(last ?? { ok: false, status: 500, data: null }) };
}
