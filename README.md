# AI Search Ranking Monitor

A Next.js app for checking how AI providers rank products/tools for a search query. The dashboard runs the same query through Perplexity, ChatGPT, and Gemini adapters via OpenRouter, shows the top recommendations, and stores completed searches in History.

## Features

- Search one prompt across Perplexity, ChatGPT, and Gemini style adapters
- Optional product/domain rank check against the returned top 10 tools
- Search history page with previous queries, optional product text, and provider results
- Supabase-backed storage for products, queries, runs, results, providers, and search history
- API keys loaded from environment variables, not stored in the database
- Mobile responsive dashboard and history views

## Tech Stack

- Next.js 16 App Router
- React 19
- Tailwind CSS 4
- Supabase
- OpenRouter for model access
- Recharts for chart components

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a local env file:

```bash
cp .env.example .env.local
```

3. Fill in the required values in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENROUTER_API_KEY=
```

4. Create the Supabase tables by running `supabase/schema.sql` in the Supabase SQL Editor.

The schema enables open RLS policies for a no-auth, single-tenant setup. Do not use this policy model for a public multi-user production app without adding proper auth and access controls.

## Development

Start the dev server:

```bash
npm run dev
```

Open http://localhost:3000.

Useful scripts:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

## App Routes

- `/` - dashboard search experience
- `/history` - previous dashboard searches and provider results

## API Routes

- `POST /api/search` - runs a dashboard search and stores it in `search_history`
- `GET /api/history` - returns the latest saved searches
- `POST /api/run` - runs the stored products x queries x providers ranking workflow
- `GET /api/results` - returns stored ranking results
- `GET/POST /api/products` - product storage API used by the ranking workflow
- `GET/POST /api/queries` - query storage API used by the ranking workflow

## OpenRouter Behavior

All provider adapters use the same `OPENROUTER_API_KEY` from the server environment.

Each adapter tries its provider/latest model first, then falls back to current free model IDs when the paid/latest model fails. Free fallbacks run without the paid web plugin to avoid credit errors on accounts without purchased OpenRouter credits.

## Supabase Tables

The schema creates:

- `providers`
- `products`
- `queries`
- `runs`
- `results`
- `search_history`

`search_history` stores dashboard searches, including the query text, optional product text, provider result JSON, and timestamp.
