import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Pagination } from "@/components/common/Pagination";

function getPageNumbers() {
  const navigation = screen.getByRole("navigation", { name: "페이지 이동" });
  return within(navigation)
    .getAllByRole("button")
    .map((button) => button.textContent)
    .filter((text) => text !== "");
}

describe("Pagination", () => {
  it("전체 페이지가 5 이하이면 모든 페이지 번호를 보여 준다", () => {
    render(<Pagination currentPage={1} totalPages={3} onPageChange={vi.fn()} />);

    expect(getPageNumbers()).toEqual(["1", "2", "3"]);
  });

  it("페이지가 많으면 현재 페이지를 가운데 둔 5개 번호를 보여 준다", () => {
    const { rerender } = render(<Pagination currentPage={6} totalPages={10} onPageChange={vi.fn()} />);
    expect(getPageNumbers()).toEqual(["4", "5", "6", "7", "8"]);

    rerender(<Pagination currentPage={1} totalPages={10} onPageChange={vi.fn()} />);
    expect(getPageNumbers()).toEqual(["1", "2", "3", "4", "5"]);

    rerender(<Pagination currentPage={10} totalPages={10} onPageChange={vi.fn()} />);
    expect(getPageNumbers()).toEqual(["6", "7", "8", "9", "10"]);
  });

  it("현재 페이지를 aria-current로 표시한다", () => {
    render(<Pagination currentPage={2} totalPages={3} onPageChange={vi.fn()} />);

    expect(screen.getByRole("button", { name: "2" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("button", { name: "1" })).not.toHaveAttribute("aria-current");
  });

  it("첫 페이지에서는 이전, 마지막 페이지에서는 다음 버튼을 비활성화한다", () => {
    const { rerender } = render(<Pagination currentPage={1} totalPages={3} onPageChange={vi.fn()} />);
    expect(screen.getByRole("button", { name: "이전 페이지" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "다음 페이지" })).toBeEnabled();

    rerender(<Pagination currentPage={3} totalPages={3} onPageChange={vi.fn()} />);
    expect(screen.getByRole("button", { name: "이전 페이지" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "다음 페이지" })).toBeDisabled();
  });

  it("번호·이전·다음 버튼을 누르면 이동할 페이지를 알린다", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<Pagination currentPage={2} totalPages={3} onPageChange={onPageChange} />);

    await user.click(screen.getByRole("button", { name: "3" }));
    await user.click(screen.getByRole("button", { name: "이전 페이지" }));
    await user.click(screen.getByRole("button", { name: "다음 페이지" }));

    expect(onPageChange.mock.calls).toEqual([[3], [1], [3]]);
  });

  it("현재 페이지 번호를 다시 누르면 이동하지 않는다", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<Pagination currentPage={2} totalPages={3} onPageChange={onPageChange} />);

    await user.click(screen.getByRole("button", { name: "2" }));

    expect(onPageChange).not.toHaveBeenCalled();
  });
});
