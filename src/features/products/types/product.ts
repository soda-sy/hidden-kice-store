export type ProductCategory = {
  code: string;
  name: string;
};

export type Product = {
  id: string;
  name: string;
  category: ProductCategory;
  thumbnailUrl: string | null;
  originalPrice: number;
  salePrice: number;
  discountRate: number;
};

export type ProductListParams = {
  keyword: string;
  categoryCode: string | null;
  page: number;
};

export type ProductPage = {
  products: Product[];
  totalCount: number;
};
