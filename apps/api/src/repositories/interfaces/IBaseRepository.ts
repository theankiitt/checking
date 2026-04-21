export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface BaseRepository<T, CreateDto, UpdateDto> {
  findById(
    id: string,
    options?: { include?: Record<string, any> },
  ): Promise<T | null>;
  findAll(
    options?: PaginationOptions & {
      where?: Record<string, any>;
      include?: Record<string, any>;
    },
  ): Promise<PaginatedResult<T>>;
  findOne(where: Record<string, any>): Promise<T | null>;
  create(data: CreateDto): Promise<T>;
  update(id: string, data: UpdateDto): Promise<T>;
  delete(id: string): Promise<boolean>;
  count(where?: Record<string, any>): Promise<number>;
}

export interface CachedRepository<T, CreateDto, UpdateDto>
  extends BaseRepository<T, CreateDto, UpdateDto> {
  findByIdCached(id: string, ttl?: number): Promise<T | null>;
  invalidateCache(pattern?: string): Promise<void>;
  refreshCache(id: string): Promise<T | null>;
}
