import Image from "next/image";

const PROMO_BANNERS = [
  {
    id: "hidden-kice-2026-season7",
    imageSrc: "/images/banners/promo-banner.webp",
    alt: "히든카이스 - 모두가 푸는 건 이유가 있습니다. 상위권이 선택한 문제집, 결과로 증명된 실전 대비서",
  },
];

export function PromoBanner() {
  const currentBanner = PROMO_BANNERS[0];

  return (
    <section aria-label="프로모션" className="border-b border-border-subtle bg-[#f2f5f8]">
      <div className="relative aspect-[1440/490] w-full overflow-hidden xl:aspect-auto xl:h-[490px]">
        <Image
          src={currentBanner.imageSrc}
          alt={currentBanner.alt}
          fill
          preload
          sizes="100vw"
          className="object-cover"
        />
        <p className="absolute right-4 bottom-3 flex w-[60px] justify-center rounded-full bg-black/30 px-2.5 py-1 text-body-sm font-semibold text-white md:right-10 md:bottom-[30px]">
          <span>1</span>
          <span className="font-medium">/{PROMO_BANNERS.length}</span>
        </p>
      </div>
    </section>
  );
}
