export type ProductRowFixture = {
  id: string;
  name: string;
  thumbnail_url: string | null;
  original_price: number;
  sale_price: number;
  display_order: number;
  is_active: boolean;
  category: { code: string; name: string };
};

export const categoryRows = [
  { code: "pass", name: "패스" },
  { code: "single", name: "단품" },
];

const [passCategory, singleCategory] = categoryRows;

export const productRows: ProductRowFixture[] = Array.from({ length: 14 }, (_, index) => {
  const isPass = index % 2 === 0;
  const order = index + 1;
  return {
    id: `00000000-0000-0000-0000-${String(order).padStart(12, "0")}`,
    name: isPass ? `시즌${order} 국어 패스` : `시즌${order} 수학`,
    thumbnail_url: "/images/products/product-hidden-kice.png",
    original_price: isPass ? 76000 : 40000,
    sale_price: isPass ? 72200 : 40000,
    display_order: order * 10,
    is_active: true,
    category: isPass ? passCategory : singleCategory,
  };
});
