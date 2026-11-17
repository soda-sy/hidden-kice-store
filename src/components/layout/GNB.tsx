import Image from "next/image";
import Link from "next/link";
import { ComingSoonButton } from "@/components/common/ComingSoonButton";

const COMING_SOON_MENUS = ["AI OMR WORK", "챌린지", "히든카이스 소개"];

const UTILITY_ICONS = [
  { label: "장바구니", src: "/icons/shopping-cart.svg", badgeCount: 1 },
  { label: "알림", src: "/icons/bell.svg", badgeCount: 1 },
  { label: "마이페이지", src: "/icons/user.svg", badgeCount: 0 },
];

const menuClassName =
  "relative inline-block py-1 text-body font-semibold transition-colors duration-200 md:text-body-lg after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-primary after:transition-transform after:duration-300 hover:after:scale-x-100";

export function GNB() {
  return (
    <header className="relative z-10 bg-white px-4 py-2.5 drop-shadow-[0_3px_2px_rgba(0,0,0,0.12)]">
      <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-y-2 md:h-20 md:flex-nowrap">
        <div className="contents md:flex md:flex-1 md:items-center md:gap-10 lg:gap-[100px]">
          <Link
            href="/store"
            aria-label="히든카이스 스토어 홈"
            className="flex h-12 items-center transition-opacity duration-200 hover:opacity-80 md:h-auto"
          >
            <Image src="/logo.svg" alt="HIDDEN KICE" width={143} height={17} priority />
          </Link>
          <nav aria-label="주요 메뉴" className="order-last w-full overflow-x-auto md:order-none md:w-auto md:overflow-visible">
            <ul className="flex gap-6 whitespace-nowrap lg:gap-8">
              <li>
                <Link href="/store" aria-current="page" className={`${menuClassName} text-primary`}>
                  스토어
                </Link>
              </li>
              {COMING_SOON_MENUS.map((label) => (
                <li key={label}>
                  <ComingSoonButton featureName={label} className={`${menuClassName} text-gray-300 hover:text-primary`}>
                    {label}
                  </ComingSoonButton>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <ul className="flex items-center gap-6">
          {UTILITY_ICONS.map(({ label, src, badgeCount }) => (
            <li key={label}>
              <ComingSoonButton
                featureName={label}
                aria-label={badgeCount > 0 ? `${label} (${badgeCount}개)` : label}
                className="relative block size-6 transition-transform duration-200 hover:-translate-y-0.5 hover:scale-110 active:scale-95"
              >
                <Image src={src} alt="" width={24} height={24} />
                {badgeCount > 0 && (
                  <span
                    aria-hidden
                    className="absolute -top-1.5 left-3 flex size-[15px] items-center justify-center rounded-full bg-primary text-[10px] leading-[1.4] text-white"
                  >
                    {badgeCount}
                  </span>
                )}
              </ComingSoonButton>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
