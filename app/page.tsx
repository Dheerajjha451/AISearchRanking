'use client';

import { FormEvent, useState } from 'react';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
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
        setError(data.error || 'Search failed');
        return;
      }

      setResults(data.results ?? []);
    } catch {
      setResults([]);
      setError('Search failed. Check your API key and server logs.');
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
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-white">AI Ranking Monitor</h1>
        <p className="text-sm text-gray-500">
          Search a topic, see the top 10 AI recommendations, and optionally check your product rank.
        </p>
      </div>

      <Card>
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="ranking-query" className="text-sm font-medium text-gray-300">
              Search text
            </label>
            <textarea
              id="ranking-query"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Best AI CRM tools for B2B sales teams"
              rows={4}
              className="w-full resize-none px-4 py-3 rounded-xl text-sm text-white bg-white/5 border border-white/10 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-200"
              required
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4 items-end">
            <Input
              id="product-check"
              label="Product name or URL optional"
              placeholder="HubSpot, hubspot.com, or https://www.hubspot.com/products/crm"
              value={product}
              onChange={(event) => setProduct(event.target.value)}
            />
            <Button type="submit" loading={loading} className="h-[42px] px-6">
              {loading ? 'Searching...' : 'Search Rankings'}
            </Button>
          </div>

          <fieldset>
            <legend className="text-sm font-medium text-gray-300">OpenRouter models</legend>
            <p className="mt-1 text-xs text-gray-500">Choose one or more models to compare. GPT OSS 120B is paid; every other listed model uses its free endpoint.</p>
            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
              {OPENROUTER_MODELS.map((model) => {
                const selected = selectedModels.includes(model.id);
                return (
                  <label
                    key={model.id}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 transition-colors ${
                      selected ? 'border-indigo-400/50 bg-indigo-500/10' : 'border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04]'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => toggleModel(model.id)}
                      className="h-4 w-4 accent-indigo-500"
                    />
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium text-gray-100">{model.label}</span>
                      <span className="block truncate text-xs text-gray-500">{model.brand} · {model.access === 'paid' ? 'Paid' : 'Free'} · {model.id}</span>
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        </form>
      </Card>

      {error && (
        <Card padding="sm" className="border-red-500/20 bg-red-500/5">
          <p className="text-sm text-red-300">{error}</p>
        </Card>
      )}

      {searched && !error && results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {results.map((result) => {
            const config = getOpenRouterModel(result.model) ?? {
              label: result.model,
              color: '#9ca3af',
              bgColor: 'rgba(156,163,175,0.1)',
            };

            return (
              <Card key={result.model} padding="sm">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs text-gray-500">Model</p>
                    <p className="text-sm font-semibold" style={{ color: config.color }}>
                      {config.label}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      hasProduct
                        ? result.appears
                          ? 'bg-emerald-500/10 text-emerald-300'
                          : 'bg-amber-500/10 text-amber-300'
                        : 'bg-white/5 text-gray-300'
                    }`}
                  >
                    {getRankLabel(result, hasProduct)}
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {searched && !error && results.length > 0 && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {results.map((result) => {
            const config = getOpenRouterModel(result.model) ?? {
              label: result.model,
              color: '#9ca3af',
              bgColor: 'rgba(156,163,175,0.1)',
            };

            return (
              <Card key={result.model} padding="sm">
                <div
                  className="flex items-center gap-2 px-3 py-2 rounded-lg mb-3"
                  style={{ backgroundColor: config.bgColor }}
                >
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: config.color }} />
                  <span className="text-sm font-semibold" style={{ color: config.color }}>
                    {config.label}
                  </span>
                </div>

                {result.error ? (
                  <p className="text-xs text-red-300 px-2 py-4">{result.error}</p>
                ) : result.tools.length > 0 ? (
                  <ol className="space-y-1.5">
                    {result.tools.map((tool, index) => {
                      const isMatch = hasProduct && result.rank === index + 1;

                      return (
                        <li
                          key={`${result.model}-${index}-${tool.url || tool.name}`}
                          className={`flex items-start gap-2 text-xs py-2 px-2 rounded-lg transition-colors ${
                            isMatch
                              ? 'bg-emerald-500/10 border border-emerald-500/20'
                              : 'hover:bg-white/[0.03] border border-transparent'
                          }`}
                        >
                          <span className="text-gray-600 font-mono w-5 shrink-0 text-right">
                            {index + 1}.
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-gray-200 font-medium truncate">{tool.name}</span>
                              {isMatch && (
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
                      );
                    })}
                  </ol>
                ) : (
                  <p className="text-xs text-gray-600 px-2 py-4 text-center">No tools returned</p>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {!searched && (
        <Card>
          <div className="text-center py-14">
            <h2 className="text-lg font-semibold text-white mb-2">Start with a search query</h2>
            <p className="text-sm text-gray-500 max-w-md mx-auto">
              The results will compare each selected free model&apos;s top 10 recommendations and your product&apos;s position when it appears.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
