import { Prisma } from "@prisma/client";
import prisma from "@/config/database";
import { cacheService } from "@/services";

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

export abstract class BaseRepositoryImpl<T, CreateDto, UpdateDto> {
  protected abstract readonly model: any;
  protected abstract readonly modelName: string;
  protected abstract readonly defaultTTL: number;
  protected abstract getCacheKey(id: string): string;

  async findById(
    id: string,
    options?: { include?: Record<string, any> },
  ): Promise<T | null> {
    try {
      const result = await this.model.findUnique({
        where: { id },
        ...(options?.include && { include: options.include }),
      });
      return result as T;
    } catch (error) {
      throw this.handleError(error, `findById(${id})`);
    }
  }

  async findAll(options?: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    where?: Record<string, any>;
    include?: Record<string, any>;
  }): Promise<PaginatedResult<T>> {
    try {
      const page = options?.page || 1;
      const limit = options?.limit || 20;
      const skip = (page - 1) * limit;
      const orderBy = options?.sortBy
        ? { [options.sortBy]: options.sortOrder || "asc" }
        : { createdAt: "desc" as const };

      const [data, total] = await Promise.all([
        this.model.findMany({
          where: options?.where,
          include: options?.include,
          skip,
          take: limit,
          orderBy,
        }),
        this.model.count({ where: options?.where }),
      ]);

      return {
        data: data as T[],
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw this.handleError(error, "findAll");
    }
  }

  async findOne(where: Record<string, any>): Promise<T | null> {
    try {
      const result = await this.model.findFirst({ where });
      return result as T;
    } catch (error) {
      throw this.handleError(error, "findOne");
    }
  }

  async create(data: CreateDto): Promise<T> {
    try {
      const result = await this.model.create({ data });
      await cacheService.deletePattern(`${this.modelName}:*`);
      return result as T;
    } catch (error) {
      throw this.handleError(error, "create");
    }
  }

  async update(id: string, data: UpdateDto): Promise<T> {
    try {
      const result = await this.model.update({
        where: { id },
        data,
      });
      await cacheService.delete(this.getCacheKey(id));
      await cacheService.deletePattern(`${this.modelName}:*`);
      return result as T;
    } catch (error) {
      throw this.handleError(error, `update(${id})`);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.model.delete({ where: { id } });
      await cacheService.delete(this.getCacheKey(id));
      await cacheService.deletePattern(`${this.modelName}:*`);
      return true;
    } catch (error) {
      if (this.isNotFoundError(error)) {
        return false;
      }
      throw this.handleError(error, `delete(${id})`);
    }
  }

  async count(where?: Record<string, any>): Promise<number> {
    try {
      return await this.model.count({ where });
    } catch (error) {
      throw this.handleError(error, "count");
    }
  }

  protected isNotFoundError(error: any): boolean {
    return (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    );
  }

  protected handleError(error: any, context: string): Error {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return new Error(`Duplicate entry: ${error.meta?.target}`);
      }
      if (error.code === "P2025") {
        return new Error(`${this.modelName} not found`);
      }
    }
    return new Error(
      `Failed to ${context.replace(/[()]/g, "")} ${this.modelName}`,
    );
  }
}

export abstract class CachedRepositoryImpl<
  T,
  CreateDto,
  UpdateDto,
> extends BaseRepositoryImpl<T, CreateDto, UpdateDto> {
  async findByIdCached(id: string, ttl?: number): Promise<T | null> {
    const cacheKey = this.getCacheKey(id);

    return cacheService.getOrSet(
      cacheKey,
      async () => {
        const result = await this.findById(id);
        return result;
      },
      ttl || this.defaultTTL,
    );
  }

  async invalidateCache(pattern?: string): Promise<void> {
    await cacheService.deletePattern(pattern || `${this.modelName}:*`);
  }

  async refreshCache(id: string): Promise<T | null> {
    const entity = await this.findById(id);
    if (entity) {
      await cacheService.set(this.getCacheKey(id), entity, this.defaultTTL);
    }
    return entity;
  }
}
