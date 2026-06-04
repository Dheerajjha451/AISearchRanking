'use client';

import Card from '@/components/atoms/Card';
import type { ResultWithMeta } from '@/lib/types';
import { extractToolsFromPayload } from '@/lib/ranking/tools';

/** Provider display config */
const providerConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  perplexity: { label: 'Perplexity', color: '#22d3ee', bgColor: 'rgba(34,211,238,0.1)' },
  chatgpt: { label: 'ChatGPT', color: '#10b981', bgColor: 'rgba(16,185,129,0.1)' },
  gemini: { label: 'Gemini', color: '#6366f1', bgColor: 'rgba(99,102,241,0.1)' },
};

interface TopResponsesProps {
  results: ResultWithMeta[];
}

/**
 * Displays the top tool/product responses returned by each provider.
 * Extracts the tools list from raw_payload to show what each AI returned.
 */
export default function TopResponses({ results }: TopResponsesProps) {
  if (results.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-300">
        Top Responses by Provider
      </h3>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {results.map((result) => {
          const config = providerConfig[result.provider_name] || {
            label: result.provider_name,
            color: '#9ca3af',
            bgColor: 'rgba(156,163,175,0.1)',
          };

          const tools = extractToolsFromPayload(result.raw_payload);

          return (
            <Card key={result.id} padding="sm">
              <div
                className="flex items-center gap-2 px-3 py-2 rounded-lg mb-3"
                style={{ backgroundColor: config.bgColor }}
              >
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: config.color }}
                />
                <span
                  className="text-sm font-semibold"
                  style={{ color: config.color }}
                >
                  {config.label}
                </span>
                {result.appears && result.rank !== null && (
                  <span className="ml-auto text-xs text-gray-400">
                    Your product at #{result.rank}
                  </span>
                )}
              </div>

              {tools.length > 0 ? (
                <ol className="space-y-1.5 px-1">
                  {tools.slice(0, 10).map((tool, idx) => (
                    <li
                      key={idx}
                      className={`flex items-start gap-2 text-xs py-1.5 px-2 rounded-lg transition-colors ${
                        result.appears && result.rank === idx + 1
                          ? 'bg-emerald-500/10 border border-emerald-500/20'
                          : 'hover:bg-white/[0.03] border border-transparent'
                      }`}
                    >
                      <span className="text-gray-600 font-mono w-5 shrink-0 text-right">
                        {idx + 1}.
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-300 font-medium truncate">
                            {tool.name}
                          </span>
                          {result.appears && result.rank === idx + 1 && (
                            <span className="shrink-0 text-[11px] text-emerald-300">Match</span>
                          )}
                        </div>
                        {tool.url && (
                          <a
                            href={tool.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-gray-600 hover:text-indigo-400 truncate transition-colors mt-0.5"
                          >
                            {tool.url}
                          </a>
                        )}
                      </div>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-xs text-gray-600 px-2 py-4 text-center">
                  {(result.raw_payload as Record<string, unknown>)?.error
                    ? `Error: ${(result.raw_payload as Record<string, unknown>).error}`
                    : 'No tools returned'}
                </p>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
