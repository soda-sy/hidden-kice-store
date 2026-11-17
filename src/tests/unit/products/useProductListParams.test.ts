import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useProductListParams } from "@/features/products/hooks/useProductListParams";
import { getMockUrl, mockRouter, setMockUrl } from "@/tests/utils/mockNavigation";

describe("useProductListParams", () => {
  it("쿼리가 없으면 전체 카테고리·첫 페이지·빈 검색어를 사용한다", () => {
    const { result } = renderHook(() => useProductListParams());

    expect(result.current.params).toEqual({ keyword: "", categoryCode: null, page: 1 });
  });

  it("URL 쿼리에서 검색어·카테고리·페이지를 읽는다", () => {
    setMockUrl("/store?q=%20국어%20&category=pass&page=3");
    const { result } = renderHook(() => useProductListParams());

    expect(result.current.params).toEqual({ keyword: "국어", categoryCode: "pass", page: 3 });
  });

  it.each(["0", "-1", "1.5", "abc", ""])("잘못된 페이지 값(%s)은 1페이지로 처리한다", (rawPage) => {
    setMockUrl(`/store?page=${rawPage}`);
    const { result } = renderHook(() => useProductListParams());

    expect(result.current.params.page).toBe(1);
  });

  it("검색어를 바꾸면 카테고리는 유지하고 1페이지로 이동하며 히스토리를 쌓지 않는다", () => {
    setMockUrl("/store?category=pass&page=2");
    const { result } = renderHook(() => useProductListParams());

    act(() => result.current.changeKeyword("수학"));

    expect(mockRouter.replace).toHaveBeenCalledTimes(1);
    expect(mockRouter.push).not.toHaveBeenCalled();
    expect(result.current.params).toEqual({ keyword: "수학", categoryCode: "pass", page: 1 });
  });

  it("카테고리를 바꾸면 검색어와 페이지를 초기화한다", () => {
    setMockUrl("/store?q=국어&page=2");
    const { result } = renderHook(() => useProductListParams());

    act(() => result.current.changeCategory("single"));

    expect(mockRouter.push).toHaveBeenCalledTimes(1);
    expect(getMockUrl()).toBe("/store?category=single");
  });

  it("'전체'를 선택하면 category 쿼리를 제거한다", () => {
    setMockUrl("/store?category=pass");
    const { result } = renderHook(() => useProductListParams());

    act(() => result.current.changeCategory(null));

    expect(getMockUrl()).toBe("/store");
  });

  it("페이지를 바꾸면 검색어와 카테고리를 유지한다", () => {
    setMockUrl("/store?q=국어&category=pass");
    const { result } = renderHook(() => useProductListParams());

    act(() => result.current.changePage(2));

    expect(mockRouter.push).toHaveBeenCalledTimes(1);
    expect(result.current.params).toEqual({ keyword: "국어", categoryCode: "pass", page: 2 });
  });
});
