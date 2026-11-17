export function calculateDiscountRate(originalPrice: number, salePrice: number) {
  if (originalPrice <= 0 || salePrice >= originalPrice) return 0;
  return Math.floor(((originalPrice - salePrice) * 100) / originalPrice);
}

export function formatPrice(priceWon: number) {
  return `${priceWon.toLocaleString("ko-KR")}원`;
}
