import { Product, Filters, PaginatedResponse } from "@/shared/types";

export interface ProductFilters extends Filters {
  includeReviews?: boolean;
  includeRelated?: boolean;
}

export interface ProductResponse {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface SingleProductResponse {
  product: Product;
}
