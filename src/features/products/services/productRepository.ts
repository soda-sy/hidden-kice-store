import { supabase } from "@/lib/supabase/client";
import { PRODUCTS_PER_PAGE } from "../constants/product";
import { calculateDiscountRate } from "../lib/price";
import type { Product, ProductCategory, ProductListParams, ProductPage } from "../types/product";

const PRODUCT_LIST_COLUMNS =
  "id, slug, name, thumbnail_url, original_price, sale_price, category:categories!inner(code, name)";

const RANGE_NOT_SATISFIABLE = "PGRST103";

function escapeLikePattern(keyword: string) {
  return keyword.replace(/[\\%_]/g, (character) => `\\${character}`);
}

function selectProducts({ keyword, categoryCode }: Omit<ProductListParams, "page">, countOnly = false) {
  let query = supabase
    .from("products")
    .select(PRODUCT_LIST_COLUMNS, { count: "exact", head: countOnly })
    .eq("is_active", true);

  if (categoryCode) query = query.eq("category.code", categoryCode);
  if (keyword) query = query.ilike("name", `%${escapeLikePattern(keyword)}%`);

  return query;
}

export async function fetchProducts(
  { keyword, categoryCode, page }: ProductListParams,
  signal: AbortSignal,
): Promise<ProductPage> {
  const from = (page - 1) * PRODUCTS_PER_PAGE;
  const { data, error, count } = await selectProducts({ keyword, categoryCode })
    .order("display_order")
    .order("id")
    .range(from, from + PRODUCTS_PER_PAGE - 1)
    .abortSignal(signal);

  if (error?.code === RANGE_NOT_SATISFIABLE) {
    const countResult = await selectProducts({ keyword, categoryCode }, true).abortSignal(signal);
    if (countResult.error) throw countResult.error;
    return { products: [], totalCount: countResult.count ?? 0 };
  }
  if (error) throw error;

  return {
    products: data.map((row) => ({
      id: row.id,
      slug: row.slug,
      name: row.name,
      category: row.category,
      thumbnailUrl: row.thumbnail_url,
      originalPrice: row.original_price,
      salePrice: row.sale_price,
      discountRate: calculateDiscountRate(row.original_price, row.sale_price),
    })) satisfies Product[],
    totalCount: count ?? 0,
  };
}

export async function fetchProductCategories(signal: AbortSignal): Promise<ProductCategory[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("code, name")
    .eq("is_active", true)
    .order("display_order")
    .abortSignal(signal);

  if (error) throw error;
  return data;
}
