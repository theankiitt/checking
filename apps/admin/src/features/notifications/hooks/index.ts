"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  getNotifications,
  getNotification,
  createNotification as apiCreateNotification,
  updateNotification as apiUpdateNotification,
  deleteNotification as apiDeleteNotification,
  cleanupExpiredNotifications as apiCleanupExpiredNotifications,
  Notification,
  CreateNotificationInput,
  UpdateNotificationInput,
  NotificationFilters,
} from "../api";

export type { Notification, CreateNotificationInput, UpdateNotificationInput, NotificationFilters };

export function useNotifications(filters: NotificationFilters = {}) {
  return useQuery({
    queryKey: ["admin", "notifications", filters],
    queryFn: async () => {
      const response = await getNotifications(filters);
      if (!response.success) {
        throw new Error(response.error || "Failed to fetch notifications");
      }
      return {
        notifications: response.data || [],
        pagination: response.pagination,
      };
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useNotification(id: string) {
  return useQuery({
    queryKey: ["admin", "notification", id],
    queryFn: async () => {
      const response = await getNotification(id);
      if (!response.success) {
        throw new Error(response.error || "Failed to fetch notification");
      }
      return response.data;
    },
    enabled: !!id,
  });
}

export function useCreateNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateNotificationInput) => apiCreateNotification(data),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ["admin", "notifications"] });
        toast.success("Notification created successfully");
      } else {
        toast.error(response.error || "Failed to create notification");
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create notification");
    },
  });
}

export function useUpdateNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateNotificationInput }) =>
      apiUpdateNotification(id, data),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ["admin", "notifications"] });
        queryClient.invalidateQueries({ queryKey: ["admin", "notification"] });
        toast.success("Notification updated successfully");
      } else {
        toast.error(response.error || "Failed to update notification");
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update notification");
    },
  });
}

export function useDeleteNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDeleteNotification(id),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ["admin", "notifications"] });
        toast.success("Notification deleted successfully");
      } else {
        toast.error(response.error || "Failed to delete notification");
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete notification");
    },
  });
}

export function useCleanupExpiredNotifications() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => apiCleanupExpiredNotifications(),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ["admin", "notifications"] });
        toast.success(`Cleaned up ${response.data?.deletedCount || 0} expired notifications`);
      } else {
        toast.error(response.error || "Failed to cleanup expired notifications");
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to cleanup expired notifications");
    },
  });
}