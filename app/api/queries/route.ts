import { NextResponse } from 'next/server';
import { getQueries, createQuery } from '@/lib/db/queries';

/** GET /api/queries — returns all queries */
export async function GET() {
  try {
    const queries = await getQueries();
    return NextResponse.json({ queries });
  } catch (error) {
    console.error('[Queries API] Failed to load queries:', error);
    return NextResponse.json({ error: 'Failed to load queries. Please try again.' }, { status: 500 });
  }
}

/** POST /api/queries — creates a query */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { label, search_text } = body;

    if (!label || !search_text) {
      return NextResponse.json(
        { error: 'label and search_text are required' },
        { status: 400 }
      );
    }

    const query = await createQuery(label, search_text);
    return NextResponse.json({ query }, { status: 201 });
  } catch (error) {
    console.error('[Queries API] Failed to create query:', error);
    return NextResponse.json({ error: 'Failed to save the query. Please try again.' }, { status: 500 });
  }
}
