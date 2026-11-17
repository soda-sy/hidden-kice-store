import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ProductCategoryFilter } from "@/features/products/components/ProductCategoryFilter";
import { categoryRows } from "@/tests/fixtures/products";

describe("ProductCategoryFilter", () => {
  it("'전체' 뒤에 카테고리를 표시 순서대로 보여 준다", () => {
    render(<ProductCategoryFilter categories={categoryRows} selectedCode={null} onSelect={vi.fn()} />);

    expect(screen.getAllByRole("button").map((button) => button.textContent)).toEqual(["전체", "패스", "단품"]);
  });

  it("선택된 카테고리를 aria-pressed로 표시한다", () => {
    render(<ProductCategoryFilter categories={categoryRows} selectedCode="pass" onSelect={vi.fn()} />);

    expect(screen.getByRole("button", { name: "패스" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "전체" })).toHaveAttribute("aria-pressed", "false");
  });

  it("카테고리를 누르면 코드로, '전체'를 누르면 null로 선택을 알린다", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<ProductCategoryFilter categories={categoryRows} selectedCode="pass" onSelect={onSelect} />);

    await user.click(screen.getByRole("button", { name: "단품" }));
    await user.click(screen.getByRole("button", { name: "전체" }));

    expect(onSelect.mock.calls).toEqual([["single"], [null]]);
  });

  it("카테고리를 아직 불러오지 못했으면 '전체'만 보여 준다", () => {
    render(<ProductCategoryFilter categories={[]} selectedCode={null} onSelect={vi.fn()} />);

    expect(screen.getAllByRole("button").map((button) => button.textContent)).toEqual(["전체"]);
  });
});
