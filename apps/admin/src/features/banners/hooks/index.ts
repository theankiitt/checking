"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  getBanners,
  getBanner,
  createBanner as apiCreateBanner,
  updateBanner as apiUpdateBanner,
  deleteBanner as apiDeleteBanner,
  toggleBanner as apiToggleBanner,
  Banner,
  CreateBannerInput,
  UpdateBannerInput,
} from "../api";

export type { Banner, CreateBannerInput, UpdateBannerInput };

export function useBanners() {
  return useQuery({
    queryKey: ["admin", "banners"],
    queryFn: async () => {
      const response = await getBanners();
      if (!response.success) {
        throw new Error(response.error || "Failed to fetch banners");
      }
      return response.data || [];
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useBanner(id: string) {
  return useQuery({
    queryKey: ["admin", "banner", id],
    queryFn: async () => {
      const response = await getBanner(id);
      if (!response.success) {
        throw new Error(response.error || "Failed to fetch banner");
      }
      return response.data;
    },
    enabled: !!id,
  });
}

export function useCreateBanner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateBannerInput) => {
      const response = await apiCreateBanner(data);
      if (!response.success) {
        throw new Error(response.error || "Failed to create banner");
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "banners"] });
      toast.success("Banner created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create banner");
    },
  });
}

export function useUpdateBanner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateBannerInput;
    }) => {
      const response = await apiUpdateBanner(id, data);
      if (!response.success) {
        throw new Error(response.error || "Failed to update banner");
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "banners"] });
      toast.success("Banner updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update banner");
    },
  });
}

export function useDeleteBanner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiDeleteBanner(id);
      if (!response.success) {
        throw new Error(response.error || "Failed to delete banner");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "banners"] });
      toast.success("Banner deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete banner");
    },
  });
}

export function useToggleBanner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiToggleBanner(id);
      if (!response.success) {
        throw new Error(response.error || "Failed to toggle banner status");
      }
      return response.data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "banners"] });
      toast.success("Banner status toggled");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to toggle banner status");
    },
  });
}
