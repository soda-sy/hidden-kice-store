import { fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { ProductCard } from "@/features/products/components/ProductCard";
import type { Product } from "@/features/products/types/product";
import { renderWithProviders as render } from "@/tests/utils/renderWithProviders";

function createProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: "product-1",
    name: "2026 Hidden Kice 시즌7 국어 패스",
    category: { code: "pass", name: "패스" },
    thumbnailUrl: "/images/products/product-pass-set.png",
    originalPrice: 76000,
    salePrice: 72200,
    discountRate: 5,
    ...overrides,
  };
}

describe("ProductCard", () => {
  it("상품 유형·상품명·정가·할인율·판매가를 표시한다", () => {
    render(<ProductCard product={createProduct()} />);

    expect(screen.getByText("패스")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "2026 Hidden Kice 시즌7 국어 패스" })).toBeInTheDocument();
    expect(screen.getByText("76,000원")).toHaveClass("line-through");
    expect(screen.getByText("5%")).toBeInTheDocument();
    expect(screen.getByText("72,200원")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "2026 Hidden Kice 시즌7 국어 패스" })).toBeInTheDocument();
  });

  it("할인이 없으면 정가와 할인율 없이 판매가만 표시한다", () => {
    render(
      <ProductCard
        product={createProduct({
          category: { code: "single", name: "단품" },
          originalPrice: 40000,
          salePrice: 40000,
          discountRate: 0,
        })}
      />,
    );

    expect(screen.getByText("40,000원")).toBeInTheDocument();
    expect(screen.queryByText(/%$/)).not.toBeInTheDocument();
    expect(screen.queryByText("정가")).not.toBeInTheDocument();
  });

  it("이미지 로드에 실패하면 안내 문구로 대체한다", () => {
    render(<ProductCard product={createProduct()} />);

    fireEvent.error(screen.getByRole("img"));

    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(screen.getByText("이미지를 불러올 수 없습니다")).toBeInTheDocument();
  });

  it("썸네일이 없으면 이미지 대신 안내 문구를 표시한다", () => {
    render(<ProductCard product={createProduct({ thumbnailUrl: null })} />);

    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(screen.getByText("이미지를 불러올 수 없습니다")).toBeInTheDocument();
  });

  it("카드를 누르면 상품 상세 페이지 준비 중 안내를 띄운다", async () => {
    const user = userEvent.setup();
    render(<ProductCard product={createProduct()} />);

    await user.click(screen.getByRole("button", { name: "2026 Hidden Kice 시즌7 국어 패스 상세 보기" }));

    expect(screen.getByRole("status")).toHaveTextContent("'상품 상세 페이지' 준비 중이에요. 곧 만나요!");
  });
});
