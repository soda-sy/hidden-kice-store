import { http, HttpResponse } from "msw";
import { categoryRows, productRows, type ProductRowFixture } from "@/tests/fixtures/products";

const REST_URL = "https://test-project.supabase.co/rest/v1";

function ilikeToRegExp(pattern: string) {
  let source = "";
  for (let index = 0; index < pattern.length; index += 1) {
    const character = pattern[index];
    if (character === "\\") {
      index += 1;
      source += pattern[index].replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    } else if (character === "%") source += ".*";
    else if (character === "_") source += ".";
    else source += character.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
  return new RegExp(`^${source}$`, "i");
}

function filterProducts(rows: ProductRowFixture[], searchParams: URLSearchParams) {
  const categoryCode = searchParams.get("category.code")?.replace(/^eq\./, "");
  const namePattern = searchParams.get("name")?.replace(/^ilike\./, "");
  const nameRegExp = namePattern ? ilikeToRegExp(namePattern) : null;

  return rows
    .filter((row) => row.is_active)
    .filter((row) => !categoryCode || row.category.code === categoryCode)
    .filter((row) => !nameRegExp || nameRegExp.test(row.name))
    .sort((a, b) => a.display_order - b.display_order);
}

export const productRequests: URL[] = [];

export function productsHandler(rows: ProductRowFixture[] = productRows) {
  return http.all(`${REST_URL}/products`, ({ request }) => {
    const url = new URL(request.url);
    productRequests.push(url);

    const matchedRows = filterProducts(rows, url.searchParams);
    const offset = Number(url.searchParams.get("offset") ?? 0);
    const limit = Number(url.searchParams.get("limit") ?? matchedRows.length);
    const total = matchedRows.length;

    if (request.method === "HEAD") {
      return new HttpResponse(null, { headers: { "Content-Range": `*/${total}` } });
    }
    if (offset > 0 && offset >= total) {
      return HttpResponse.json(
        { code: "PGRST103", message: "Requested range not satisfiable", details: null, hint: null },
        { status: 416, headers: { "Content-Range": `*/${total}` } },
      );
    }

    const pageRows = matchedRows.slice(offset, offset + limit).map((row) => ({
      id: row.id,
      slug: row.slug,
      name: row.name,
      thumbnail_url: row.thumbnail_url,
      original_price: row.original_price,
      sale_price: row.sale_price,
      category: row.category,
    }));
    const rangeEnd = pageRows.length > 0 ? offset + pageRows.length - 1 : offset;
    return HttpResponse.json(pageRows, { headers: { "Content-Range": `${offset}-${rangeEnd}/${total}` } });
  });
}

export function productsErrorHandler() {
  return http.get(`${REST_URL}/products`, ({ request }) => {
    productRequests.push(new URL(request.url));
    return HttpResponse.json(
      { code: "XX000", message: "internal error", details: null, hint: null },
      { status: 500 },
    );
  });
}

export function categoriesHandler() {
  return http.get(`${REST_URL}/categories`, () => HttpResponse.json(categoryRows));
}

export function resetProductRequests() {
  productRequests.length = 0;
}
