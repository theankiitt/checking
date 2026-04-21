"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUsers, getUser, updateUser } from "../api";

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
    queryFn: () => getUsers(params),
  });
}

export function useUser(userId: string) {
  return useQuery({
    queryKey: ["admin", "user", userId],
    queryFn: () => getUser(userId),
    enabled: !!userId,
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) =>
      updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
}
