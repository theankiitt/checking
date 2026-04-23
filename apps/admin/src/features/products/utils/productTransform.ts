import {
  COUNTRY_CURRENCY_MAP,
  COUNTRY_SYMBOL_MAP,
  DEFAULT_CURRENCY_PRICE,
} from "../constants/productConstants";

export interface ProductFormData {
  name?: string;
  description?: string;
  shortDescription?: string;
  sku?: string;
  asin?: string;
  categoryId?: string;
  subCategoryId?: string;
  subSubCategoryId?: string;
  images?: string[];
  videos?: string[];
  thumbnail?: string;
  price?: number;
  comparePrice?: number;
  currencyPrices?: Array<{
    country: string;
    currency?: string;
    symbol?: string;
    price?: number;
    comparePrice?: number | null | string;
    minDeliveryDays?: number;
    maxDeliveryDays?: number;
    isActive?: boolean;
  }>;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
    unit?: string;
  };
  isActive?: boolean;
  isFeatured?: boolean;
  isNew?: boolean;
  isOnSale?: boolean;
  isBestSeller?: boolean;
  isDigital?: boolean;
  visibility?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  slug?: string;
  variants?: Array<{
    options?: Array<{
      price?: number;
      comparePrice?: number;
      additionalCost?: number;
      asin?: string;
    }>;
  }>;
  pricingTiers?: Array<{
    minQuantity: number;
    maxQuantity?: number;
    price: number;
    discount?: number;
  }>;
  customFields?: Array<{
    key: string;
    label: string;
    content: string;
    isVisible?: boolean;
  }>;
  attributes?: Array<{
    name: string;
    value: string;
    type?: string;
    isRequired?: boolean;
    isFilterable?: boolean;
    sortOrder?: number;
  }>;
  [key: string]: unknown;
}

export const generateSku = (): string => {
  return `SKU-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
};

export const generateAsin = (): string => {
  return `ASIN-${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 11)
    .toUpperCase()}`;
};

export const transformCurrencyPrices = (
  currencyPrices: ProductFormData["currencyPrices"],
  productData: ProductFormData,
): Array<{
  country: string;
  currency: string;
  symbol: string;
  price: number | undefined;
  comparePrice: number | string | undefined;
  minDeliveryDays: number;
  maxDeliveryDays: number;
  isActive: boolean;
}> => {
  if (currencyPrices && currencyPrices.length > 0) {
    return currencyPrices.map((cp) => ({
      country: cp.country,
      currency: cp.currency || COUNTRY_CURRENCY_MAP[cp.country] || "USD",
      symbol: cp.symbol || COUNTRY_SYMBOL_MAP[cp.country] || "$",
      price: cp.price,
      comparePrice:
        cp.comparePrice !== undefined &&
        cp.comparePrice !== null &&
        cp.comparePrice !== ""
          ? cp.comparePrice
          : undefined,
      minDeliveryDays: cp.minDeliveryDays || 1,
      maxDeliveryDays: cp.maxDeliveryDays || 7,
      isActive: cp.isActive !== false,
    }));
  }

  return [
    {
      ...DEFAULT_CURRENCY_PRICE,
      price: productData.price && productData.price > 0 ? productData.price : 0,
    },
  ];
};

export const transformVariants = (variants: ProductFormData["variants"]) => {
  if (!variants || variants.length === 0) {
    return [];
  }

  return variants.map((variant) => ({
    ...variant,
    options:
      variant.options && variant.options.length > 0
        ? variant.options.map((option) => ({
            ...option,
            price:
              option.price !== undefined ? Number(option.price) : undefined,
            comparePrice:
              option.comparePrice !== undefined
                ? Number(option.comparePrice)
                : undefined,
            additionalCost:
              option.additionalCost !== undefined
                ? Number(option.additionalCost)
                : 0,
            asin: option.asin !== undefined ? option.asin : undefined,
          }))
        : [],
  }));
};

export const transformProductData = (
  productData: ProductFormData,
  isUpdate: boolean = false,
) => {
  const currencyPrices = transformCurrencyPrices(
    productData.currencyPrices,
    productData,
  );

  const transformedData = {
    ...productData,
    sku: productData.sku || (isUpdate ? undefined : generateSku()),
    asin: productData.asin || (isUpdate ? undefined : generateAsin()),
    // Add top-level price from first currency price for backend compatibility
    price: currencyPrices[0]?.price ?? productData.price ?? 0,
    comparePrice: currencyPrices[0]?.comparePrice ?? productData.comparePrice ?? null,
    currencyPrices,
    variants: transformVariants(productData.variants),
  };

  if (productData.dimensions) {
    Object.assign(transformedData, {
      dimensions: {
        length: productData.dimensions.length || 0,
        width: productData.dimensions.width || 0,
        height: productData.dimensions.height || 0,
        unit: productData.dimensions.unit || "cm",
      },
    });
  }

  delete (transformedData as Record<string, unknown>)["currency"];
  delete (transformedData as Record<string, unknown>)["symbol"];

  return transformedData;
};
