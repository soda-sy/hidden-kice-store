import { PRODUCTS_PER_PAGE } from "../constants/product";
import type { Product } from "../types/product";
import { ProductCard } from "./ProductCard";

const STAGGER_DELAY_MS = 40;

const gridClassName =
  "grid w-full grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 md:gap-x-6 xl:grid-cols-[repeat(4,250px)] xl:justify-between xl:gap-y-9";

export function ProductGrid({ products, isUpdating }: { products: Product[]; isUpdating: boolean }) {
  return (
    <ul
      aria-busy={isUpdating}
      className={`${gridClassName} transition-opacity duration-200 ${isUpdating ? "opacity-50" : "opacity-100"}`}
    >
      {products.map((product, index) => (
        <li
          key={product.id}
          className="motion-safe:animate-fade-in-up"
          style={{ animationDelay: `${index * STAGGER_DELAY_MS}ms` }}
        >
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );
}

export function ProductGridSkeleton() {
  return (
    <ul aria-busy aria-label="상품을 불러오는 중" className={gridClassName}>
      {Array.from({ length: PRODUCTS_PER_PAGE }, (_, index) => (
        <li key={index} className="flex flex-col gap-1 motion-safe:animate-pulse">
          <div className="aspect-[250/320] rounded-md bg-gray-50" />
          <div className="mt-1 h-5 w-12 rounded bg-gray-50" />
          <div className="h-5 w-3/4 rounded bg-gray-50" />
          <div className="h-5 w-1/2 rounded bg-gray-50" />
        </li>
      ))}
    </ul>
  );
}
