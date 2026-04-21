import { CachedRepository, PaginatedResult } from "./IBaseRepository";

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: any;
  comparePrice?: any;
  costPrice?: any;
  margin?: any;
  sku?: string;
  barcode?: string;
  images: string[];
  thumbnail?: string;
  isActive: boolean;
  isFeatured: boolean;
  isNew: boolean;
  isOnSale: boolean;
  isBestSeller: boolean;
  visibility: string;
  quantity: number;
  trackQuantity: boolean;
  manageStock: boolean;
  categoryId: string;
  subCategoryId?: string;
  brandId?: string;
  weight?: any;
  dimensions?: any;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: Date;
  updatedAt: Date;
  category?: any;
  brand?: any;
  variants?: any[];
  currencyPrices?: any[];
  reviews?: any[];
  _count?: {
    reviews: number;
  };
}

export interface ProductFilter {
  categoryId?: string;
  subCategoryId?: string;
  brandId?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  isFeatured?: boolean;
  isOnSale?: boolean;
  isBestSeller?: boolean;
  isActive?: boolean;
  visibility?: string;
  tags?: string[];
  minRating?: number;
}

export interface CreateProductDto {
  name: string;
  slug?: string;
  description?: string;
  price: number;
  categoryId: string;
  subCategoryId?: string;
  brandId?: string;
  sku?: string;
  images?: string[];
  thumbnail?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  isNew?: boolean;
  isOnSale?: boolean;
  isBestSeller?: boolean;
  quantity?: number;
  trackQuantity?: boolean;
  manageStock?: boolean;
  weight?: number;
  dimensions?: any;
  seoTitle?: string;
  seoDescription?: string;
  variants?: any[];
  currencyPrices?: any[];
  attributes?: any[];
}

export interface UpdateProductDto extends Partial<CreateProductDto> {
  price?: number;
}

export interface IProductRepository
  extends CachedRepository<Product, CreateProductDto, UpdateProductDto> {
  findBySlug(slug: string): Promise<Product | null>;
  findBySlugCached(slug: string, ttl?: number): Promise<Product | null>;
  findAllWithFilters(
    filter: ProductFilter,
    pagination: { page: number; limit: number },
  ): Promise<PaginatedResult<Product>>;
  findFeatured(limit?: number): Promise<Product[]>;
  findOnSale(limit?: number): Promise<Product[]>;
  findByCategory(categoryId: string, limit?: number): Promise<Product[]>;
  updateStock(id: string, quantity: number): Promise<Product>;
  incrementViewCount(id: string): Promise<void>;
  search(query: string, limit?: number): Promise<Product[]>;
}
