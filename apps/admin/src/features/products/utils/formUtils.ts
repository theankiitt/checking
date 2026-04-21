import { ProductFormData } from "../types/product";

/**
 * Default form data for a new product
 */
export const DEFAULT_FORM_DATA: ProductFormData = {
  name: "",
  productCode: "",
  categoryId: "",
  subCategoryId: "",
  subSubCategoryId: "",
  isVariant: false,
  description: "",
  shortDescription: "",
  disclaimer: "",
  ingredients: "",
  additionalDetails: "",
  materialCare: "",
  showIngredients: false,
  showDisclaimer: false,
  showAdditionalDetails: false,
  showMaterialCare: false,
  sku: "",
  images: [],
  videos: [],
  thumbnail: "",
  seoTitle: "",
  seoDescription: "",
  seoKeywords: [],
  slug: "",
  metaTags: {},
  isActive: true,
  isDigital: false,
  isFeatured: false,
  isNew: false,
  isOnSale: false,
  isBestSeller: false,
  isSales: false,
  isNewSeller: false,
  isFestivalOffer: false,
  visibility: "VISIBLE",
  publishedAt: "",
  customFields: [],
  notes: "",
  variantAttributes: [],
};

/**
 * Get initial form data for product form
 * @param initialData - Optional initial data to populate the form
 * @returns Complete form data object
 */
export const getInitialFormData = (
  initialData?: Partial<ProductFormData>,
): ProductFormData => {
  return {
    ...DEFAULT_FORM_DATA,
    ...initialData,
  };
};

/**
 * Convert text to URL-friendly slug
 * @param text - Text to slugify
 * @returns URL-friendly slug string
 */
export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "-");
};

/**
 * Format price with currency symbol
 * @param price - Price to format
 * @param currency - Currency code (default: USD)
 * @returns Formatted price string
 */
export const formatPrice = (
  price: number,
  currency: string = "USD",
): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(price);
};
