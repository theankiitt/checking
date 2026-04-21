import { apiClient } from "@/shared/api/client";
import { User } from "@/shared/types";

export interface UsersResponse {
  users: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export async function getUsers(
  params: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    isActive?: boolean;
  } = {},
): Promise<UsersResponse> {
  return apiClient.get<UsersResponse>("/users", {
    page: params.page,
    limit: params.limit,
    search: params.search,
    role: params.role,
    isActive: params.isActive,
  });
}

export async function getUser(userId: string): Promise<User> {
  const response = await apiClient.get<{ user: User }>(`/users/${userId}`);
  return response.user;
}

export async function updateUser(id: string, data: unknown): Promise<User> {
  const response = await apiClient.patch<{ user: User }>(`/users/${id}`, data);
  return response.user;
}
