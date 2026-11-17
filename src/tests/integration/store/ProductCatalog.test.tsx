import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HttpResponse, http } from "msw";
import { beforeEach, describe, expect, it } from "vitest";
import { ProductCatalog } from "@/features/products/components/ProductCatalog";
import { server } from "@/tests/setup/server";
import { getMockUrl, setMockUrl } from "@/tests/utils/mockNavigation";
import { renderWithProviders as render } from "@/tests/utils/renderWithProviders";
import {
  categoriesHandler,
  productRequests,
  productsErrorHandler,
  productsHandler,
} from "@/tests/utils/supabaseHandlers";

function getProductNames() {
  return screen.getAllByRole("heading", { level: 3 }).map((heading) => heading.textContent);
}

async function waitForProducts() {
  await waitFor(() => expect(screen.queryByLabelText("상품을 불러오는 중")).not.toBeInTheDocument());
  await waitFor(() => expect(screen.getAllByRole("heading", { level: 3 }).length).toBeGreaterThan(0));
}

describe("ProductCatalog", () => {
  beforeEach(() => {
    server.use(productsHandler(), categoriesHandler());
  });

  it("로딩 표시 후 Supabase에서 조회한 첫 페이지 상품 12개와 페이지 번호를 보여 준다", async () => {
    render(<ProductCatalog />);

    expect(screen.getByLabelText("상품을 불러오는 중")).toBeInTheDocument();
    await waitForProducts();

    expect(getProductNames()).toHaveLength(12);
    expect(getProductNames()[0]).toBe("시즌1 국어 패스");
    const pagination = screen.getByRole("navigation", { name: "페이지 이동" });
    expect(within(pagination).getByRole("button", { name: "1" })).toHaveAttribute("aria-current", "page");
    expect(within(pagination).getByRole("button", { name: "2" })).toBeInTheDocument();
    expect(within(pagination).queryByRole("button", { name: "3" })).not.toBeInTheDocument();
  });

  it("다음 페이지로 이동하면 해당 페이지 상품만 조회한다", async () => {
    const user = userEvent.setup();
    render(<ProductCatalog />);
    await waitForProducts();

    await user.click(screen.getByRole("button", { name: "2" }));

    await waitFor(() => expect(getProductNames()).toEqual(["시즌13 국어 패스", "시즌14 수학"]));
    expect(getMockUrl()).toBe("/store?page=2");
    expect(productRequests.at(-1)?.searchParams.get("offset")).toBe("12");
  });

  it("카테고리를 선택하면 해당 카테고리 상품만 보여 주고 검색어·페이지를 초기화한다", async () => {
    const user = userEvent.setup();
    setMockUrl("/store?q=시즌&page=2");
    render(<ProductCatalog />);
    await waitForProducts();

    await user.click(await screen.findByRole("button", { name: "단품" }));

    await waitFor(() => expect(getProductNames()).toHaveLength(7));
    expect(getProductNames().every((name) => name?.endsWith("수학"))).toBe(true);
    expect(getMockUrl()).toBe("/store?category=single");
    expect(screen.getByRole("searchbox", { name: "상품명 검색" })).toHaveValue("");
    expect(screen.getByRole("button", { name: "단품" })).toHaveAttribute("aria-pressed", "true");
  });

  it("검색어를 입력하면 상품명으로 검색하고 첫 페이지로 이동한다", async () => {
    const user = userEvent.setup();
    setMockUrl("/store?page=2");
    render(<ProductCatalog />);
    await waitForProducts();

    await user.type(screen.getByRole("searchbox", { name: "상품명 검색" }), "시즌1 {Enter}");

    await waitFor(() =>
      expect(getProductNames()).toEqual([
        "시즌1 국어 패스",
        "시즌10 수학",
        "시즌11 국어 패스",
        "시즌12 수학",
        "시즌13 국어 패스",
        "시즌14 수학",
      ]),
    );
    expect(getMockUrl()).toBe("/store?q=%EC%8B%9C%EC%A6%8C1");
  });

  it("검색어를 지우면 전체 목록으로 돌아간다", async () => {
    const user = userEvent.setup();
    setMockUrl("/store?q=시즌1");
    render(<ProductCatalog />);
    await waitForProducts();
    expect(getProductNames()).toHaveLength(6);

    await user.click(screen.getByRole("button", { name: "검색어 지우기" }));

    await waitFor(() => expect(getProductNames()).toHaveLength(12));
    expect(getMockUrl()).toBe("/store");
  });

  it("검색 결과가 없으면 검색어와 함께 안내 문구를 보여 주고 페이지네이션을 숨긴다", async () => {
    setMockUrl("/store?q=없는상품");
    render(<ProductCatalog />);

    expect(await screen.findByText("'없는상품'에 대한 검색 결과가 없습니다.")).toBeInTheDocument();
    expect(screen.queryByRole("navigation", { name: "페이지 이동" })).not.toBeInTheDocument();
  });

  it("등록된 상품이 없으면 빈 목록 안내를 보여 준다", async () => {
    server.use(productsHandler([]));
    render(<ProductCatalog />);

    expect(await screen.findByText("등록된 상품이 없습니다.")).toBeInTheDocument();
  });

  it("존재하지 않는 페이지면 빈 목록과 실제 페이지 번호를 보여 준다", async () => {
    setMockUrl("/store?page=9");
    render(<ProductCatalog />);

    expect(await screen.findByText("등록된 상품이 없습니다.")).toBeInTheDocument();
    const pagination = screen.getByRole("navigation", { name: "페이지 이동" });
    expect(within(pagination).getByRole("button", { name: "2" })).toBeInTheDocument();
  });

  it("조회에 실패하면 무한 로딩 없이 오류 안내를 보여 주고, 다시 시도하면 목록을 보여 준다", async () => {
    const user = userEvent.setup();
    server.use(productsErrorHandler());
    render(<ProductCatalog />);

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("상품 목록을 불러오지 못했습니다.");
    expect(screen.queryByLabelText("상품을 불러오는 중")).not.toBeInTheDocument();
    expect(screen.queryByRole("navigation", { name: "페이지 이동" })).not.toBeInTheDocument();

    server.use(productsHandler());
    await user.click(within(alert).getByRole("button", { name: "다시 시도" }));

    await waitForProducts();
    expect(getProductNames()).toHaveLength(12);
  });

  it("카테고리 조회에 실패해도 상품 목록과 '전체' 필터는 보여 준다", async () => {
    server.use(
      http.get("https://test-project.supabase.co/rest/v1/categories", () =>
        HttpResponse.json({ code: "XX000", message: "error", details: null, hint: null }, { status: 500 }),
      ),
    );
    render(<ProductCatalog />);
    await waitForProducts();

    expect(getProductNames()).toHaveLength(12);
    expect(screen.getByRole("button", { name: "전체" })).toHaveAttribute("aria-pressed", "true");
  });
});
