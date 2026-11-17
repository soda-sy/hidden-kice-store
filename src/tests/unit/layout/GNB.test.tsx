import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { GNB } from "@/components/layout/GNB";
import { renderWithProviders as render } from "@/tests/utils/renderWithProviders";

describe("GNB", () => {
  it("현재 페이지인 스토어 메뉴는 스토어로 이동하는 링크다", () => {
    render(<GNB />);

    const storeLink = screen.getByRole("link", { name: "스토어" });
    expect(storeLink).toHaveAttribute("href", "/store");
    expect(storeLink).toHaveAttribute("aria-current", "page");
  });

  it.each(["AI OMR WORK", "챌린지", "히든카이스 소개"])("'%s' 메뉴를 누르면 준비 중 안내를 띄운다", async (menu) => {
    const user = userEvent.setup();
    render(<GNB />);

    await user.click(screen.getByRole("button", { name: menu }));

    expect(screen.getByRole("status")).toHaveTextContent(`'${menu}' 준비 중이에요. 곧 만나요!`);
  });

  it("장바구니·알림·마이페이지 아이콘은 배지 수를 포함한 이름을 갖고, 누르면 준비 중 안내를 띄운다", async () => {
    const user = userEvent.setup();
    render(<GNB />);

    await user.click(screen.getByRole("button", { name: "장바구니 (1개)" }));
    expect(screen.getByRole("status")).toHaveTextContent("'장바구니' 준비 중이에요.");

    expect(screen.getByRole("button", { name: "알림 (1개)" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "마이페이지" })).toBeInTheDocument();
  });
});
