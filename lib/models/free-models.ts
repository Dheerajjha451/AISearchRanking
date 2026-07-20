export const FREE_MODELS = [
  {
    id: 'openai/gpt-oss-120b:free',
    label: 'GPT OSS 120B',
    brand: 'OpenAI',
    color: '#22d3ee',
    bgColor: 'rgba(34, 211, 238, 0.1)',
  },
  {
    id: 'tencent/hy3:free',
    label: 'Hy3',
    brand: 'Tencent',
    color: '#a78bfa',
    bgColor: 'rgba(167, 139, 250, 0.1)',
  },
  {
    id: 'openai/gpt-oss-20b:free',
    label: 'GPT OSS 20B',
    brand: 'OpenAI',
    color: '#34d399',
    bgColor: 'rgba(52, 211, 153, 0.1)',
  },
  {
    id: 'nvidia/nemotron-3-nano-30b-a3b:free',
    label: 'Nemotron 3 Nano 30B A3B',
    brand: 'NVIDIA',
    color: '#fbbf24',
    bgColor: 'rgba(251, 191, 36, 0.1)',
  },
  {
    id: 'nvidia/nemotron-3-super-120b-a12b:free',
    label: 'Nemotron 3 Super',
    brand: 'NVIDIA',
    color: '#fb7185',
    bgColor: 'rgba(251, 113, 133, 0.1)',
  },
] as const;

export type FreeModelId = (typeof FREE_MODELS)[number]['id'];
export type FreeModel = (typeof FREE_MODELS)[number];

export const DEFAULT_FREE_MODEL_IDS: FreeModelId[] = [
  FREE_MODELS[0].id,
  FREE_MODELS[2].id,
  FREE_MODELS[3].id,
];

export function getFreeModel(id: string): FreeModel | undefined {
  return FREE_MODELS.find((model) => model.id === id);
}

export function isFreeModelId(id: string): id is FreeModelId {
  return Boolean(getFreeModel(id));
}
