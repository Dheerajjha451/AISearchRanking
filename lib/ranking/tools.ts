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

      return parsed.tools
        .map((tool) => ({
          name: typeof tool.name === 'string' ? tool.name.trim() : '',
          url: typeof tool.url === 'string' ? tool.url.trim() : '',
        }))
        .filter((tool) => tool.name || tool.url)
        .slice(0, 10);
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
    return (record.tools as ToolLike[])
      .map((tool) => ({
        name: typeof tool.name === 'string' ? tool.name.trim() : '',
        url: typeof tool.url === 'string' ? tool.url.trim() : '',
      }))
      .filter((tool) => tool.name || tool.url)
      .slice(0, 10);
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

export function findToolMatch(
  tools: RankedTool[],
  productNeedle: string
): { rank: number; tool: RankedTool } | null {
  const normalizedNeedle = normalizeValue(productNeedle);
  if (!normalizedNeedle) return null;

  const hostnameNeedle = getHostname(normalizedNeedle);
  const needles = Array.from(
    new Set([normalizedNeedle, hostnameNeedle].filter((needle) => needle.length > 1))
  );

  const index = tools.findIndex((tool) => {
    const name = normalizeValue(tool.name);
    const url = normalizeValue(tool.url);
    const host = getHostname(tool.url);

    return needles.some(
      (needle) =>
        name.includes(needle) ||
        url.includes(needle) ||
        host.includes(needle) ||
        (host.length > 1 && needle.includes(host))
    );
  });

  return index === -1 ? null : { rank: index + 1, tool: tools[index] };
}
