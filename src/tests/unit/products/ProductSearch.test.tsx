import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ProductSearch } from "@/features/products/components/ProductSearch";
import { SEARCH_DEBOUNCE_MS } from "@/features/products/constants/product";

function setup(keyword = "") {
  const onKeywordChange = vi.fn();
  const view = render(<ProductSearch keyword={keyword} onKeywordChange={onKeywordChange} />);
  return { onKeywordChange, input: screen.getByRole("searchbox", { name: "상품명 검색" }), ...view };
}

describe("ProductSearch", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("입력을 멈추고 debounce 시간이 지나면 마지막 검색어로 한 번만 검색한다", () => {
    const { input, onKeywordChange } = setup();

    fireEvent.change(input, { target: { value: "국" } });
    act(() => vi.advanceTimersByTime(SEARCH_DEBOUNCE_MS - 1));
    fireEvent.change(input, { target: { value: "국어" } });
    act(() => vi.advanceTimersByTime(SEARCH_DEBOUNCE_MS - 1));
    expect(onKeywordChange).not.toHaveBeenCalled();

    act(() => vi.advanceTimersByTime(1));
    expect(onKeywordChange).toHaveBeenCalledTimes(1);
    expect(onKeywordChange).toHaveBeenCalledWith("국어");
  });

  it("Enter로 제출하면 기다리지 않고 앞뒤 공백을 제거해 바로 검색한다", () => {
    const { input, onKeywordChange } = setup();

    fireEvent.change(input, { target: { value: "  수학 " } });
    fireEvent.submit(input);

    expect(onKeywordChange).toHaveBeenCalledTimes(1);
    expect(onKeywordChange).toHaveBeenCalledWith("수학");
    act(() => vi.advanceTimersByTime(SEARCH_DEBOUNCE_MS));
    expect(onKeywordChange).toHaveBeenCalledTimes(1);
  });

  it("검색어 지우기 버튼은 입력값을 비우고 검색어를 초기화한다", () => {
    const { input, onKeywordChange } = setup("국어");

    expect(input).toHaveValue("국어");
    fireEvent.click(screen.getByRole("button", { name: "검색어 지우기" }));

    expect(input).toHaveValue("");
    expect(onKeywordChange).toHaveBeenCalledWith("");
  });

  it("입력값이 없으면 지우기 버튼을 비활성화한다", () => {
    setup();

    expect(screen.getByRole("button", { name: "검색어 지우기" })).toBeDisabled();
  });

  it("현재 검색어와 같은 값이면 다시 검색하지 않는다", () => {
    const { input, onKeywordChange } = setup("국어");

    fireEvent.change(input, { target: { value: "국어 " } });
    act(() => vi.advanceTimersByTime(SEARCH_DEBOUNCE_MS));

    expect(onKeywordChange).not.toHaveBeenCalled();
  });

  it("외부에서 검색어가 바뀌면(뒤로가기 등) 입력값을 맞춘다", () => {
    const { input, rerender, onKeywordChange } = setup("국어");

    rerender(<ProductSearch keyword="수학" onKeywordChange={onKeywordChange} />);

    expect(input).toHaveValue("수학");
  });

  it("언마운트되면 대기 중인 검색을 취소한다", () => {
    const { input, onKeywordChange, unmount } = setup();

    fireEvent.change(input, { target: { value: "국어" } });
    unmount();
    act(() => vi.advanceTimersByTime(SEARCH_DEBOUNCE_MS));

    expect(onKeywordChange).not.toHaveBeenCalled();
  });
});
