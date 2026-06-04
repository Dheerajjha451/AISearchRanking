import { createClient } from '@/lib/supabase/server';
import type { DbProduct } from '@/lib/types';

/** Fetch all products */
export async function getProducts(): Promise<DbProduct[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(`Failed to fetch products: ${error.message}`);
  return data ?? [];
}

/** Create a new product */
export async function createProduct(
  name: string,
  primaryDomain: string
): Promise<DbProduct> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('products')
    .insert({ name, primary_domain: primaryDomain })
    .select()
    .single();

  if (error) throw new Error(`Failed to create product: ${error.message}`);
  return data;
}

/** Delete a product by ID */
export async function deleteProduct(productId: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', productId);

  if (error) throw new Error(`Failed to delete product: ${error.message}`);
}
