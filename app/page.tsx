'use client';

import { FormEvent, useState } from 'react';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import FailureCard from '@/components/atoms/FailureCard';
import type { RankedTool } from '@/lib/ranking/tools';
import { DEFAULT_MODEL_IDS, OPENROUTER_MODELS, getOpenRouterModel, type OpenRouterModelId } from '@/lib/models/free-models';

type SearchResult = {
  model: OpenRouterModelId;
  appears: boolean;
  rank: number | null;
  url: string | null;
  tools: RankedTool[];
  modelUsed: string | null;
  error: string | null;
};

function getRankLabel(result: SearchResult, hasProduct: boolean): string {
  if (!hasProduct) return 'Top 10 returned';
  if (result.appears && result.rank) return `Found at #${result.rank}`;
  return 'Not in top 10';
}

export default function DashboardPage() {
  const [query, setQuery] = useState('');
  const [product, setProduct] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedModels, setSelectedModels] = useState<OpenRouterModelId[]>(DEFAULT_MODEL_IDS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const hasProduct = product.trim().length > 0;

  const handleSearch = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, product, models: selectedModels }),
      });
      const data = (await response.json().catch(() => ({}))) as {
        error?: string;
        results?: SearchResult[];
      };

      if (!response.ok) {
        setResults([]);
        setError(data.error || 'We couldn\'t run the visibility check. Please try again.');
        return;
      }

      setResults(data.results ?? []);
    } catch {
      setResults([]);
      setError('We couldn\'t run the visibility check. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleModel = (modelId: OpenRouterModelId) => {
    setSelectedModels((current) =>
      current.includes(modelId) ? current.filter((id) => id !== modelId) : [...current, modelId]
    );
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 md:p-10">
      <header className="relative overflow-hidden border border-[#f4f1e8]/[0.16] bg-[#101010] px-6 py-8 shadow-[0_18px_55px_rgba(0,0,0,0.2)] sm:px-8 sm:py-10">
        <div className="absolute -right-12 -top-14 h-48 w-48 bg-[#f4f1e8]/[0.06] blur-3xl" />
        <div className="relative max-w-2xl">
          <p className="eyebrow mb-4">Search visibility intelligence</p>
          <h1 className="display-type text-4xl font-bold leading-[0.94] text-[#f4f1e8] sm:text-5xl">Know where AI puts you.</h1>
          <p className="mt-5 max-w-xl text-sm leading-6 text-[#f4f1e8]/65 sm:text-base">
            Compare the recommendations users see across leading OpenRouter models, then track whether your product earns a place in the answer.
          </p>
        </div>
        <div className="relative mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-[#f4f1e8]/65">
          <span className="flex items-center gap-2"><span className="h-2 w-2 bg-[#f4f1e8]" /> Live model comparison</span>
          <span className="font-mono text-[#f4f1e8]/45">TOP 10 / MODEL</span>
        </div>
      </header>

      <Card padding="lg">
        <form onSubmit={handleSearch} className="space-y-6">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between gap-4">
              <label htmlFor="ranking-query" className="text-xs font-semibold uppercase tracking-[0.12em] text-[#f4f1e8]/70">
                The question people ask
              </label>
              <span className="hidden text-[11px] text-[#f4f1e8]/40 sm:block">Be specific for a sharper comparison</span>
            </div>
            <textarea
              id="ranking-query"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Best AI CRM tools for B2B sales teams"
              rows={4}
              className="w-full resize-none border border-[#f4f1e8]/[0.16] bg-[#080808] px-4 py-3.5 text-sm text-[#f4f1e8] placeholder:text-[#f4f1e8]/35 transition-all duration-200 focus:border-[#f4f1e8] focus:outline-none focus:ring-1 focus:ring-[#f4f1e8]"
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-4 border-y border-[#f4f1e8]/[0.14] py-5 lg:grid-cols-[1fr_auto] lg:items-end">
            <Input
              id="product-check"
              label="Your product (optional)"
              placeholder="HubSpot, hubspot.com, or https://www.hubspot.com/products/crm"
              value={product}
              onChange={(event) => setProduct(event.target.value)}
            />
            <Button type="submit" loading={loading} className="h-[46px] px-6 font-semibold">
              {loading ? 'Analysing...' : 'Run visibility check'}
            </Button>
          </div>

          <fieldset>
            <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <legend className="text-xs font-semibold uppercase tracking-[0.12em] text-[#f4f1e8]/70">Comparison panel</legend>
                <p className="mt-1 text-xs text-[#f4f1e8]/45">Choose the models whose recommendations you want to audit.</p>
              </div>
              <p className="text-xs font-medium text-[#f4f1e8]">{selectedModels.length} selected</p>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
              {OPENROUTER_MODELS.map((model) => {
                const canRank = model.capability === 'ranking';
                const selected = canRank && selectedModels.includes(model.id);
                return (
                  <label
                    key={model.id}
                    className={`group flex items-center gap-3 border px-3.5 py-3 transition-all ${
                      canRank ? 'cursor-pointer' : 'cursor-not-allowed opacity-45'
                    } ${
                      selected ? 'border-[#f4f1e8] bg-[#f4f1e8]/[0.1]' : 'border-[#f4f1e8]/[0.12] bg-transparent hover:border-[#f4f1e8]/[0.35] hover:bg-[#f4f1e8]/[0.05]'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selected}
                      disabled={!canRank}
                      onChange={() => toggleModel(model.id)}
                      className="h-4 w-4 accent-[#f4f1e8]"
                    />
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-[#f4f1e8]">{model.label}</span>
                      <span className="mt-0.5 block truncate font-mono text-[10px] text-[#f4f1e8]/40">
                        {model.brand} · Free · {canRank ? 'Ranking' : model.capability} · {model.id}
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        </form>
      </Card>

      {error && (
        <FailureCard title="We couldn&apos;t run this check." message={error} label="Search unavailable" />
      )}

      {searched && !error && results.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <p className="eyebrow">Snapshot</p>
            <p className="text-xs text-[#f4f1e8]/45">{results.length} model responses</p>
          </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {results.map((result) => {
            const config = getOpenRouterModel(result.model) ?? {
              label: result.model,
            };

            return (
              <Card key={result.model} padding="sm" className="glass-hover">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#f4f1e8]/45">Model</p>
                    <p className="text-sm font-semibold text-[#f4f1e8]">
                      {config.label}
                    </p>
                  </div>
                  <span
                    className="border border-[#f4f1e8]/[0.16] px-2.5 py-1 text-xs font-medium text-[#f4f1e8]"
                  >
                    {getRankLabel(result, hasProduct)}
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
        </section>
      )}

      {searched && !error && results.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <p className="eyebrow">Recommendation detail</p>
            <p className="text-xs text-[#f4f1e8]/45">Ranked lists returned by each model</p>
          </div>
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          {results.map((result) => {
            const config = getOpenRouterModel(result.model) ?? {
              label: result.model,
            };

            return (
              <Card key={result.model} padding="sm" className="glass-hover">
                <div className="mb-3 flex items-center gap-2 border-b border-[#f4f1e8]/[0.16] px-1 pb-2.5">
                  <div className="h-2 w-2 bg-[#f4f1e8]" />
                  <span className="text-sm font-semibold text-[#f4f1e8]">
                    {config.label}
                  </span>
                </div>

                {result.error ? (
                  <div className="border border-[#f4f1e8]/[0.16] px-3 py-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#f4f1e8]">Model unavailable</p>
                    <p className="mt-2 text-xs leading-5 text-[#f4f1e8]/60">This model could not return recommendations for this query.</p>
                  </div>
                ) : result.tools.length > 0 ? (
                  <ol className="space-y-1.5">
                    {result.tools.map((tool, index) => {
                      const isMatch = hasProduct && result.rank === index + 1;

                      return (
                        <li
                          key={`${result.model}-${index}-${tool.url || tool.name}`}
                          className={`flex items-start gap-2 px-2 py-2 text-xs transition-colors ${
                            isMatch
                              ? 'border border-[#f4f1e8]/[0.34] bg-[#f4f1e8]/[0.08]'
                              : 'border border-transparent hover:bg-[#f4f1e8]/[0.05]'
                          }`}
                        >
                          <span className="w-5 shrink-0 text-right font-mono text-[#f4f1e8]/35">
                            {index + 1}.
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="truncate font-medium text-[#f4f1e8]">{tool.name}</span>
                              {isMatch && (
                                <span className="shrink-0 text-[11px] text-[#f4f1e8]">Match</span>
                              )}
                            </div>
                            {tool.url && (
                              <a
                                href={tool.url}
                                target="_blank"
                                rel="noopener noreferrer"
                            className="mt-0.5 block truncate text-[#f4f1e8]/40 transition-colors hover:text-[#f4f1e8]"
                              >
                                {tool.url}
                              </a>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                ) : (
                  <p className="px-2 py-4 text-center text-xs text-[#f4f1e8]/40">No tools returned</p>
                )}
              </Card>
            );
          })}
        </div>
        </section>
      )}

      {!searched && (
        <Card className="border-dashed bg-transparent">
          <div className="py-14 text-center">
            <p className="eyebrow mb-3">Ready when you are</p>
            <h2 className="display-type mb-3 text-2xl font-bold text-[#f4f1e8]">Start with a search query</h2>
            <p className="mx-auto max-w-md text-sm leading-6 text-[#f4f1e8]/60">
              The results will compare each selected model&apos;s top recommendations and your product&apos;s position when it appears.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
