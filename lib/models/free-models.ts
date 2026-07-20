type OpenRouterModelCapability = 'ranking' | 'embedding' | 'reranking' | 'safety';

export const OPENROUTER_MODELS = [
  { id: 'nvidia/nemotron-3-embed-1b:free', label: 'Nemotron 3 Embed 1B', brand: 'NVIDIA', capability: 'embedding' },
  { id: 'tencent/hy3:free', label: 'Hy3', brand: 'Tencent', capability: 'ranking' },
  { id: 'poolside/laguna-xs-2.1:free', label: 'Laguna XS 2.1', brand: 'Poolside', capability: 'ranking' },
  { id: 'cohere/north-mini-code:free', label: 'North Mini Code', brand: 'Cohere', capability: 'ranking' },
  { id: 'nvidia/llama-nemotron-rerank-vl-1b-v2:free', label: 'Llama Nemotron Rerank VL 1B V2', brand: 'NVIDIA', capability: 'reranking' },
  { id: 'nvidia/nemotron-3.5-content-safety:free', label: 'Nemotron 3.5 Content Safety', brand: 'NVIDIA', capability: 'safety' },
  { id: 'nvidia/nemotron-3-ultra-550b-a55b:free', label: 'Nemotron 3 Ultra', brand: 'NVIDIA', capability: 'ranking' },
  { id: 'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free', label: 'Nemotron 3 Nano Omni', brand: 'NVIDIA', capability: 'ranking' },
  { id: 'poolside/laguna-m.1:free', label: 'Laguna M.1', brand: 'Poolside', capability: 'ranking' },
  { id: 'google/gemma-4-26b-a4b-it:free', label: 'Gemma 4 26B A4B', brand: 'Google', capability: 'ranking' },
  { id: 'google/gemma-4-31b-it:free', label: 'Gemma 4 31B', brand: 'Google', capability: 'ranking' },
  { id: 'nvidia/nemotron-3-super-120b-a12b:free', label: 'Nemotron 3 Super', brand: 'NVIDIA', capability: 'ranking' },
  { id: 'nvidia/llama-nemotron-embed-vl-1b-v2:free', label: 'Llama Nemotron Embed VL 1B V2', brand: 'NVIDIA', capability: 'embedding' },
  { id: 'nvidia/nemotron-3-nano-30b-a3b:free', label: 'Nemotron 3 Nano 30B A3B', brand: 'NVIDIA', capability: 'ranking' },
  { id: 'nvidia/nemotron-nano-12b-v2-vl:free', label: 'Nemotron Nano 12B 2 VL', brand: 'NVIDIA', capability: 'ranking' },
  { id: 'nvidia/nemotron-nano-9b-v2:free', label: 'Nemotron Nano 9B V2', brand: 'NVIDIA', capability: 'ranking' },
  { id: 'openai/gpt-oss-20b:free', label: 'GPT OSS 20B', brand: 'OpenAI', capability: 'ranking' },
] as const satisfies readonly {
  id: string;
  label: string;
  brand: string;
  capability: OpenRouterModelCapability;
}[];

export type OpenRouterModelId = (typeof OPENROUTER_MODELS)[number]['id'];
export type OpenRouterModel = (typeof OPENROUTER_MODELS)[number];

export const RANKING_OPENROUTER_MODELS = OPENROUTER_MODELS.filter(
  (model) => model.capability === 'ranking'
);

export const DEFAULT_MODEL_IDS: OpenRouterModelId[] = [
  'tencent/hy3:free',
  'google/gemma-4-31b-it:free',
  'openai/gpt-oss-20b:free',
];

export function getOpenRouterModel(id: string): OpenRouterModel | undefined {
  return OPENROUTER_MODELS.find((model) => model.id === id);
}

export function isRankingOpenRouterModelId(id: string): id is OpenRouterModelId {
  return getOpenRouterModel(id)?.capability === 'ranking';
}
