/**
 * API Error Handler Utility
 * Provides consistent error handling across all service layers
 */

export class ApiError extends Error {
  public statusCode: number;
  public response: unknown;
  public isApiError: boolean;

  constructor(message: string, statusCode: number = 0, response?: unknown) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.response = response;
    this.isApiError = true;
  }
}

/**
 * Wraps an API call with proper error handling
 * Returns a tuple of [data, error] to avoid try/catch blocks
 */
export async function safeApiCall<T>(
  apiCall: () => Promise<T>,
): Promise<[T | null, ApiError | null]> {
  try {
    const data = await apiCall();
    return [data, null];
  } catch (error) {
    const apiError = normalizeError(error);
    return [null, apiError];
  }
}

/**
 * Normalizes different error types into a consistent ApiError format
 */
export function normalizeError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  if (error instanceof Error) {
    return new ApiError(error.message, 0, error);
  }

  return new ApiError(
    typeof error === "string" ? error : "An unexpected error occurred",
    0,
    error,
  );
}

/**
 * Gets a user-friendly error message for display
 */
export function getUserFriendlyMessage(error: ApiError | null): string {
  if (!error) return "";

  // Network errors
  if (error.statusCode === 0) {
    return "Unable to connect to the server. Please check your internet connection.";
  }

  // Authentication errors
  if (error.statusCode === 401) {
    return "Please log in to continue.";
  }

  // Forbidden errors
  if (error.statusCode === 403) {
    return "You don't have permission to perform this action.";
  }

  // Not found errors
  if (error.statusCode === 404) {
    return "The requested resource was not found.";
  }

  // Validation errors
  if (error.statusCode === 422) {
    return "Please check your input and try again.";
  }

  // Server errors
  if (error.statusCode >= 500) {
    return "Something went wrong on our end. Please try again later.";
  }

  return error.message || "An unexpected error occurred.";
}

/**
 * Logs error with context for debugging
 */
export function logError(
  error: ApiError | null,
  context: Record<string, unknown> = {},
): void {
  if (!error) return;

  const errorLog = {
    message: error.message,
    statusCode: error.statusCode,
    context,
    timestamp: new Date().toISOString(),
    stack: error.stack,
  };

  // In development, log to console
  if (process.env.NODE_ENV === "development") {
  }

  // In production, you might want to send to an error tracking service
  // Example: Sentry.captureException(error, { extra: context });
}
