import { NextResponse } from 'next/server';
import { getProducts, createProduct } from '@/lib/db/products';

/** GET /api/products — returns all products */
export async function GET() {
  try {
    const products = await getProducts();
    return NextResponse.json({ products });
  } catch (error) {
    console.error('[Products API] Failed to load products:', error);
    return NextResponse.json({ error: 'Failed to load products. Please try again.' }, { status: 500 });
  }
}

/** POST /api/products — creates a product */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, primary_domain } = body;

    if (!name || !primary_domain) {
      return NextResponse.json(
        { error: 'name and primary_domain are required' },
        { status: 400 }
      );
    }

    const product = await createProduct(name, primary_domain);
    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error('[Products API] Failed to create product:', error);
    return NextResponse.json({ error: 'Failed to save the product. Please try again.' }, { status: 500 });
  }
}
