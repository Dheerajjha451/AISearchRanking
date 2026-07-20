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
