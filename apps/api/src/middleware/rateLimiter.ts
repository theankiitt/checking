import rateLimit from "express-rate-limit";
import { Request, Response } from "express";
import { env } from "@/config/env";

const PUBLIC_GET_PATHS = [
  "/api/v1/products",
  "/api/v1/categories",
  "/api/v1/brands",
];

interface AuthenticatedUser {
  id: string;
  [key: string]: unknown;
}

const defaultKeyGenerator = (req: Request): string => {
  const user = req.user as AuthenticatedUser | undefined;
  return user?.id ? `${req.ip}:${user.id}` : req.ip || "unknown";
};

const createRateLimiter = (
  windowMs: number,
  max: number,
  message: string,
  options?: {
    skip?: (req: Request) => boolean;
    keyGenerator?: (req: Request) => string;
  },
) =>
  rateLimit({
    windowMs,
    max,
    message: { success: false, error: message },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: options?.keyGenerator || defaultKeyGenerator,
    skip: options?.skip,
    handler: (req: Request, res: Response) => {
      const retryAfter = Math.ceil(windowMs / 1000);
      res.setHeader("Retry-After", retryAfter);
      res.status(429).json({
        success: false,
        error: message,
        retryAfter,
      });
    },
  });

const skipPublicGet = (req: Request): boolean =>
  req.method === "GET" &&
  PUBLIC_GET_PATHS.some((path) => req.path.startsWith(path));

export const authLimiter = createRateLimiter(
  15 * 60 * 1000,
  5,
  "Too many login attempts, please try again after 15 minutes",
);

export const registrationLimiter = createRateLimiter(
  24 * 60 * 60 * 1000,
  10,
  "Too many registration attempts, please try again after 24 hours",
);

export const emailVerificationLimiter = createRateLimiter(
  60 * 60 * 1000,
  5,
  "Too many verification requests, please try again after 1 hour",
);

export const passwordResetLimiter = createRateLimiter(
  60 * 60 * 1000,
  5,
  "Too many password reset requests, please try again after 1 hour",
);

export const apiLimiter = createRateLimiter(
  env.RATE_LIMIT_WINDOW_MS,
  env.RATE_LIMIT_MAX_REQUESTS,
  "Too many requests from this IP, please try again later",
  { skip: skipPublicGet },
);

export const uploadLimiter = createRateLimiter(
  60 * 60 * 1000,
  100,
  "Too many upload attempts, please try again after 1 hour",
);

export const writeLimiter = createRateLimiter(
  60 * 1000,
  30,
  "Too many write requests, please try again after 1 minute",
);

export const sensitiveDataLimiter = createRateLimiter(
  60 * 60 * 1000,
  20,
  "Too many requests for sensitive data, please try again after 1 hour",
);

export const publicReadLimiter = createRateLimiter(
  60 * 1000,
  100,
  "Too many requests, please try again after 1 minute",
  { skip: skipPublicGet },
);
