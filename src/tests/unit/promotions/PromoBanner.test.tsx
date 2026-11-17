import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PromoBanner } from "@/features/promotions/components/PromoBanner";

describe("PromoBanner", () => {
  it("배너 이미지를 대체 텍스트와 함께 표시한다", () => {
    render(<PromoBanner />);

    expect(screen.getByRole("img", { name: /히든카이스/ })).toBeInTheDocument();
  });

  it("페이지 표시는 실제 배너 개수를 기준으로 보여 준다", () => {
    render(<PromoBanner />);

    expect(screen.getByRole("region", { name: "프로모션" })).toHaveTextContent("1/1");
  });
});
