export interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string;
  internalLink?: string;
  isActive: boolean;
  parentId?: string;
  createdAt: string;
  updatedAt?: string;
  children?: Category[];
  _count?: {
    products: number;
  };
  description?: string;
}

export interface GetCategoriesParams {
  limit?: number;
  isActive?: boolean;
  parentId?: string;
  includeChildren?: boolean;
}
