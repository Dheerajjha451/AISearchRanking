'use client';

import Card from '@/components/atoms/Card';
import StatusBadge from '@/components/molecules/StatusBadge';
import type { ResultWithMeta } from '@/lib/types';

/** Provider display config */
const providerConfig: Record<string, { label: string; color: string; icon: string }> = {
  perplexity: { label: 'Perplexity', color: 'text-cyan-400', icon: '🔍' },
  chatgpt: { label: 'ChatGPT', color: 'text-emerald-400', icon: '🤖' },
  gemini: { label: 'Gemini', color: 'text-indigo-400', icon: '✨' },
};

interface ResultsTableProps {
  results: ResultWithMeta[];
  loading?: boolean;
}

/**
 * Shows the latest result per provider in a table format.
 * Displays rank (0 if not found), URL, and last checked time.
 * Also shows the top results from the raw payload for each provider.
 */
export default function ResultsTable({ results, loading }: ResultsTableProps) {
  if (loading) {
    return (
      <Card>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-white/5 rounded-xl animate-pulse" />
          ))}
        </div>
      </Card>
    );
  }

  if (results.length === 0) {
    return (
      <Card>
        <div className="text-center py-12">
          <div className="text-4xl mb-3">📊</div>
          <p className="text-gray-400 text-sm">No results yet</p>
          <p className="text-gray-600 text-xs mt-1">
            Select a product and query, then run a check
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card padding="sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.06]">
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">
                Provider
              </th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">
                Status
              </th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">
                Rank
              </th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">
                URL
              </th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">
                Last Checked
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {results.map((result) => {
              const config = providerConfig[result.provider_name] || {
                label: result.provider_name,
                color: 'text-gray-400',
                icon: '🔹',
              };

              return (
                <tr
                  key={result.id}
                  className="hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <span>{config.icon}</span>
                      <span className={`text-sm font-medium ${config.color}`}>
                        {config.label}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    {result.appears ? (
                      <span className="text-xs text-emerald-400 font-medium">Found</span>
                    ) : (
                      <span className="text-xs text-red-400 font-medium">Not Found</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5">
                    <StatusBadge appears={result.appears} rank={result.rank} />
                  </td>
                  <td className="px-4 py-3.5">
                    {result.url ? (
                      <a
                        href={result.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-indigo-400 hover:text-indigo-300 underline truncate max-w-[200px] inline-block"
                      >
                        {result.url}
                      </a>
                    ) : (
                      <span className="text-xs text-gray-600">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-xs text-gray-500">
                      {new Date(result.run_at).toLocaleString()}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
