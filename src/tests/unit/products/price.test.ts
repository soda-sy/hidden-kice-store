import { describe, expect, it } from "vitest";
import { calculateDiscountRate, formatPrice } from "@/features/products/lib/price";

describe("calculateDiscountRate", () => {
  it("정가 대비 할인 비율을 정수 퍼센트로 계산한다", () => {
    expect(calculateDiscountRate(76000, 72200)).toBe(5);
    expect(calculateDiscountRate(120000, 96000)).toBe(20);
  });

  it("소수점 이하는 내림해 할인율을 과장하지 않는다", () => {
    expect(calculateDiscountRate(30000, 26100)).toBe(13);
    expect(calculateDiscountRate(30000, 26200)).toBe(12);
  });

  it("할인이 없거나 정가가 0 이하이거나 판매가가 더 높으면 0을 반환한다", () => {
    expect(calculateDiscountRate(40000, 40000)).toBe(0);
    expect(calculateDiscountRate(0, 0)).toBe(0);
    expect(calculateDiscountRate(10000, 12000)).toBe(0);
  });
});

describe("formatPrice", () => {
  it("천 단위 구분 기호와 '원'을 붙인다", () => {
    expect(formatPrice(64800)).toBe("64,800원");
    expect(formatPrice(0)).toBe("0원");
  });
});
