import winston from "winston";
import path from "path";
import { env } from "@/config/env";

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "white",
};

winston.addColors(colors);

const getLogFilename = (level: string): string => {
  const date = new Date().toISOString().split("T")[0];
  return path.join(env.LOG_DIR, `${level}-${date}.log`);
};

const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    ({ timestamp, level, message, requestId, userId, ...metadata }) => {
      let msg = `${timestamp} ${level}:`;
      if (requestId) msg += ` [${requestId}]`;
      if (userId) msg += ` [User: ${userId}]`;
      msg += ` ${message}`;
      if (Object.keys(metadata).length > 0 && metadata.stack === undefined) {
        msg += ` ${JSON.stringify(metadata)}`;
      }
      return msg;
    },
  ),
);

const jsonFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json(),
);

const transports: winston.transport[] = [
  new winston.transports.Console({
    format: env.NODE_ENV === "production" ? jsonFormat : consoleFormat,
  }),
];

if (env.NODE_ENV === "production") {
  const maxSize = env.LOG_MAX_SIZE;
  const maxFiles = env.LOG_MAX_FILES;

  transports.push(
    new winston.transports.File({
      filename: getLogFilename("error"),
      level: "error",
      format: jsonFormat,
      maxsize: maxSize,
      maxFiles,
    }),
    new winston.transports.File({
      filename: getLogFilename("combined"),
      format: jsonFormat,
      maxsize: maxSize,
      maxFiles,
    }),
    new winston.transports.File({
      filename: getLogFilename("http"),
      level: "http",
      format: jsonFormat,
      maxsize: maxSize,
      maxFiles: Math.floor(maxFiles / 2),
    }),
  );
}

export const logger = winston.createLogger({
  level: env.LOG_LEVEL,
  levels,
  transports,
  exitOnError: false,
});

export const morganStream = {
  write: (message: string) => {
    logger.http(message.trim());
  },
};

export const logRequest = (req: any) => {
  logger.http(`${req.method} ${req.url} - ${req.ip || "unknown IP"}`);
};

export const logResponse = (req: any, res: any, responseTime: number) => {
  const level = res.statusCode >= 400 ? "warn" : "http";
  logger.log(
    level,
    `${req.method} ${req.url} - ${res.statusCode} - ${responseTime}ms`,
  );
};

export interface RequestContext {
  requestId?: string;
  userId?: string;
  [key: string]: any;
}

export const createRequestLogger = (context: RequestContext) => {
  return {
    error: (message: string, meta?: any) =>
      logger.error(message, { ...meta, ...context }),
    warn: (message: string, meta?: any) =>
      logger.warn(message, { ...meta, ...context }),
    info: (message: string, meta?: any) =>
      logger.info(message, { ...meta, ...context }),
    http: (message: string, meta?: any) =>
      logger.http(message, { ...meta, ...context }),
    debug: (message: string, meta?: any) =>
      logger.debug(message, { ...meta, ...context }),
  };
};

export const sanitizeData = (data: any, depth = 0): any => {
  if (depth > 10) return "[MAX_DEPTH]";
  if (data === null || data === undefined) return data;

  if (typeof data !== "object") return data;

  if (Array.isArray(data)) {
    return data.map((item) => sanitizeData(item, depth + 1));
  }

  const sensitiveFields = [
    "password",
    "token",
    "secret",
    "authorization",
    "cookie",
    "accessToken",
    "refreshToken",
    "oldPassword",
    "newPassword",
    "confirmPassword",
    "apiKey",
    "apiSecret",
    "creditCard",
    "cvv",
    "ssn",
  ];

  const sanitized: any = {};
  for (const [key, value] of Object.entries(data)) {
    if (sensitiveFields.some((field) => key.toLowerCase().includes(field))) {
      sanitized[key] = "[REDACTED]";
    } else {
      sanitized[key] = sanitizeData(value, depth + 1);
    }
  }

  return sanitized;
};

export class AuthLogger {
  private static instance: AuthLogger;

  static getInstance(): AuthLogger {
    if (!AuthLogger.instance) {
      AuthLogger.instance = new AuthLogger();
    }
    return AuthLogger.instance;
  }

  login(userId: string, email: string, success: boolean, requestId?: string) {
    const level = success ? "info" : "warn";
    logger.log(level, "Login attempt", {
      type: "AUTH",
      action: "LOGIN",
      userId,
      email,
      success,
      requestId,
    });
  }

  logout(userId: string, requestId?: string) {
    logger.info("User logout", {
      type: "AUTH",
      action: "LOGOUT",
      userId,
      requestId,
    });
  }

  register(userId: string, email: string, requestId?: string) {
    logger.info("User registration", {
      type: "AUTH",
      action: "REGISTER",
      userId,
      email,
      requestId,
    });
  }

  passwordReset(email: string, requestId?: string) {
    logger.info("Password reset requested", {
      type: "AUTH",
      action: "PASSWORD_RESET",
      email,
      requestId,
    });
  }

  refreshToken(userId: string, requestId?: string) {
    logger.http("Token refresh", {
      type: "AUTH",
      action: "TOKEN_REFRESH",
      userId,
      requestId,
    });
  }

  failedAttempt(email: string, reason: string, requestId?: string) {
    logger.warn("Authentication failed", {
      type: "AUTH",
      action: "AUTH_FAILED",
      email,
      reason,
      requestId,
    });
  }
}

export class AuditLogger {
  private static instance: AuditLogger;

  static getInstance(): AuditLogger {
    if (!AuditLogger.instance) {
      AuditLogger.instance = new AuditLogger();
    }
    return AuditLogger.instance;
  }

  log(
    action: string,
    resource: string,
    resourceId: string,
    userId: string,
    details?: any,
    requestId?: string,
  ) {
    logger.info("Audit event", {
      type: "AUDIT",
      action,
      resource,
      resourceId,
      userId,
      details: sanitizeData(details),
      requestId,
    });
  }

  create(
    resource: string,
    resourceId: string,
    userId: string,
    data: any,
    requestId?: string,
  ) {
    this.log("CREATE", resource, resourceId, userId, data, requestId);
  }

  update(
    resource: string,
    resourceId: string,
    userId: string,
    changes: any,
    requestId?: string,
  ) {
    this.log("UPDATE", resource, resourceId, userId, changes, requestId);
  }

  delete(
    resource: string,
    resourceId: string,
    userId: string,
    requestId?: string,
  ) {
    this.log("DELETE", resource, resourceId, userId, null, requestId);
  }

  read(
    resource: string,
    resourceId: string,
    userId: string,
    requestId?: string,
  ) {
    this.log("READ", resource, resourceId, userId, null, requestId);
  }
}

export const authLogger = AuthLogger.getInstance();
export const auditLogger = AuditLogger.getInstance();
