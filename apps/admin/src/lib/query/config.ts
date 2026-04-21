"use client";

import { QueryClient } from "@tanstack/react-query";
import { ReactNode } from "react";

export interface QueryConfig {
  staleTime?: number;
  gcTime?: number;
  refetchOnWindowFocus?: boolean | "always";
  refetchOnMount?: boolean | "always";
  refetchOnReconnect?: boolean | "always";
  retry?: number | boolean;
  retryDelay?: number | ((attemptIndex: number) => number);
}

export interface CachingStrategy {
  queryKey: string[];
  strategy: "aggressive" | "moderate" | "conservative";
  customConfig?: QueryConfig;
}

export const DEFAULT_QUERY_CONFIG: QueryConfig = {
  staleTime: 60 * 1000,
  gcTime: 10 * 60 * 1000,
  refetchOnWindowFocus: false,
  refetchOnMount: true,
  refetchOnReconnect: "always",
  retry: 1,
  retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
};

export const QUERY_CACHING_STRATEGIES: CachingStrategy[] = [
  {
    queryKey: ["admin", "products"],
    strategy: "aggressive",
    customConfig: {
      staleTime: 5 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
    },
  },
  {
    queryKey: ["admin", "categories"],
    strategy: "aggressive",
    customConfig: {
      staleTime: 10 * 60 * 1000,
      gcTime: 60 * 60 * 1000,
    },
  },
  {
    queryKey: ["admin", "orders"],
    strategy: "moderate",
    customConfig: {
      staleTime: 60 * 1000,
      gcTime: 15 * 60 * 1000,
    },
  },
  {
    queryKey: ["admin", "users"],
    strategy: "moderate",
    customConfig: {
      staleTime: 5 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
    },
  },
  {
    queryKey: ["admin", "reviews"],
    strategy: "conservative",
    customConfig: {
      staleTime: 30 * 1000,
      gcTime: 5 * 60 * 1000,
    },
  },
];

export function applyCachingStrategies(client: QueryClient): void {
  QUERY_CACHING_STRATEGIES.forEach((strategy) => {
    const config = {
      ...DEFAULT_QUERY_CONFIG,
      ...strategy.customConfig,
    };

    Object.entries(config).forEach(([key, value]) => {
      if (key in DEFAULT_QUERY_CONFIG) {
        client.setDefaultOptions({
          queries: {
            [key]: value,
          },
        });
      }
    });
  });
}

export interface QueryMetrics {
  queryKey: string[];
  fetchCount: number;
  hitCount: number;
  missCount: number;
  errorCount: number;
  averageFetchTime: number;
  cacheHitRate: number;
}

export class QueryMetricsCollector {
  private metrics: Map<string, QueryMetrics> = new Map();

  trackQuery(queryKey: string[]) {
    const key = queryKey.join(":");
    if (!this.metrics.has(key)) {
      this.metrics.set(key, {
        queryKey,
        fetchCount: 0,
        hitCount: 0,
        missCount: 0,
        errorCount: 0,
        averageFetchTime: 0,
        cacheHitRate: 0,
      });
    }
  }

  trackFetch(queryKey: string[], duration: number) {
    const key = queryKey.join(":");
    const metric = this.metrics.get(key);
    if (metric) {
      metric.fetchCount++;
      metric.averageFetchTime =
        (metric.averageFetchTime * (metric.fetchCount - 1) + duration) /
        metric.fetchCount;
    }
  }

  trackCacheHit(queryKey: string[]) {
    const key = queryKey.join(":");
    const metric = this.metrics.get(key);
    if (metric) {
      metric.hitCount++;
      this.updateCacheHitRate(metric);
    }
  }

  trackCacheMiss(queryKey: string[]) {
    const key = queryKey.join(":");
    const metric = this.metrics.get(key);
    if (metric) {
      metric.missCount++;
      this.updateCacheHitRate(metric);
    }
  }

  trackError(queryKey: string[]) {
    const key = queryKey.join(":");
    const metric = this.metrics.get(key);
    if (metric) {
      metric.errorCount++;
    }
  }

  private updateCacheHitRate(metric: QueryMetrics) {
    const total = metric.hitCount + metric.missCount;
    metric.cacheHitRate = total > 0 ? (metric.hitCount / total) * 100 : 0;
  }

  getMetrics(queryKey?: string[]) {
    if (queryKey) {
      return this.metrics.get(queryKey.join(":"));
    }
    return Array.from(this.metrics.values());
  }

  resetMetrics(queryKey?: string[]) {
    if (queryKey) {
      this.metrics.delete(queryKey.join(":"));
    } else {
      this.metrics.clear();
    }
  }
}

export const queryMetricsCollector = new QueryMetricsCollector();

export function createOptimizedQueryClient() {
  const client = new QueryClient({
    defaultOptions: {
      queries: {
        ...DEFAULT_QUERY_CONFIG,
        staleTime: 60 * 1000,
        gcTime: 10 * 60 * 1000,
      },
      mutations: {
        retry: 0,
      },
    },
  });

  applyCachingStrategies(client);

  return client;
}
