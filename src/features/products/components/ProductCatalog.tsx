"use client";

import { useRef } from "react";
import { Pagination } from "@/components/common/Pagination";
import { PRODUCTS_PER_PAGE } from "../constants/product";
import { useProductListParams } from "../hooks/useProductListParams";
import { useProductCategories, useProducts } from "../hooks/useProducts";
import { ProductCategoryFilter } from "./ProductCategoryFilter";
import { ProductGrid, ProductGridSkeleton } from "./ProductGrid";
import { ProductSearch } from "./ProductSearch";

export function ProductCatalog() {
  const { params, changeKeyword, changeCategory, changePage } = useProductListParams();
  const productsQuery = useProducts(params);
  const categoriesQuery = useProductCategories();
  const catalogRef = useRef<HTMLElement>(null);

  const totalCount = productsQuery.data?.totalCount ?? 0;
  const totalPages = Math.ceil(totalCount / PRODUCTS_PER_PAGE);

  function handlePageChange(page: number) {
    changePage(page);
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    catalogRef.current?.scrollIntoView({ block: "start", behavior: prefersReducedMotion ? "auto" : "smooth" });
  }

  function renderProducts() {
    if (productsQuery.isPending) return <ProductGridSkeleton />;

    if (productsQuery.isError) {
      return (
        <div role="alert" className="flex w-full flex-col items-center gap-4 py-20 text-center">
          <p className="text-body font-semibold text-gray-800">상품 목록을 불러오지 못했습니다.</p>
          <p className="text-body-sm text-gray-300">잠시 후 다시 시도해 주세요.</p>
          <button
            type="button"
            onClick={() => productsQuery.refetch()}
            className="rounded-md border border-primary px-4 py-2 text-body-sm text-primary transition-[background-color,color,transform] duration-200 hover:bg-primary hover:text-white active:scale-95"
          >
            다시 시도
          </button>
        </div>
      );
    }

    const { products } = productsQuery.data;
    if (products.length === 0) {
      return (
        <p className="w-full py-20 text-center text-body font-semibold text-gray-300">
          {params.keyword ? `'${params.keyword}'에 대한 검색 결과가 없습니다.` : "등록된 상품이 없습니다."}
        </p>
      );
    }

    return <ProductGrid products={products} isUpdating={productsQuery.isPlaceholderData} />;
  }

  return (
    <section
      ref={catalogRef}
      aria-label="상품 목록"
      className="mx-auto flex w-full max-w-[1312px] scroll-mt-4 flex-col gap-9 px-4 py-[50px]"
    >
      <div className="flex flex-wrap items-center justify-end gap-x-[17px] gap-y-3">
        <ProductSearch key={params.categoryCode ?? "all"} keyword={params.keyword} onKeywordChange={changeKeyword} />
        <ProductCategoryFilter
          categories={categoriesQuery.data ?? []}
          selectedCode={params.categoryCode}
          onSelect={changeCategory}
        />
      </div>
      <div className="flex flex-col gap-[46px]">
        {renderProducts()}
        {totalPages > 0 && !productsQuery.isError && (
          <Pagination currentPage={params.page} totalPages={totalPages} onPageChange={handlePageChange} />
        )}
      </div>
    </section>
  );
}
