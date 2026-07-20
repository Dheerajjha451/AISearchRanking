/** Free OpenRouter chat models that can answer the ranking prompt. */
export const OPENROUTER_MODELS = [
  { id: 'tencent/hy3:free', label: 'Hy3', brand: 'Tencent' },
  { id: 'poolside/laguna-xs-2.1:free', label: 'Laguna XS 2.1', brand: 'Poolside' },
  { id: 'cohere/north-mini-code:free', label: 'North Mini Code', brand: 'Cohere' },
  { id: 'nvidia/nemotron-3-ultra-550b-a55b:free', label: 'Nemotron 3 Ultra', brand: 'NVIDIA' },
  { id: 'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free', label: 'Nemotron 3 Nano Omni', brand: 'NVIDIA' },
  { id: 'poolside/laguna-m.1:free', label: 'Laguna M.1', brand: 'Poolside' },
  { id: 'google/gemma-4-26b-a4b-it:free', label: 'Gemma 4 26B A4B', brand: 'Google' },
  { id: 'google/gemma-4-31b-it:free', label: 'Gemma 4 31B', brand: 'Google' },
  { id: 'nvidia/nemotron-3-super-120b-a12b:free', label: 'Nemotron 3 Super', brand: 'NVIDIA' },
  { id: 'nvidia/nemotron-3-nano-30b-a3b:free', label: 'Nemotron 3 Nano 30B A3B', brand: 'NVIDIA' },
  { id: 'nvidia/nemotron-nano-12b-v2-vl:free', label: 'Nemotron Nano 12B 2 VL', brand: 'NVIDIA' },
  { id: 'nvidia/nemotron-nano-9b-v2:free', label: 'Nemotron Nano 9B V2', brand: 'NVIDIA' },
  { id: 'openai/gpt-oss-20b:free', label: 'GPT OSS 20B', brand: 'OpenAI' },
] as const;

export type OpenRouterModelId = (typeof OPENROUTER_MODELS)[number]['id'];
export type OpenRouterModel = (typeof OPENROUTER_MODELS)[number];

export const RANKING_OPENROUTER_MODELS = OPENROUTER_MODELS;

export const DEFAULT_MODEL_IDS: OpenRouterModelId[] = [
  'tencent/hy3:free',
  'google/gemma-4-31b-it:free',
  'openai/gpt-oss-20b:free',
];

export function getOpenRouterModel(id: string): OpenRouterModel | undefined {
  return OPENROUTER_MODELS.find((model) => model.id === id);
}

export function isRankingOpenRouterModelId(id: string): id is OpenRouterModelId {
  return Boolean(getOpenRouterModel(id));
}
