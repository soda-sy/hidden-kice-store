import type { Metadata } from "next";
import { Suspense } from "react";
import { ProductCatalog } from "@/features/products/components/ProductCatalog";
import { ProductGridSkeleton } from "@/features/products/components/ProductGrid";
import { PromoBanner } from "@/features/promotions/components/PromoBanner";

export const metadata: Metadata = {
  title: "스토어 | 히든카이스",
};

export default function StorePage() {
  return (
    <>
      <PromoBanner />
      <Suspense
        fallback={
          <div className="mx-auto w-full max-w-[1312px] px-4 py-[50px]">
            <ProductGridSkeleton />
          </div>
        }
      >
        <ProductCatalog />
      </Suspense>
    </>
  );
}
