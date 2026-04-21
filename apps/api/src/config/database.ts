import { PrismaClient, Prisma } from "@prisma/client";
import { logger } from "@/utils/logger";

export { Prisma };

declare global {
  var __prisma: PrismaClient | undefined;
}

export const prisma =
  globalThis.__prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn", "info"]
        : ["error"],
  });

// Enhanced query logging for development
if (process.env.NODE_ENV === "development") {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (prisma as any).$on("query", (e: any) => {
    const queryInfo = {
      query: e.query,
      params: e.params,
      duration: e.duration,
      timestamp: new Date().toISOString(),
    };

    // Log slow queries (> 100ms)
    if (e.duration && e.duration > 100) {
      logger.warn("Slow query detected:", queryInfo);
    } else {
      logger.debug("Query executed:", queryInfo);
    }
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (prisma as any).$on("error", (e: any) => {
    logger.error("Prisma error:", {
      message: e.message,
      timestamp: new Date().toISOString(),
    });
  });
}

if (process.env.NODE_ENV !== "production") {
  globalThis.__prisma = prisma;
}

export default prisma;
