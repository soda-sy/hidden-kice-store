import type { ProductCategory } from "../types/product";

type ProductCategoryFilterProps = {
  categories: ProductCategory[];
  selectedCode: string | null;
  onSelect: (categoryCode: string | null) => void;
};

export function ProductCategoryFilter({ categories, selectedCode, onSelect }: ProductCategoryFilterProps) {
  const options = [{ code: null, name: "전체" }, ...categories];

  return (
    <ul aria-label="카테고리" className="flex items-center gap-[11px] text-body font-semibold">
      {options.map(({ code, name }, index) => {
        const isSelected = code === selectedCode;
        return (
          <li key={code ?? "all"} className="flex items-center gap-[11px]">
            {index > 0 && (
              <span aria-hidden className="text-gray-300">
                |
              </span>
            )}
            <button
              type="button"
              aria-pressed={isSelected}
              onClick={() => onSelect(code)}
              className={`transition-colors duration-200 ${isSelected ? "text-gray-800" : "text-gray-300 hover:text-primary"}`}
            >
              {name}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
