import {
  cacheGet,
  cacheSet,
  cacheDelete,
  cacheDeletePattern,
} from "@/config/redis";
import { logger } from "@/utils/logger";

export interface CacheOptions {
  ttl?: number;
  keyPrefix?: string;
}

export interface CacheMetrics {
  hits: number;
  misses: number;
  sets: number;
  deletes: number;
  errors: number;
}

class CacheService {
  private metrics: CacheMetrics = {
    hits: 0,
    misses: 0,
    sets: 0,
    deletes: 0,
    errors: 0,
  };

  private readonly defaultTTL = 300;
  private readonly cacheEnabled: boolean;

  constructor() {
    this.cacheEnabled = process.env.NODE_ENV === "production";
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.cacheEnabled) return null;

    try {
      const cached = await cacheGet(key);
      if (cached) {
        this.metrics.hits++;
        logger.debug(`Cache HIT: ${key}`);
        return JSON.parse(cached) as T;
      }
      this.metrics.misses++;
      logger.debug(`Cache MISS: ${key}`);
      return null;
    } catch (error) {
      this.metrics.errors++;
      logger.error(`Cache GET error for key ${key}:`, error);
      return null;
    }
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<boolean> {
    if (!this.cacheEnabled) return false;

    try {
      const success = await cacheSet(
        key,
        JSON.stringify(value),
        ttl || this.defaultTTL,
      );
      if (success) {
        this.metrics.sets++;
        logger.debug(`Cache SET: ${key} (TTL: ${ttl || this.defaultTTL}s)`);
      }
      return success;
    } catch (error) {
      this.metrics.errors++;
      logger.error(`Cache SET error for key ${key}:`, error);
      return false;
    }
  }

  async delete(key: string): Promise<boolean> {
    try {
      const success = await cacheDelete(key);
      if (success) {
        this.metrics.deletes++;
        logger.debug(`Cache DELETE: ${key}`);
      }
      return success;
    } catch (error) {
      this.metrics.errors++;
      logger.error(`Cache DELETE error for key ${key}:`, error);
      return false;
    }
  }

  async deletePattern(pattern: string): Promise<number> {
    try {
      const deleted = await cacheDeletePattern(pattern);
      this.metrics.deletes += deleted;
      logger.debug(`Cache DELETE PATTERN: ${pattern} (${deleted} keys)`);
      return deleted;
    } catch (error) {
      this.metrics.errors++;
      logger.error(`Cache DELETE PATTERN error for ${pattern}:`, error);
      return 0;
    }
  }

  async getOrSet<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl?: number,
  ): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const data = await fetcher();
    await this.set(key, data, ttl);
    return data;
  }

  async invalidateRelated(
    entityType: string,
    entityId?: string,
  ): Promise<void> {
    const patterns = [`${entityType}:*`, `${entityType}:${entityId}:*`];

    if (entityId) {
      await this.delete(`${entityType}:${entityId}`);
    }

    await Promise.all(patterns.map((pattern) => this.deletePattern(pattern)));
  }

  getMetrics(): CacheMetrics & { hitRate: number } {
    const total = this.metrics.hits + this.metrics.misses;
    return {
      ...this.metrics,
      hitRate: total > 0 ? (this.metrics.hits / total) * 100 : 0,
    };
  }

  resetMetrics(): void {
    this.metrics = {
      hits: 0,
      misses: 0,
      sets: 0,
      deletes: 0,
      errors: 0,
    };
  }
}

export const cacheService = new CacheService();
export default cacheService;
