export interface Brand {
  id: string;
  name: string;
  logo?: string;
  website?: string;
  createdAt: Date;
  updatedAt: Date;
  _count?: {
    products: number;
  };
}

export interface CreateBrandDto {
  name: string;
  logo: string;
  website: string;
}

export interface UpdateBrandDto {
  name?: string;
  logo?: string;
  website?: string;
}

export interface IBrandRepository {
  findById(
    id: string,
    options?: { include?: Record<string, any> },
  ): Promise<Brand | null>;
  findAll(options?: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    where?: Record<string, any>;
    include?: Record<string, any>;
  }): Promise<{
    data: Brand[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }>;
  findByName(name: string): Promise<Brand | null>;
  findBySlug(slug: string): Promise<Brand | null>;
  findAllActive(): Promise<Brand[]>;
  search(query: string): Promise<Brand[]>;
  create(data: CreateBrandDto): Promise<Brand>;
  update(id: string, data: UpdateBrandDto): Promise<Brand>;
  delete(id: string): Promise<boolean>;
  count(where?: Record<string, any>): Promise<number>;
}
