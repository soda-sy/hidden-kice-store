import Image from "next/image";

const MAX_VISIBLE_PAGES = 5;

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

function getVisiblePages(currentPage: number, totalPages: number) {
  const start = Math.max(1, Math.min(currentPage - Math.floor(MAX_VISIBLE_PAGES / 2), totalPages - MAX_VISIBLE_PAGES + 1));
  const end = Math.min(totalPages, start + MAX_VISIBLE_PAGES - 1);
  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

const itemClassName =
  "flex size-10 items-center justify-center rounded-md border border-primary text-body-sm transition-[background-color,color,transform] duration-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100";
const idleItemClassName = "bg-white text-primary enabled:hover:bg-primary/10";

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  return (
    <nav aria-label="페이지 이동" className="flex w-full justify-center">
      <ul className="flex items-center gap-2">
        <li>
          <button
            type="button"
            aria-label="이전 페이지"
            className={`${itemClassName} ${idleItemClassName}`}
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            <Image src="/icons/chevron-left.svg" alt="" width={20} height={20} />
          </button>
        </li>
        {getVisiblePages(currentPage, totalPages).map((page) => {
          const isCurrent = page === currentPage;
          return (
            <li key={page}>
              <button
                type="button"
                aria-current={isCurrent ? "page" : undefined}
                className={`${itemClassName} ${isCurrent ? "cursor-default! bg-primary text-white active:scale-100" : idleItemClassName}`}
                onClick={() => !isCurrent && onPageChange(page)}
              >
                {page}
              </button>
            </li>
          );
        })}
        <li>
          <button
            type="button"
            aria-label="다음 페이지"
            className={`${itemClassName} ${idleItemClassName}`}
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          >
            <Image src="/icons/chevron-right.svg" alt="" width={20} height={20} />
          </button>
        </li>
      </ul>
    </nav>
  );
}
