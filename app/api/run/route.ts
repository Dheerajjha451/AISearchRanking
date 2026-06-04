import { NextResponse } from 'next/server';
import { runRankingCheck } from '@/lib/ranking/runRankingCheck';

/**
 * POST /api/run — Manually trigger a ranking check.
 *
 * Can also be used as a Vercel Cron target:
 *   vercel.json → { "crons": [{ "path": "/api/run", "schedule": "0 2 * * *" }] }
 *
 * Or via curl:
 *   curl -X POST https://your-app.vercel.app/api/run
 */
export async function POST() {
  try {
    const summary = await runRankingCheck();
    return NextResponse.json({ summary });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// Allow GET as well for cron compatibility
export async function GET() {
  return POST();
}
