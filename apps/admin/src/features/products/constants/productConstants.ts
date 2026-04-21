export interface CurrencyOption {
  country: string;
  currency: string;
  symbol: string;
}

export const CURRENCY_OPTIONS: CurrencyOption[] = [
  { country: "United States", currency: "USD", symbol: "$" },
  { country: "United Kingdom", currency: "GBP", symbol: "£" },
  { country: "European Union", currency: "EUR", symbol: "€" },
  { country: "Canada", currency: "CAD", symbol: "C$" },
  { country: "Australia", currency: "AUD", symbol: "A$" },
  { country: "Japan", currency: "JPY", symbol: "¥" },
  { country: "India", currency: "INR", symbol: "₹" },
  { country: "China", currency: "CNY", symbol: "¥" },
  { country: "Nepal", currency: "NPR", symbol: "Rs." },
  { country: "Bangladesh", currency: "BDT", symbol: "৳" },
  { country: "Pakistan", currency: "PKR", symbol: "Rs." },
  { country: "Sri Lanka", currency: "LKR", symbol: "Rs." },
];

export const COUNTRY_CURRENCY_MAP: Record<string, string> = {
  "United States": "USD",
  USA: "USD",
  UK: "GBP",
  "United Kingdom": "GBP",
  Australia: "AUD",
  Canada: "CAD",
  India: "INR",
  China: "CNY",
  Japan: "JPY",
  Singapore: "SGD",
  UAE: "AED",
  Nepal: "NPR",
};

export const COUNTRY_SYMBOL_MAP: Record<string, string> = {
  "United States": "$",
  USA: "$",
  UK: "£",
  "United Kingdom": "£",
  Australia: "$",
  Canada: "$",
  India: "₹",
  China: "¥",
  Japan: "¥",
  Singapore: "$",
  UAE: "د.إ",
  Nepal: "Rs.",
};

export const WEIGHT_UNITS = ["kg", "g", "lb", "oz"] as const;

export const DEFAULT_CURRENCY_PRICE = {
  country: "USA",
  currency: "USD",
  symbol: "$",
  price: 1,
  comparePrice: undefined as number | undefined,
  minDeliveryDays: 1,
  maxDeliveryDays: 7,
  isActive: true,
};

export const PRODUCT_TABS = [
  { id: "identity", label: "Product Identity" },
  { id: "details", label: "Product Details" },
  { id: "pricing", label: "Pricing" },
  { id: "inventory", label: "Inventory" },
  { id: "media", label: "Media" },
  { id: "seo", label: "SEO" },
  { id: "settings", label: "Settings" },
] as const;

export const VARIANT_TAB = { id: "variants", label: "Variants" } as const;
