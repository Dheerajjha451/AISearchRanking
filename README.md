# AI Search Ranking Monitor

A Next.js app for checking how free OpenRouter models rank products/tools for a search query. The dashboard lets people select models, compares their top recommendations, and stores completed searches in History.

## Features

- Select and compare free OpenRouter models, including GPT OSS and NVIDIA Nemotron options
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
SUPABASE_SERVICE_ROLE_KEY=
OPENROUTER_API_KEY=
```

4. Create the Supabase tables by running `supabase/schema.sql` in the Supabase SQL Editor.

Database access runs only on the server with `SUPABASE_SERVICE_ROLE_KEY`. Keep this key private: it bypasses Supabase RLS and must never be exposed through a `NEXT_PUBLIC_` variable.

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

Dashboard searches run only the free model IDs selected in the UI and do not enable OpenRouter's paid web plugin. Free model availability and rate limits are controlled by OpenRouter.

## Supabase Tables

The schema creates:

- `providers`
- `products`
- `queries`
- `runs`
- `results`
- `search_history`

`search_history` stores dashboard searches, including the query text, optional product text, provider result JSON, and timestamp.
