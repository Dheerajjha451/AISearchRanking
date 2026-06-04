import type { ProviderName, ProviderResult } from '@/lib/types';
import { checkPerplexity } from './perplexity';
import { checkChatGPT } from './chatgpt';
import { checkGemini } from './gemini';

/** Adapter function signature — all adapters accept query, domain, and per-user API key */
export type AdapterFn = (
  query: string,
  productDomain: string,
  apiKey: string
) => Promise<ProviderResult>;

/** Registry mapping provider names to their adapter functions */
export const providerAdapters: Partial<Record<ProviderName, AdapterFn>> = {
  perplexity: checkPerplexity,
  chatgpt: checkChatGPT,
  gemini: checkGemini,
};
