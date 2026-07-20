"use client";

import { useEffect, useState } from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import type { SearchHistory, SearchHistoryResult } from "@/lib/types";
import { getFreeModel } from "@/lib/models/free-models";

const legacyProviderConfig: Record<string, { label: string; color: string }> = {
  perplexity: { label: "Perplexity", color: "#22d3ee" },
  chatgpt: { label: "ChatGPT", color: "#10b981" },
  gemini: { label: "Gemini", color: "#818cf8" },
};

function getRankLabel(result: SearchHistoryResult, hasProduct: boolean): string {
  if (result.error) return "Failed";
  if (!hasProduct) return "Top 10 returned";
  if (result.appears && result.rank) return "Found at #" + result.rank;
  return "Not in top 10";
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function HistoryPage() {
  const [history, setHistory] = useState<SearchHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/history");
      const data = (await response.json().catch(() => ({}))) as {
        history?: SearchHistory[];
        error?: string;
      };

      if (!response.ok) {
        setHistory([]);
        setError(data.error || "Failed to load history");
        return;
      }

      setHistory(data.history ?? []);
    } catch {
      setHistory([]);
      setError("Failed to load history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchHistory();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-white">History</h1>
          <p className="text-sm text-gray-500">Previous dashboard searches and their model results.</p>
        </div>
        <Button type="button" variant="secondary" onClick={fetchHistory} loading={loading}>
          Refresh
        </Button>
      </div>

      {error && (
        <Card padding="sm" className="border-red-500/20 bg-red-500/5">
          <p className="text-sm text-red-300">{error}</p>
        </Card>
      )}

      {loading && !error && (
        <div className="space-y-3">
          {[0, 1, 2].map((item) => (
            <Card key={item}>
              <div className="h-28 animate-pulse rounded-xl bg-white/5" />
            </Card>
          ))}
        </div>
      )}

      {!loading && !error && history.length === 0 && (
        <Card>
          <div className="py-14 text-center">
            <h2 className="mb-2 text-lg font-semibold text-white">No history yet</h2>
            <p className="mx-auto max-w-md text-sm text-gray-500">
              Searches from the dashboard will appear here after they complete.
            </p>
          </div>
        </Card>
      )}

      {!loading && !error && history.length > 0 && (
        <div className="space-y-4">
          {history.map((entry) => {
            const hasProduct = Boolean(entry.product_text?.trim());

            return (
              <Card key={entry.id}>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-500">{formatDate(entry.created_at)}</p>
                      <h2 className="mt-1 text-base font-semibold text-white break-words">{entry.query_text}</h2>
                      {entry.product_text && (
                        <p className="mt-1 text-xs text-gray-500 break-words">Product: {entry.product_text}</p>
                      )}
                    </div>
                    <span className="w-fit rounded-full bg-white/5 px-2.5 py-1 text-xs font-medium text-gray-300">
                      {entry.results.length} models
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
                    {entry.results.map((result) => {
                      const resultId = result.model ?? result.provider ?? "Unknown model";
                      const config = (result.model ? getFreeModel(result.model) : undefined) ?? legacyProviderConfig[resultId] ?? {
                        label: resultId,
                        color: "#9ca3af",
                      };
                      const tools = result.tools.slice(0, 3);

                      return (
                        <div
                          key={entry.id + "-" + resultId}
                          className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"
                        >
                          <div className="mb-3 flex items-center justify-between gap-3">
                            <p className="text-sm font-semibold" style={{ color: config.color }}>
                              {config.label}
                            </p>
                            <span
                              className={
                                "shrink-0 rounded-full px-2 py-1 text-[11px] font-medium " +
                                (result.error
                                  ? "bg-red-500/10 text-red-300"
                                  : hasProduct && result.appears
                                    ? "bg-emerald-500/10 text-emerald-300"
                                    : "bg-white/5 text-gray-300")
                              }
                            >
                              {getRankLabel(result, hasProduct)}
                            </span>
                          </div>

                          {result.error ? (
                            <p className="text-xs text-red-300">{result.error}</p>
                          ) : tools.length > 0 ? (
                            <ol className="space-y-1.5">
                              {tools.map((tool, index) => (
                                <li key={tool.name + "-" + (tool.url || index)} className="flex gap-2 text-xs">
                                  <span className="w-4 shrink-0 text-right font-mono text-gray-600">{index + 1}.</span>
                                  <div className="min-w-0 flex-1">
                                    <p className="truncate font-medium text-gray-200">{tool.name}</p>
                                    {tool.url && (
                                      <a
                                        href={tool.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block truncate text-gray-600 transition-colors hover:text-indigo-400"
                                      >
                                        {tool.url}
                                      </a>
                                    )}
                                  </div>
                                </li>
                              ))}
                            </ol>
                          ) : (
                            <p className="text-xs text-gray-600">No tools returned</p>
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
