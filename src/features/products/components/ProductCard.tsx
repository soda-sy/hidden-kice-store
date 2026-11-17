"use client";

import Image from "next/image";
import { useState } from "react";
import { getComingSoonMessage } from "@/components/common/ComingSoonButton";
import { useToast } from "@/components/common/Toast";
import { formatPrice } from "../lib/price";
import type { Product } from "../types/product";

export function ProductCard({ product }: { product: Product }) {
  const [hasImageError, setHasImageError] = useState(false);
  const { showToast } = useToast();
  const { name, category, thumbnailUrl, originalPrice, salePrice, discountRate } = product;
  const canShowImage = thumbnailUrl !== null && !hasImageError;

  return (
    <article className="group relative flex flex-col gap-1">
      <button
        type="button"
        aria-label={`${name} 상세 보기`}
        onClick={() => showToast(getComingSoonMessage("상품 상세 페이지"))}
        className="absolute inset-0 z-10 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
      />
      <div className="relative aspect-[250/320] overflow-hidden rounded-md border border-gray-50 bg-white transition-[border-color,box-shadow,translate] duration-300 group-hover:border-gray-100 group-hover:shadow-[0_10px_24px_rgba(28,30,33,0.08)] motion-safe:group-hover:-translate-y-1">
        {canShowImage ? (
          <Image
            src={thumbnailUrl}
            alt={name}
            fill
            sizes="(min-width: 1280px) 250px, (min-width: 768px) 33vw, 50vw"
            className="object-contain transition-transform duration-500 ease-out motion-safe:group-hover:scale-105"
            onError={() => setHasImageError(true)}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-body-sm text-gray-200">
            이미지를 불러올 수 없습니다
          </div>
        )}
      </div>
      <div className="flex flex-col text-body font-semibold">
        <p className="text-gray-300">{category.name}</p>
        <div className="flex flex-col gap-2">
          <h3 className="line-clamp-2 break-keep text-black transition-colors duration-200 group-hover:text-primary">
            {name}
          </h3>
          <div className="flex flex-col">
            {discountRate > 0 && (
              <p className="text-body-sm font-medium text-gray-200 line-through">
                <span className="sr-only">정가</span>
                {formatPrice(originalPrice)}
              </p>
            )}
            <p className="flex items-center gap-1.5">
              {discountRate > 0 && (
                <span className="text-secondary">
                  <span className="sr-only">할인율</span>
                  {discountRate}%
                </span>
              )}
              <span className="text-black">
                <span className="sr-only">판매가</span>
                {formatPrice(salePrice)}
              </span>
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
