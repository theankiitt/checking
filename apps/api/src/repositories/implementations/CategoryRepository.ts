import prisma, { Prisma } from "@/config/database";
import { BaseRepositoryImpl } from "./BaseRepository";
import { cacheService, CacheKeys, CacheTTL } from "@/services";
import { logger } from "@/utils/logger";
import {
  ICategoryRepository,
  Category,
  CreateCategoryDto,
  UpdateCategoryDto,
} from "../interfaces";

export class CategoryRepository
  extends BaseRepositoryImpl<Category, CreateCategoryDto, UpdateCategoryDto>
  implements ICategoryRepository
{
  protected readonly model = prisma.category;
  protected readonly modelName = "category";
  protected readonly defaultTTL = CacheTTL.long;

  protected getCacheKey(id: string): string {
    return CacheKeys.category.byId(id);
  }

  async findBySlug(slug: string): Promise<Category | null> {
    return cacheService.getOrSet(
      CacheKeys.category.bySlug(slug),
      async () => {
        const result = await this.model.findUnique({
          where: { slug },
          include: {
            children: {
              where: { isActive: true },
              orderBy: { name: "asc" },
              include: {
                _count: { select: { products: true } },
                children: {
                  where: { isActive: true },
                  orderBy: { name: "asc" },
                  include: { _count: { select: { products: true } } },
                },
              },
            },
          },
        });
        return result as Category | null;
      },
      this.defaultTTL,
    );
  }

  async findBySlugCached(slug: string, ttl?: number): Promise<Category | null> {
    return this.findBySlug(slug);
  }

  async findAllWithHierarchy(includeInactive = false): Promise<Category[]> {
    return cacheService.getOrSet(
      CacheKeys.category.all(includeInactive),
      async () => {
        const allCategories = await this.model.findMany({
          where: {
            isActive: includeInactive ? undefined : true,
          },
          include: {
            parent: {
              select: { id: true, name: true, slug: true },
            },
            children: {
              where: { isActive: true },
              orderBy: { name: "asc" },
              include: {
                _count: { select: { products: true } },
                children: {
                  where: { isActive: true },
                  orderBy: { name: "asc" },
                  include: { _count: { select: { products: true } } },
                },
              },
            },
            _count: { select: { products: true } },
          },
          orderBy: { name: "asc" },
        });

        const parentCategories = allCategories.filter(
          (cat: any) => !cat.parentId && cat.parentId !== "",
        );
        return parentCategories as Category[];
      },
      this.defaultTTL,
    );
  }

  async findByParentId(
    parentId: string | null,
    includeInactive = false,
  ): Promise<Category[]> {
    return this.model.findMany({
      where: {
        parentId,
        isActive: includeInactive ? undefined : true,
      },
      include: {
        _count: { select: { products: true } },
        children: {
          where: { isActive: true },
          include: { _count: { select: { products: true } } },
        },
      },
      orderBy: { name: "asc" },
    }) as Promise<Category[]>;
  }

  async findTree(includeInactive = false): Promise<Category[]> {
    return cacheService.getOrSet(
      CacheKeys.category.tree(includeInactive),
      async () => {
        const allCategories = await this.model.findMany({
          where: { isActive: includeInactive ? undefined : true },
          include: {
            _count: { select: { products: true } },
          },
          orderBy: { name: "asc" },
        });

        return this.buildTree(allCategories as Category[]);
      },
      this.defaultTTL,
    );
  }

  async getCategoriesWithCounts(): Promise<Category[]> {
    return cacheService.getOrSet(
      CacheKeys.category.withCounts(),
      async () => {
        return this.model.findMany({
          where: { isActive: true },
          include: {
            _count: { select: { products: true } },
            children: {
              where: { isActive: true },
              include: { _count: { select: { products: true } } },
            },
          },
          orderBy: { name: "asc" },
        }) as Promise<Category[]>;
      },
      CacheTTL.medium,
    );
  }

  async create(data: CreateCategoryDto): Promise<Category> {
    const category = await this.model.create({ data: data as any });

    await Promise.all([
      cacheService.deletePattern(CacheKeys.category.all()),
      cacheService.deletePattern(CacheKeys.category.tree()),
      cacheService.deletePattern(CacheKeys.category.withCounts()),
    ]);

    return category as Category;
  }

  async update(id: string, data: UpdateCategoryDto): Promise<Category> {
    const category = await this.model.update({
      where: { id },
      data,
    });

    await Promise.all([
      cacheService.delete(CacheKeys.category.byId(id)),
      cacheService.delete(CacheKeys.category.bySlug(category.slug)),
      cacheService.deletePattern(CacheKeys.category.all()),
      cacheService.deletePattern(CacheKeys.category.tree()),
      cacheService.deletePattern(CacheKeys.category.withCounts()),
    ]);

    return category as Category;
  }

  async delete(id: string): Promise<boolean> {
    try {
      logger.info(`[CategoryRepository.delete] Attempting to delete category: ${id}`);

      const children = await this.model.findMany({
        where: { parentId: id },
      });

      for (const child of children) {
        await this.model.update({
          where: { id: child.id },
          data: { parentId: null },
        });
      }

      const productsCount = await prisma.product.count({
        where: { categoryId: id },
      });
      logger.info(`[CategoryRepository.delete] Products with this category: ${productsCount}`);
      
      if (productsCount > 0) {
        const otherCategories = await this.model.findMany({
          where: { id: { not: id } },
          take: 1,
        });
        
        if (otherCategories.length > 0) {
          await prisma.product.updateMany({
            where: { categoryId: id },
            data: { categoryId: otherCategories[0].id },
          });
          logger.info(`[CategoryRepository.delete] Moved products to: ${otherCategories[0].id}`);
        }
      }

      const category = await this.model.findUnique({ where: { id } });
      if (!category) {
        return false;
      }

      await this.model.delete({ where: { id } });

      await Promise.all([
        cacheService.delete(CacheKeys.category.byId(id)),
        cacheService.deletePattern(CacheKeys.category.all()),
        cacheService.deletePattern(CacheKeys.category.tree()),
        cacheService.deletePattern(CacheKeys.category.withCounts()),
      ]);

      logger.info(`[CategoryRepository.delete] Successfully deleted category: ${id}`);
      return true;
    } catch (error: any) {
      logger.error(`[CategoryRepository.delete] Failed to delete category ${id}:`, error);
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
        logger.warn(`[CategoryRepository.delete] Category not found: ${id}`);
        return false;
      }
      throw new Error(`Delete failed: ${error.message || error}`);
    }
  }

  private buildTree(categories: Category[]): Category[] {
    const map = new Map<string, Category>();
    const roots: Category[] = [];

    categories.forEach((cat) => {
      map.set(cat.id, { ...cat, children: [] });
    });

    map.forEach((category) => {
      if (category.parentId) {
        const parent = map.get(category.parentId);
        if (parent) {
          parent.children = parent.children || [];
          parent.children.push(category);
        }
      } else {
        roots.push(category);
      }
    });

    return roots;
  }
}

export const categoryRepository = new CategoryRepository();
