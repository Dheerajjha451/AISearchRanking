export type RankedTool = {
  name: string;
  url: string;
};

type ToolLike = {
  name?: unknown;
  url?: unknown;
};

function stripCodeFence(content: string): string {
  return content.replace(/```json?\n?/g, '').replace(/```/g, '').trim();
}

function normalizeTools(tools: ToolLike[]): RankedTool[] {
  const normalizedTools: RankedTool[] = [];

  for (const tool of tools) {
    const normalizedTool = {
      name: typeof tool.name === 'string' ? tool.name.trim() : '',
      url: typeof tool.url === 'string' ? tool.url.trim() : '',
    };

    if (!normalizedTool.name && !normalizedTool.url) continue;

    normalizedTools.push(normalizedTool);
    if (normalizedTools.length === 10) break;
  }

  return normalizedTools;
}

function parseToolsJson(content: string): RankedTool[] {
  const clean = stripCodeFence(content);
  const candidates = [
    clean,
    clean.slice(clean.indexOf('{'), clean.lastIndexOf('}') + 1),
  ].filter(Boolean);

  for (const candidate of candidates) {
    try {
      const parsed = JSON.parse(candidate) as { tools?: ToolLike[] };
      if (!Array.isArray(parsed.tools)) continue;

      return normalizeTools(parsed.tools);
    } catch {
      // Try the next candidate shape.
    }
  }

  return [];
}

function getContentFromPayload(payload: unknown): string {
  if (!payload || typeof payload !== 'object') return '';

  const record = payload as Record<string, unknown>;

  if (typeof record.content === 'string') return record.content;
  if (typeof record.output_text === 'string') return record.output_text;
  if (typeof record.text === 'string') return record.text;

  const choices = record.choices;
  if (Array.isArray(choices)) {
    const first = choices[0] as { message?: { content?: unknown } } | undefined;
    const content = first?.message?.content;
    return typeof content === 'string' ? content : '';
  }

  if (record.data) return getContentFromPayload(record.data);

  return '';
}

export function extractToolsFromPayload(payload: unknown): RankedTool[] {
  if (!payload || typeof payload !== 'object') return [];

  const record = payload as Record<string, unknown>;
  if (Array.isArray(record.tools)) {
    return normalizeTools(record.tools as ToolLike[]);
  }

  const content = getContentFromPayload(payload);
  return content ? parseToolsJson(content) : [];
}

function normalizeValue(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/$/, '');
}

function getHostname(value: string): string {
  const normalized = normalizeValue(value);
  if (!normalized) return '';

  try {
    return new URL(`https://${normalized}`).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

function textIncludes(value: string, search: string): boolean {
  return value.includes(search);
}

export function findToolMatch(
  tools: RankedTool[],
  productNeedle: string
): { rank: number; tool: RankedTool } | null {
  const normalizedNeedle = normalizeValue(productNeedle);
  if (!normalizedNeedle) return null;

  const hostnameNeedle = getHostname(normalizedNeedle);
  const needles = new Set([normalizedNeedle, hostnameNeedle].filter((needle) => needle.length > 1));

  const index = tools.findIndex((tool) => {
    const name = normalizeValue(tool.name);
    const url = normalizeValue(tool.url);
    const host = getHostname(tool.url);

    for (const needle of needles) {
      if (
        textIncludes(name, needle) ||
        textIncludes(url, needle) ||
        textIncludes(host, needle) ||
        (host.length > 1 && textIncludes(needle, host))
      ) {
        return true;
      }
    }

    return false;
  });

  return index === -1 ? null : { rank: index + 1, tool: tools[index] };
}
