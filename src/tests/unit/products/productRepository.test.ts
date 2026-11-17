import { HttpResponse, http } from "msw";
import { describe, expect, it } from "vitest";
import { fetchProductCategories, fetchProducts } from "@/features/products/services/productRepository";
import { server } from "@/tests/setup/server";
import { categoriesHandler, productRequests, productsErrorHandler, productsHandler } from "@/tests/utils/supabaseHandlers";

const signal = new AbortController().signal;

describe("fetchProducts", () => {
  it("노출 상품을 정렬·페이지 범위로 조회하고 화면용 모델로 변환한다", async () => {
    server.use(productsHandler());

    const result = await fetchProducts({ keyword: "", categoryCode: null, page: 1 }, signal);

    expect(result.totalCount).toBe(14);
    expect(result.products).toHaveLength(12);
    expect(result.products[0]).toEqual({
      id: "00000000-0000-0000-0000-000000000001",
      name: "시즌1 국어 패스",
      category: { code: "pass", name: "패스" },
      thumbnailUrl: "/images/products/product-hidden-kice.png",
      originalPrice: 76000,
      salePrice: 72200,
      discountRate: 5,
    });

    const params = productRequests[0].searchParams;
    expect(params.get("select")?.replaceAll(" ", "")).toBe(
      "id,name,thumbnail_url,original_price,sale_price,category:categories!inner(code,name)",
    );
    expect(params.get("is_active")).toBe("eq.true");
    expect(params.get("order")).toBe("display_order.asc,id.asc");
    expect(params.get("offset")).toBe("0");
    expect(params.get("limit")).toBe("12");
  });

  it("두 번째 페이지는 offset 12부터 조회한다", async () => {
    server.use(productsHandler());

    const result = await fetchProducts({ keyword: "", categoryCode: null, page: 2 }, signal);

    expect(productRequests[0].searchParams.get("offset")).toBe("12");
    expect(result.products.map((product) => product.name)).toEqual(["시즌13 국어 패스", "시즌14 수학"]);
  });

  it("카테고리 코드와 검색어를 조회 조건으로 보낸다", async () => {
    server.use(productsHandler());

    const result = await fetchProducts({ keyword: "국어", categoryCode: "pass", page: 1 }, signal);

    const params = productRequests[0].searchParams;
    expect(params.get("category.code")).toBe("eq.pass");
    expect(params.get("name")).toBe("ilike.%국어%");
    expect(result.products.every((product) => product.category.code === "pass")).toBe(true);
  });

  it("검색어의 %, _, \\ 는 LIKE 와일드카드가 아닌 문자로 이스케이프한다", async () => {
    server.use(productsHandler());

    await fetchProducts({ keyword: "50%_할인\\", categoryCode: null, page: 1 }, signal);

    expect(productRequests[0].searchParams.get("name")).toBe("ilike.%50\\%\\_할인\\\\%");
  });

  it("범위를 벗어난 페이지는 빈 목록과 실제 전체 개수를 반환한다", async () => {
    server.use(productsHandler());

    const result = await fetchProducts({ keyword: "", categoryCode: null, page: 5 }, signal);

    expect(result).toEqual({ products: [], totalCount: 14 });
  });

  it("조회에 실패하면 오류를 던진다", async () => {
    server.use(productsErrorHandler());

    await expect(fetchProducts({ keyword: "", categoryCode: null, page: 1 }, signal)).rejects.toMatchObject({
      code: "XX000",
    });
  });
});

describe("fetchProductCategories", () => {
  it("활성 카테고리를 표시 순서대로 조회한다", async () => {
    let requestUrl: URL | undefined;
    server.use(categoriesHandler());
    server.events.on("request:start", ({ request }) => {
      requestUrl = new URL(request.url);
    });

    const categories = await fetchProductCategories(signal);

    expect(categories).toEqual([
      { code: "pass", name: "패스" },
      { code: "single", name: "단품" },
    ]);
    expect(requestUrl?.searchParams.get("is_active")).toBe("eq.true");
    expect(requestUrl?.searchParams.get("order")).toBe("display_order.asc");
    server.events.removeAllListeners();
  });

  it("조회에 실패하면 오류를 던진다", async () => {
    server.use(
      http.get("https://test-project.supabase.co/rest/v1/categories", () =>
        HttpResponse.json({ code: "XX000", message: "error", details: null, hint: null }, { status: 500 }),
      ),
    );

    await expect(fetchProductCategories(signal)).rejects.toMatchObject({ code: "XX000" });
  });
});
