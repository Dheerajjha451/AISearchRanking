export const OPENROUTER_MODELS = [
  {
    id: 'openai/gpt-oss-120b',
    label: 'GPT OSS 120B',
    brand: 'OpenAI',
    access: 'paid',
    color: '#22d3ee',
    bgColor: 'rgba(34, 211, 238, 0.1)',
  },
  {
    id: 'openai/gpt-oss-20b:free',
    label: 'GPT OSS 20B',
    brand: 'OpenAI',
    access: 'free',
    color: '#34d399',
    bgColor: 'rgba(52, 211, 153, 0.1)',
  },
  {
    id: 'google/gemma-4-31b-it:free',
    label: 'Gemma 4 31B',
    brand: 'Google',
    access: 'free',
    color: '#60a5fa',
    bgColor: 'rgba(96, 165, 250, 0.1)',
  },
  {
    id: 'google/gemma-4-26b-a4b-it:free',
    label: 'Gemma 4 26B A4B',
    brand: 'Google',
    access: 'free',
    color: '#818cf8',
    bgColor: 'rgba(129, 140, 248, 0.1)',
  },
  {
    id: 'nvidia/nemotron-3-ultra-550b-a55b:free',
    label: 'Nemotron 3 Ultra 550B',
    brand: 'NVIDIA',
    access: 'free',
    color: '#f97316',
    bgColor: 'rgba(249, 115, 22, 0.1)',
  },
  {
    id: 'nvidia/nemotron-3-nano-30b-a3b:free',
    label: 'Nemotron 3 Nano 30B A3B',
    brand: 'NVIDIA',
    access: 'free',
    color: '#fbbf24',
    bgColor: 'rgba(251, 191, 36, 0.1)',
  },
  {
    id: 'nvidia/nemotron-3-super-120b-a12b:free',
    label: 'Nemotron 3 Super',
    brand: 'NVIDIA',
    access: 'free',
    color: '#fb7185',
    bgColor: 'rgba(251, 113, 133, 0.1)',
  },
  {
    id: 'poolside/laguna-xs-2.1:free',
    label: 'Laguna XS 2.1',
    brand: 'Poolside',
    access: 'free',
    color: '#2dd4bf',
    bgColor: 'rgba(45, 212, 191, 0.1)',
  },
  {
    id: 'cohere/north-mini-code:free',
    label: 'North Mini Code',
    brand: 'Cohere',
    access: 'free',
    color: '#c084fc',
    bgColor: 'rgba(192, 132, 252, 0.1)',
  },
] as const;

export type OpenRouterModelId = (typeof OPENROUTER_MODELS)[number]['id'];
export type OpenRouterModel = (typeof OPENROUTER_MODELS)[number];

export const DEFAULT_MODEL_IDS: OpenRouterModelId[] = [
  OPENROUTER_MODELS[0].id,
  OPENROUTER_MODELS[2].id,
  OPENROUTER_MODELS[5].id,
];

export function getOpenRouterModel(id: string): OpenRouterModel | undefined {
  return OPENROUTER_MODELS.find((model) => model.id === id);
}

export function isOpenRouterModelId(id: string): id is OpenRouterModelId {
  return Boolean(getOpenRouterModel(id));
}
