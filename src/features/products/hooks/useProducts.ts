import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchProductCategories, fetchProducts } from "../services/productRepository";
import type { ProductListParams } from "../types/product";

export const productQueryKeys = {
  all: ["products"] as const,
  list: (params: ProductListParams) => [...productQueryKeys.all, "list", params] as const,
  categories: () => [...productQueryKeys.all, "categories"] as const,
};

export function useProducts(params: ProductListParams) {
  return useQuery({
    queryKey: productQueryKeys.list(params),
    queryFn: ({ signal }) => fetchProducts(params, signal),
    placeholderData: keepPreviousData,
  });
}

export function useProductCategories() {
  return useQuery({
    queryKey: productQueryKeys.categories(),
    queryFn: ({ signal }) => fetchProductCategories(signal),
    staleTime: 10 * 60 * 1000,
  });
}
