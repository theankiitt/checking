export * from "./utils/index";
export { cn } from "./utils/index";

export function formatPrice(
  price: number,
  currency: string = "USD",
  locale: string = "en-US",
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(price);
}

export function calculateDiscountPercentage(
  comparePrice: number,
  currentPrice: number,
): number {
  if (comparePrice <= 0) return 0;
  return Math.round(((comparePrice - currentPrice) / comparePrice) * 100);
}

export function getEtaDate(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}
