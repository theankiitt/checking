const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
  role: "ADMIN" | "STAFF" | "MANAGER";
  permissions: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CreateUserInput {
  email: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role: "STAFF" | "MANAGER";
  permissions: string[];
}

interface UpdateUserInput {
  email?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role?: "STAFF" | "MANAGER";
  isActive?: boolean;
  permissions?: string[];
}

interface PaginatedResponse<T> {
  success: boolean;
  data: {
    users: T[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

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

export async function getUsers(params?: {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  isActive?: boolean;
}): Promise<PaginatedResponse<User>> {
  const searchParams = new URLSearchParams();

  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.limit) searchParams.set("limit", String(params.limit));
  if (params?.search) searchParams.set("search", params.search);
  if (params?.role) searchParams.set("role", params.role);
  if (params?.isActive !== undefined)
    searchParams.set("isActive", String(params.isActive));

  const queryString = searchParams.toString();
  const endpoint = `/api/v1/users${queryString ? `?${queryString}` : ""}`;

  return fetchApi<PaginatedResponse<User>>(endpoint);
}

export async function getUser(
  id: string,
): Promise<ApiResponse<{ user: User }>> {
  return fetchApi<ApiResponse<{ user: User }>>(`/api/v1/users/${id}`);
}

export async function createUser(
  userData: CreateUserInput,
): Promise<ApiResponse<{ user: User }>> {
  return fetchApi<ApiResponse<{ user: User }>>("/api/v1/users", {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

export async function updateUser(
  id: string,
  userData: UpdateUserInput,
): Promise<ApiResponse<{ user: User }>> {
  return fetchApi<ApiResponse<{ user: User }>>(`/api/v1/users/${id}`, {
    method: "PATCH",
    body: JSON.stringify(userData),
  });
}

export async function deleteUser(id: string): Promise<ApiResponse<void>> {
  return fetchApi<ApiResponse<void>>(`/api/v1/users/${id}`, {
    method: "DELETE",
  });
}

export async function resetPassword(
  id: string,
  newPassword: string,
): Promise<ApiResponse<void>> {
  return fetchApi<ApiResponse<void>>(`/api/v1/users/${id}/reset-password`, {
    method: "POST",
    body: JSON.stringify({ newPassword }),
  });
}

export async function bulkUpdateStatus(
  userIds: string[],
  isActive: boolean,
): Promise<ApiResponse<void>> {
  return fetchApi<ApiResponse<void>>("/api/v1/users/bulk-update", {
    method: "POST",
    body: JSON.stringify({ userIds, isActive }),
  });
}

export type { User, CreateUserInput, UpdateUserInput };
