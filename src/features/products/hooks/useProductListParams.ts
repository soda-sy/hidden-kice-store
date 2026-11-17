import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ProductListParams } from "../types/product";

function parsePage(rawPage: string | null) {
  const page = Number(rawPage);
  return Number.isInteger(page) && page > 0 ? page : 1;
}

function toQueryString({ keyword, categoryCode, page }: ProductListParams) {
  const searchParams = new URLSearchParams();
  if (keyword) searchParams.set("q", keyword);
  if (categoryCode) searchParams.set("category", categoryCode);
  if (page > 1) searchParams.set("page", String(page));
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
}

export function useProductListParams() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const params: ProductListParams = {
    keyword: searchParams.get("q")?.trim() ?? "",
    categoryCode: searchParams.get("category") || null,
    page: parsePage(searchParams.get("page")),
  };

  function navigate(nextParams: ProductListParams, mode: "push" | "replace") {
    router[mode](`${pathname}${toQueryString(nextParams)}`, { scroll: false });
  }

  return {
    params,
    changeKeyword: (keyword: string) =>
      navigate({ keyword, categoryCode: params.categoryCode, page: 1 }, "replace"),
    changeCategory: (categoryCode: string | null) =>
      navigate({ keyword: "", categoryCode, page: 1 }, "push"),
    changePage: (page: number) => navigate({ ...params, page }, "push"),
  };
}
