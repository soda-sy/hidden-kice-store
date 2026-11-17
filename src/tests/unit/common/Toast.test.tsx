import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { TOAST_DURATION_MS, TOAST_EXIT_MS, ToastProvider, useToast } from "@/components/common/Toast";

function ToastTrigger({ message }: { message: string }) {
  const { showToast } = useToast();
  return (
    <button type="button" onClick={() => showToast(message)}>
      {message} 띄우기
    </button>
  );
}

function renderTriggers(...messages: string[]) {
  render(
    <ToastProvider>
      {messages.map((message) => (
        <ToastTrigger key={message} message={message} />
      ))}
    </ToastProvider>,
  );
}

function getToastMessages() {
  return Array.from(screen.getByRole("status").children).map((toast) => toast.textContent);
}

describe("ToastProvider", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("showToast를 호출하면 메시지를 스크린 리더가 읽을 수 있는 영역에 표시한다", () => {
    renderTriggers("준비 중");

    fireEvent.click(screen.getByRole("button", { name: "준비 중 띄우기" }));

    expect(screen.getByRole("status")).toHaveAttribute("aria-live", "polite");
    expect(getToastMessages()).toEqual(["준비 중"]);
  });

  it("표시 시간이 지나면 사라지는 애니메이션 후 제거한다", () => {
    renderTriggers("준비 중");
    fireEvent.click(screen.getByRole("button", { name: "준비 중 띄우기" }));

    act(() => vi.advanceTimersByTime(TOAST_DURATION_MS));
    expect(screen.getByText("준비 중")).toHaveClass("motion-safe:animate-toast-out");

    act(() => vi.advanceTimersByTime(TOAST_EXIT_MS));
    expect(getToastMessages()).toEqual([]);
  });

  it("같은 메시지를 연달아 띄우면 쌓지 않고 하나만 보여 준다", () => {
    renderTriggers("준비 중");
    const trigger = screen.getByRole("button", { name: "준비 중 띄우기" });

    fireEvent.click(trigger);
    fireEvent.click(trigger);
    fireEvent.click(trigger);

    expect(getToastMessages()).toEqual(["준비 중"]);
  });

  it("다시 띄운 같은 메시지는 새로 표시 시간을 센다", () => {
    renderTriggers("준비 중");
    const trigger = screen.getByRole("button", { name: "준비 중 띄우기" });

    fireEvent.click(trigger);
    act(() => vi.advanceTimersByTime(TOAST_DURATION_MS - 100));
    fireEvent.click(trigger);
    act(() => vi.advanceTimersByTime(TOAST_EXIT_MS + 100));

    expect(getToastMessages()).toEqual(["준비 중"]);
  });

  it("서로 다른 메시지는 최근 3개까지만 보여 준다", () => {
    renderTriggers("A", "B", "C", "D");

    for (const message of ["A", "B", "C", "D"]) {
      fireEvent.click(screen.getByRole("button", { name: `${message} 띄우기` }));
    }

    expect(getToastMessages()).toEqual(["B", "C", "D"]);
  });

  it("ToastProvider 밖에서 useToast를 쓰면 오류를 던진다", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => render(<ToastTrigger message="오류" />)).toThrow("ToastProvider");
  });
});
