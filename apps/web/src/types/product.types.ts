export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice?: number;
  discount?: number;
  image: string;
  thumbnail?: string;
  images?: string[];
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  brand?: {
    id: string;
    name: string;
    slug: string;
  };
  isOnSale?: boolean;
  isActive?: boolean;
  stock?: number;
  quantity?: number;
  description?: string;
  shortDescription?: string;
  averageRating?: number;
  reviewCount?: number;
  sku?: string;
}

export interface PaginatedProducts {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface GetProductsParams {
  page?: number;
  limit?: number;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sort?: "price_asc" | "price_desc" | "rating" | "newest";
  isOnSale?: boolean;
  isActive?: boolean;
  country?: string;
}
