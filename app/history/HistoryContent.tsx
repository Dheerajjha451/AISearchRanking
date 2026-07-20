'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import FailureCard from '@/components/atoms/FailureCard';
import { getOpenRouterModel } from '@/lib/models/free-models';
import type { SearchHistory, SearchHistoryResult } from '@/lib/types';

const dateFormatter = new Intl.DateTimeFormat('en', {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: 'UTC',
});

const legacyProviderConfig: Record<string, { label: string }> = {
  perplexity: { label: 'Perplexity' },
  chatgpt: { label: 'ChatGPT' },
  gemini: { label: 'Gemini' },
};

type HistoryContentProps = {
  history: SearchHistory[];
  error?: string;
};

function getRankLabel(result: SearchHistoryResult, hasProduct: boolean): string {
  if (result.error) return 'Failed';
  if (!hasProduct) return 'Top 10 returned';
  if (result.appears && result.rank) return `Found at #${result.rank}`;
  return 'Not in top 10';
}

function getToolKey(tool: SearchHistoryResult['tools'][number]): string {
  return `${tool.name}\u0000${tool.url ?? ''}`;
}

function RefreshButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant="secondary"
      loading={isPending}
      onClick={() => startTransition(() => router.refresh())}
    >
      Refresh
    </Button>
  );
}

export default function HistoryContent({ history, error }: HistoryContentProps) {
  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 md:p-10">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-1">
          <p className="eyebrow mb-2">Saved research</p>
          <h1 className="display-type text-4xl font-bold text-[#f4f1e8]">Your visibility trail.</h1>
          <p className="mt-2 text-sm text-[#f4f1e8]/60">A record of previous queries and each model&apos;s recommendation list.</p>
        </div>
        <RefreshButton />
      </div>

      {error && (
        <FailureCard title="We couldn&apos;t load your history." message={error} label="History unavailable" />
      )}

      {!error && history.length === 0 && (
        <Card className="border-dashed bg-transparent">
          <div className="py-14 text-center">
            <p className="eyebrow mb-3">Nothing logged yet</p>
            <h2 className="display-type mb-3 text-2xl font-bold text-[#f4f1e8]">Your research will show up here.</h2>
            <p className="mx-auto max-w-md text-sm leading-6 text-[#f4f1e8]/60">
              Searches from the dashboard will appear here after they complete.
            </p>
          </div>
        </Card>
      )}

      {!error && history.length > 0 && (
        <div className="space-y-4">
          {history.map((entry) => {
            const hasProduct = Boolean(entry.product_text?.trim());

            return (
              <Card key={entry.id} className="glass-hover">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#f4f1e8]/45">{dateFormatter.format(new Date(entry.created_at))}</p>
                      <h2 className="display-type mt-2 text-xl font-bold text-[#f4f1e8] break-words">{entry.query_text}</h2>
                      {entry.product_text && (
                        <p className="mt-2 text-xs text-[#f4f1e8]/60 break-words">Product tracked: {entry.product_text}</p>
                      )}
                    </div>
                    <span className="w-fit border border-[#f4f1e8]/[0.16] px-2.5 py-1 text-xs font-medium text-[#f4f1e8]">
                      {entry.results.length} models
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
                    {entry.results.map((result) => {
                      const resultId = result.model ?? result.provider ?? 'Unknown model';
                      const config =
                        (result.model ? getOpenRouterModel(result.model) : undefined) ??
                        legacyProviderConfig[resultId] ?? {
                          label: resultId,
                        };
                      const tools = Array.from(
                        new Map(result.tools.slice(0, 3).map((tool) => [getToolKey(tool), tool])).values()
                      );

                      return (
                        <div
                          key={`${entry.id}-${resultId}`}
                          className="border border-[#f4f1e8]/[0.12] bg-[#080808] p-4"
                        >
                          <div className="mb-3 flex items-center justify-between gap-3">
                            <p className="text-sm font-semibold text-[#f4f1e8]">
                              {config.label}
                            </p>
                            <span
                              className="shrink-0 border border-[#f4f1e8]/[0.16] px-2 py-1 text-[11px] font-medium text-[#f4f1e8]"
                            >
                              {getRankLabel(result, hasProduct)}
                            </span>
                          </div>

                          {result.error ? (
                            <div className="border border-[#f4f1e8]/[0.16] px-3 py-4">
                              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#f4f1e8]">Model unavailable</p>
                              <p className="mt-2 text-xs leading-5 text-[#f4f1e8]/60">This model could not return recommendations for this search.</p>
                            </div>
                          ) : tools.length > 0 ? (
                            <ol className="space-y-1.5">
                              {tools.map((tool, index) => (
                                <li key={getToolKey(tool)} className="flex gap-2 text-xs">
                                  <span className="w-4 shrink-0 text-right font-mono text-[#f4f1e8]/35">{index + 1}.</span>
                                  <div className="min-w-0 flex-1">
                                    <p className="truncate font-medium text-[#f4f1e8]">{tool.name}</p>
                                    {tool.url && (
                                      <a
                                        href={tool.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block truncate text-[#f4f1e8]/40 transition-colors hover:text-[#f4f1e8]"
                                      >
                                        {tool.url}
                                      </a>
                                    )}
                                  </div>
                                </li>
                              ))}
                            </ol>
                          ) : (
                            <p className="text-xs text-[#f4f1e8]/40">No tools returned</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
