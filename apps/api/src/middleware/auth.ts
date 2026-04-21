import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "@/config/env";
import prisma from "@/config/database";
import { UserRole } from "@prisma/client";

export const REFRESH_TOKEN_COOKIE_NAME = "refresh_token";
export const ACCESS_TOKEN_COOKIE_NAME = "access_token";

const isProduction = process.env.NODE_ENV === "production";

export const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: "strict" as const,
  path: "/",
};

export const refreshTokenCookieOptions = {
  ...cookieOptions,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
};

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        username: string;
        role: UserRole;
        isActive: boolean;
      };
    }
  }
}

interface JwtPayload {
  id: string;
  email: string;
  username: string;
  role: UserRole;
  iat: number;
  exp: number;
}

// Verify JWT token
export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;
    const headerToken = authHeader && authHeader.split(" ")[1];
    const cookieToken = (req as any).cookies?.admin_access_token as
      | string
      | undefined;
    const token = headerToken || cookieToken; // Prefer header if present

    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Access token required",
      });
    }

    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;

    // Check if user still exists and is active (support multiple delegate names / raw fallback)
    const user = (prisma as any).user?.findUnique
      ? await (prisma as any).user.findUnique({
          where: { id: decoded.id },
          select: {
            id: true,
            email: true,
            username: true,
            role: true,
            isActive: true,
          },
        })
      : (prisma as any).users?.findUnique
        ? await (prisma as any).users.findUnique({
            where: { id: decoded.id },
            select: {
              id: true,
              email: true,
              username: true,
              role: true,
              isActive: true,
            },
          })
        : (
            await prisma.$queryRaw<any[]>`
              SELECT id, email, username, role, "isActive"
              FROM "users"
              WHERE id = ${decoded.id}
              LIMIT 1
            `
          )?.[0];

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        error: "User not found or inactive",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        success: false,
        error: "Invalid token",
      });
    }

    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        success: false,
        error: "Token expired",
      });
    }

    return res.status(500).json({
      success: false,
      error: "Authentication error",
    });
  }
};

// Optional authentication (doesn't fail if no token)
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return next();
    }

    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        isActive: true,
      },
    });

    if (user && user.isActive) {
      req.user = user;
    }

    next();
  } catch (error) {
    // Continue without authentication if token is invalid
    next();
  }
};

// Role-based authorization
export const authorize = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "Authentication required",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: "Insufficient permissions",
        required: roles,
        current: req.user.role,
      });
    }

    next();
  };
};

// Check if user owns the resource
export const authorizeResource = (resourceUserIdField: string = "userId") => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "Authentication required",
      });
    }

    // Admin can access any resource
    if (req.user.role === "ADMIN") {
      return next();
    }

    // Check if user owns the resource
    const resourceUserId =
      req.params[resourceUserIdField] || req.body[resourceUserIdField];

    if (resourceUserId && resourceUserId !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: "Access denied to this resource",
      });
    }

    next();
  };
};

// Check if user has specific permission
export const hasPermission = (...permissions: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "Authentication required",
      });
    }

    // Admin has all permissions
    if (req.user.role === "ADMIN") {
      return next();
    }

    try {
      const user = (await (prisma as any).user?.findUnique)
        ? await (prisma as any).user.findUnique({
            where: { id: req.user.id },
            select: {
              permissions: true,
              role: true,
            },
          })
        : (prisma as any).users?.findUnique
          ? await (prisma as any).users.findUnique({
              where: { id: req.user.id },
              select: {
                permissions: true,
                role: true,
              },
            })
          : (
              await prisma.$queryRaw<any[]>`
                SELECT permissions, role
                FROM "users"
                WHERE id = ${req.user.id}
                LIMIT 1
              `
            )?.[0];

      if (!user) {
        return res.status(401).json({
          success: false,
          error: "User not found",
        });
      }

      const userPermissions: string[] = user.permissions || [];

      // Manager has view permissions by default
      if (user.role === "MANAGER") {
        const managerViewPermissions = permissions.filter(
          (p) => p.endsWith(".view") || p.endsWith(".manage"),
        );
        if (managerViewPermissions.length > 0) {
          const hasViewPermission = permissions.every(
            (p) =>
              userPermissions.includes(p) ||
              userPermissions.includes("*") ||
              p.endsWith(".view") ||
              p.endsWith(".manage"),
          );
          if (hasViewPermission) {
            return next();
          }
        }
      }

      // Check if user has all required permissions
      const hasAllPermissions = permissions.every(
        (permission) =>
          userPermissions.includes(permission) || userPermissions.includes("*"),
      );

      if (!hasAllPermissions) {
        return res.status(403).json({
          success: false,
          error: "Insufficient permissions",
          required: permissions,
          current: userPermissions,
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: "Error checking permissions",
      });
    }
  };
};

// Generate JWT tokens
export const generateTokens = (user: {
  id: string;
  email: string;
  username: string;
  role: UserRole;
}) => {
  const accessToken = (jwt.sign as any)(
    {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    },
    env.JWT_SECRET,
    { expiresIn: env.JWT_ACCESS_EXPIRES_IN },
  );

  const refreshToken = (jwt.sign as any)(
    { id: user.id },
    env.JWT_REFRESH_SECRET,
    { expiresIn: env.JWT_REFRESH_EXPIRES_IN },
  );

  return { accessToken, refreshToken };
};

// Verify refresh token
export const verifyRefreshToken = (token: string): { id: string } => {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as { id: string };
};
