const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4444";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "INFO" | "SUCCESS" | "WARNING" | "ERROR";
  status: "UNREAD" | "READ" | "ARCHIVED";
  userId?: string;
  isGlobal: boolean;
  metadata?: Record<string, unknown>;
  readAt?: string;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    firstName?: string;
    lastName?: string;
    email: string;
  };
}

export interface CreateNotificationInput {
  title: string;
  message: string;
  type?: "INFO" | "SUCCESS" | "WARNING" | "ERROR";
  userId?: string;
  isGlobal?: boolean;
  metadata?: Record<string, unknown>;
  expiresAt?: string;
}

export interface UpdateNotificationInput {
  title?: string;
  message?: string;
  type?: "INFO" | "SUCCESS" | "WARNING" | "ERROR";
  status?: "UNREAD" | "READ" | "ARCHIVED";
  metadata?: Record<string, unknown>;
  expiresAt?: string;
}

export interface NotificationFilters {
  page?: number;
  limit?: number;
  type?: "INFO" | "SUCCESS" | "WARNING" | "ERROR";
  status?: "UNREAD" | "READ" | "ARCHIVED";
  userId?: string;
  isGlobal?: boolean;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

interface PaginatedResponse<T> {
  success: boolean;
  data?: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  message?: string;
  error?: string;
}

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${API_BASE_URL}/api/v1${endpoint}`;

  const response = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || errorData.message || "API request failed",
    );
  }

  return response.json();
}

export async function getNotifications(
  filters: NotificationFilters = {},
): Promise<PaginatedResponse<Notification[]>> {
  const params = new URLSearchParams();

  if (filters.page) params.append("page", filters.page.toString());
  if (filters.limit) params.append("limit", filters.limit.toString());
  if (filters.type) params.append("type", filters.type);
  if (filters.status) params.append("status", filters.status);
  if (filters.userId) params.append("userId", filters.userId);
  if (filters.isGlobal !== undefined)
    params.append("isGlobal", filters.isGlobal.toString());

  const queryString = params.toString();
  const endpoint = `/notifications/admin${queryString ? `?${queryString}` : ""}`;

  return fetchApi<PaginatedResponse<Notification[]>>(endpoint);
}

export async function getNotification(
  id: string,
): Promise<ApiResponse<Notification>> {
  return fetchApi<ApiResponse<Notification>>(`/notifications/${id}`);
}

export async function createNotification(
  data: CreateNotificationInput,
): Promise<ApiResponse<Notification>> {
  return fetchApi<ApiResponse<Notification>>("/notifications", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateNotification(
  id: string,
  data: UpdateNotificationInput,
): Promise<ApiResponse<Notification>> {
  return fetchApi<ApiResponse<Notification>>(`/notifications/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteNotification(id: string): Promise<ApiResponse<void>> {
  return fetchApi<ApiResponse<void>>(`/notifications/${id}`, {
    method: "DELETE",
  });
}

export async function cleanupExpiredNotifications(): Promise<ApiResponse<{ deletedCount: number }>> {
  return fetchApi<ApiResponse<{ deletedCount: number }>>("/notifications/cleanup", {
    method: "POST",
  });
}

export type {
  ApiResponse,
  PaginatedResponse,
  CreateNotificationInput as CreateNotificationInputType,
  UpdateNotificationInput as UpdateNotificationInputType,
  NotificationFilters as NotificationFiltersType,
};