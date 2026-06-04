import { NextRequest, NextResponse } from 'next/server';
import { getResultsForProductQuery } from '@/lib/db/results';

/**
 * GET /api/results?productId=...&queryId=...&provider=...
 *
 * Returns recent results for a product + query combination.
 * Optional `provider` filter (e.g., "chatgpt").
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const productId = searchParams.get('productId');
    const queryId = searchParams.get('queryId');
    const provider = searchParams.get('provider') ?? undefined;

    if (!productId || !queryId) {
      return NextResponse.json(
        { error: 'productId and queryId are required' },
        { status: 400 }
      );
    }

    const results = await getResultsForProductQuery(
      productId,
      queryId,
      provider,
      30
    );

    return NextResponse.json({ results });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
