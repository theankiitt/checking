import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import {
  logRequest,
  logResponse,
  createRequestLogger,
  sanitizeData,
} from "@/utils/logger";
import { env } from "@/config/env";

declare global {
  namespace Express {
    interface Request {
      id?: string;
      logger?: ReturnType<typeof createRequestLogger>;
    }
  }
}

export const requestIdMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  req.id = (req.headers["x-request-id"] as string | undefined) || uuidv4();
  res.setHeader("X-Request-ID", req.id);

  req.logger = createRequestLogger({
    requestId: req.id,
    userId: (req as any).user?.id,
    ip: req.ip,
    userAgent: req.get("user-agent"),
  });

  next();
};

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const start = Date.now();

  if (env.LOG_REQUEST_BODY && req.body && Object.keys(req.body).length > 0) {
    req.logger?.debug("Request body", {
      body: sanitizeData(req.body),
    });
  }

  req.logger?.http("Incoming request", {
    method: req.method,
    url: req.url,
    query: req.query,
    ip: req.ip,
    userAgent: req.get("user-agent"),
    contentType: req.get("content-type"),
    contentLength: req.get("content-length"),
  });

  res.on("finish", () => {
    const responseTime = Date.now() - start;

    const logData = {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${responseTime}ms`,
      contentLength: res.getHeader("content-length"),
      contentType: res.get("content-type"),
    };

    if (res.statusCode >= 500) {
      req.logger?.error("Request failed", logData);
    } else if (res.statusCode >= 400) {
      req.logger?.warn("Request error", logData);
    } else {
      req.logger?.http("Request completed", logData);
    }
  });

  next();
};

export const errorLogger = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || "Internal Server Error";

  req.logger?.error("Request error", {
    statusCode,
    message,
    stack: err.stack,
    url: req.url,
    method: req.method,
  });

  next(err);
};

export const logRequestMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  logRequest(req);
  next();
};

export const logResponseMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const start = Date.now();

  res.on("finish", () => {
    const responseTime = Date.now() - start;
    logResponse(req, res, responseTime);
  });

  next();
};
