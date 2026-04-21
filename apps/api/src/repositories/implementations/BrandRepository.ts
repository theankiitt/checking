import prisma from "@/config/database";
import { Prisma } from "@prisma/client";
import { BaseRepositoryImpl } from "./BaseRepository";
import { cacheService, CacheKeys, CacheTTL } from "@/services";
import {
  IBrandRepository,
  Brand,
  CreateBrandDto,
  UpdateBrandDto,
} from "../interfaces";

export class BrandRepository
  extends BaseRepositoryImpl<Brand, CreateBrandDto, UpdateBrandDto>
  implements IBrandRepository
{
  protected readonly model = prisma.brand;
  protected readonly modelName = "brand";
  protected readonly defaultTTL = CacheTTL.long;

  protected getCacheKey(id: string): string {
    return CacheKeys.brand.byId(id);
  }

  async findByName(name: string): Promise<Brand | null> {
    return cacheService.getOrSet(
      CacheKeys.brand.byName(name),
      async () => {
        const result = await this.model.findFirst({
          where: { name },
        });
        return result as Brand | null;
      },
      this.defaultTTL,
    );
  }

  async findBySlug(slug: string): Promise<Brand | null> {
    return this.model.findFirst({
      where: { name: { equals: slug, mode: "insensitive" } },
    }) as Promise<Brand | null>;
  }

  async findAllActive(): Promise<Brand[]> {
    return cacheService.getOrSet(
      CacheKeys.brand.all(),
      async () => {
        const brands = await this.model.findMany({
          orderBy: { name: "asc" },
          include: { _count: { select: { products: true } } },
        });
        return brands as Brand[];
      },
      this.defaultTTL,
    );
  }

  async search(query: string): Promise<Brand[]> {
    return this.model.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { website: { contains: query, mode: "insensitive" } },
        ],
      },
      include: { _count: { select: { products: true } } },
      take: 10,
    }) as Promise<Brand[]>;
  }

  async create(data: CreateBrandDto): Promise<Brand> {
    const brand = await this.model.create({ data });

    await Promise.all([
      cacheService.delete(CacheKeys.brand.all()),
      cacheService.delete(CacheKeys.brand.byName(brand.name)),
    ]);

    return brand as Brand;
  }

  async update(id: string, data: UpdateBrandDto): Promise<Brand> {
    const brand = await this.model.update({
      where: { id },
      data,
    });

    await Promise.all([
      cacheService.delete(CacheKeys.brand.byId(id)),
      cacheService.delete(CacheKeys.brand.all()),
      cacheService.delete(CacheKeys.brand.byName(brand.name)),
    ]);

    return brand as Brand;
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.model.delete({ where: { id } });

      await Promise.all([
        cacheService.delete(CacheKeys.brand.byId(id)),
        cacheService.delete(CacheKeys.brand.all()),
      ]);

      return true;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        return false;
      }
      throw error;
    }
  }
}

export const brandRepository = new BrandRepository();
