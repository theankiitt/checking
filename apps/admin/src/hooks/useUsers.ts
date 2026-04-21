"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/shared/api/client";

interface User {
  id: string;
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  _count?: {
    orders: number;
    reviews: number;
  };
}

interface UsersResponse {
  users: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function useUsers(
  params: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    isActive?: boolean;
  } = {},
) {
  return useQuery({
    queryKey: ["admin", "users", params],
    queryFn: async () => {
      const response = await apiClient.get<UsersResponse>("/users", {
        page: params.page,
        limit: params.limit,
        search: params.search,
        role: params.role,
        isActive: params.isActive,
      });
      return response;
    },
  });
}

export function useUser(userId: string) {
  return useQuery({
    queryKey: ["admin", "user", userId],
    queryFn: async () => {
      const response = await apiClient.get<{ user: User }>(`/users/${userId}`);
      return response.user;
    },
    enabled: !!userId,
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: unknown }) => {
      const response = await apiClient.patch<{ user: User }>(
        `/users/${id}`,
        data,
      );
      return response.user;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
}
