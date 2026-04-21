"use client";

import { useState, useCallback, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { getApiBaseUrl } from "@/utils/api";
import type { NavigationItem, Category, FormData } from "../types";

const QUERY_KEYS = {
  navigation: ["navigation"] as const,
  categories: ["categories"] as const,
};

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  withCredentials: true,
});

const flattenCategories = (cats: Category[]): Category[] => {
  const flat: Category[] = [];
  const traverse = (items: Category[]) => {
    items.forEach((c) => {
      flat.push({ id: c.id, name: c.name });
      if (c.children?.length) traverse(c.children);
    });
  };
  traverse(cats);
  return flat;
};

export function useNavigation() {
  const queryClient = useQueryClient();

  const {
    data: items = [],
    isLoading: isLoadingItems,
    isError: isErrorItems,
    error: errorItems,
    refetch: refetchItems,
  } = useQuery<NavigationItem[]>({
    queryKey: QUERY_KEYS.navigation,
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<NavigationItem[]>>(
        "/api/v1/configuration/public/navigation",
      );
      return data.success ? data.data || [] : [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const {
    data: categories = [],
    isLoading: isLoadingCategories,
    isError: isErrorCategories,
    error: errorCategories,
    refetch: refetchCategories,
  } = useQuery<Category[]>({
    queryKey: QUERY_KEYS.categories,
    queryFn: async () => {
      const { data } =
        await apiClient.get<ApiResponse<{ categories: Category[] }>>(
          "/api/v1/categories",
        );
      return data.success ? flattenCategories(data.data?.categories || []) : [];
    },
    staleTime: 10 * 60 * 1000,
  });

  const saveMutation = useMutation({
    mutationFn: async (navItems: NavigationItem[]) => {
      const { data } = await apiClient.put("/api/v1/configuration/navigation", {
        navigation: navItems,
      });
      return data;
    },
    onSuccess: () => {
      toast.success("Navigation saved successfully");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.navigation });
    },
    onError: () => {
      toast.error("Failed to save navigation");
    },
  });

  return {
    items,
    categories,
    isLoading: isLoadingItems || isLoadingCategories,
    isSaving: saveMutation.isPending,
    isError: isErrorItems || isErrorCategories,
    error: errorItems || errorCategories,
    saveNavigation: saveMutation.mutate,
    refetch: () => {
      refetchItems();
      refetchCategories();
    },
  };
}

export function useNavigationItems(initialItems: NavigationItem[]) {
  const [items, setItems] = useState<NavigationItem[]>(initialItems);

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  const handleDragEnd = useCallback(
    (activeId: string, overId: string | undefined) => {
      if (activeId === overId || !overId) return;
      setItems((prev) => {
        const oldIndex = prev.findIndex((item) => item.id === activeId);
        const newIndex = prev.findIndex((item) => item.id === overId);
        if (oldIndex === -1 || newIndex === -1) return prev;
        const newItems = [...prev];
        const [removed] = newItems.splice(oldIndex, 1);
        newItems.splice(newIndex, 0, removed);
        return newItems;
      });
    },
    [],
  );

  const addItem = useCallback((item: NavigationItem) => {
    setItems((prev) => [...prev, item]);
  }, []);

  const updateItem = useCallback((id: string, updated: NavigationItem) => {
    setItems((prev) => prev.map((item) => (item.id === id ? updated : item)));
  }, []);

  const deleteItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  return { items, setItems, handleDragEnd, addItem, updateItem, deleteItem };
}

export function createEmptyFormData(): FormData {
  return {
    label: "",
    type: "link",
    linkSource: "category",
    selectedCategory: "",
    customUrl: "",
    id: "",
    columns: [],
  };
}

export function buildFormDataFromItem(
  item: NavigationItem,
  categories: Category[],
): FormData {
  const matchedCat = categories.find(
    (c) =>
      item.href.includes(c.id) ||
      item.href.endsWith(c.name.toLowerCase().replace(/ /g, "-")),
  );
  return {
    label: item.label,
    type: item.type,
    linkSource: matchedCat ? "category" : "custom",
    selectedCategory: matchedCat?.id || "",
    customUrl: item.href,
    id: item.id,
    columns: item.columns || [],
  };
}

export function createNavigationItem(formData: FormData): NavigationItem {
  return {
    id: formData.id,
    label: formData.label,
    href: formData.customUrl,
    type: formData.type,
    columns: formData.type === "dropdown" ? formData.columns : undefined,
  };
}
