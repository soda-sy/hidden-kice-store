import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Footer } from "@/components/layout/Footer";
import { renderWithProviders as render } from "@/tests/utils/renderWithProviders";

describe("Footer", () => {
  it("약관 메뉴·사업자 정보·저작권 표시를 보여 준다", () => {
    render(<Footer />);

    expect(screen.getByRole("button", { name: "이용약관" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "개인정보처리방침" })).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toHaveTextContent("사업자등록번호: 735-87-02522");
    expect(screen.getByText("Copyright © 2026 히든카이스. All rights reserved.")).toBeInTheDocument();
  });

  it("약관 메뉴를 누르면 준비 중 안내를 띄운다", async () => {
    const user = userEvent.setup();
    render(<Footer />);

    await user.click(screen.getByRole("button", { name: "이용약관" }));

    expect(screen.getByRole("status")).toHaveTextContent("'이용약관' 준비 중이에요. 곧 만나요!");
  });

  it("사업자정보확인 링크는 공정위 조회 페이지를 새 창으로 연다", () => {
    render(<Footer />);

    const link = screen.getByRole("link", { name: "사업자정보확인" });
    expect(link).toHaveAttribute("href", "https://www.ftc.go.kr/bizCommPop.do?wrkr_no=7358702522");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });
});
