export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice?: number;
  sku: string;
  category: string | { id: string; name: string; slug: string };
  categoryId: string;
  tags: string[];
  images: string[];
  isActive: boolean;
  stock: number;
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  createdAt: string;
  updatedAt: string;
  rating?: number;
  reviews?: number;
  isFeatured?: boolean;
  isDigital?: boolean;
}

export interface Brand {
  id: string;
  name: string;
  logo?: string;
  website?: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    products: number;
  };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
  children?: Category[];
  _count?: {
    products: number;
  };
}

export interface PricingTier {
  id?: string;
  minQuantity: number;
  maxQuantity?: number;
  price: number;
  discount?: number;
}

export interface CurrencyPrice {
  id?: string;
  country: string;
  currency: string;
  symbol: string;
  price?: number;
  comparePrice?: number;
  minDeliveryDays?: number;
  maxDeliveryDays?: number;
  isActive?: boolean;
}

export interface ProductAttribute {
  id?: string;
  name: string;
  value: string;
  type:
    | "TEXT"
    | "NUMBER"
    | "BOOLEAN"
    | "COLOR"
    | "IMAGE"
    | "SELECT"
    | "MULTI_SELECT";
  isRequired: boolean;
  isFilterable: boolean;
  sortOrder: number;
}

export interface CustomField {
  id?: string;
  title: string;
  content: string;
  sortOrder: number;
  isActive: boolean;
}

export interface GeneratedVariant {
  id: string;
  name: string;
  sku: string;
  size: string;
  color: string;
  price: number;
  comparePrice: number;
}

export interface ProductFormData {
  name: string;
  productCode: string;
  categoryId: string;
  subCategoryId: string;
  subSubCategoryId: string;
  isVariant: boolean;
  description: string;
  shortDescription: string;
  disclaimer: string;
  ingredients: string;
  additionalDetails: string;
  materialCare: string;
  showIngredients: boolean;
  showDisclaimer: boolean;
  showAdditionalDetails: boolean;
  showMaterialCare: boolean;
  sku: string;
  images: string[];
  videos: string[];
  thumbnail: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  slug: string;
  metaTags: Record<string, unknown>;
  isActive: boolean;
  isDigital: boolean;
  isFeatured: boolean;
  isNew: boolean;
  isOnSale: boolean;
  isBestSeller: boolean;
  isSales: boolean;
  isNewSeller: boolean;
  isFestivalOffer: boolean;
  visibility: string;
  publishedAt: string;
  customFields: CustomField[];
  notes: string;
  variantAttributes: string[];
  pricingTiers?: PricingTier[];
  currencyPrices?: CurrencyPrice[];
  attributes?: ProductAttribute[];
}
