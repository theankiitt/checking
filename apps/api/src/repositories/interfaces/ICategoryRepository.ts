import { CachedRepository, PaginatedResult } from "./IBaseRepository";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive: boolean;
  parentId?: string;
  parent?: Category;
  children?: Category[];
  createdAt: Date;
  updatedAt: Date;
  internalLink?: string;
  additionalDetails?: string;
  disclaimer?: string;
  howToCare?: string;
  faqs?: any;
  _count?: {
    products: number;
  };
}

export interface CreateCategoryDto {
  name: string;
  slug?: string;
  description?: string;
  image?: string;
  internalLink?: string;
  parentId?: string | null;
  disclaimer?: string;
  additionalDetails?: string;
  howToCare?: string;
  faqs?: any;
  isActive?: boolean;
}

export interface UpdateCategoryDto {
  name?: string;
  slug?: string;
  description?: string;
  image?: string;
  internalLink?: string;
  parentId?: string | null;
  disclaimer?: string;
  additionalDetails?: string;
  howToCare?: string;
  faqs?: any;
  isActive?: boolean;
}

export interface ICategoryRepository {
  findById(
    id: string,
    options?: { include?: Record<string, any> },
  ): Promise<Category | null>;
  findAll(options?: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    where?: Record<string, any>;
    include?: Record<string, any>;
  }): Promise<{
    data: Category[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }>;
  findBySlug(slug: string): Promise<Category | null>;
  findBySlugCached(slug: string, ttl?: number): Promise<Category | null>;
  findAllWithHierarchy(includeInactive?: boolean): Promise<Category[]>;
  findByParentId(
    parentId: string | null,
    includeInactive?: boolean,
  ): Promise<Category[]>;
  findTree(includeInactive?: boolean): Promise<Category[]>;
  getCategoriesWithCounts(): Promise<Category[]>;
  create(data: CreateCategoryDto): Promise<Category>;
  update(id: string, data: UpdateCategoryDto): Promise<Category>;
  delete(id: string): Promise<boolean>;
  count(where?: Record<string, any>): Promise<number>;
}
