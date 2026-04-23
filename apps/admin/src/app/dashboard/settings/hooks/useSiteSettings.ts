import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SiteSettings, ApiResponse, UploadResponse } from "../types";
import toast from "react-hot-toast";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4444";

const SETTINGS_KEY = ["settings", "site"];

async function fetchSettingsApi(): Promise<SiteSettings> {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/configuration/site-settings`,
    {
      credentials: "include",
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch settings");
  }

  const data: ApiResponse<SiteSettings> = await response.json();

  if (!data.success || !data.data) {
    throw new Error(data.message || "Failed to fetch settings");
  }

  return data.data;
}

async function saveSettingsApi(settings: SiteSettings): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/configuration/site-settings`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(settings),
    },
  );

  const data: ApiResponse<null> = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Failed to save settings");
  }
}

async function uploadMediaApi(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/api/v1/upload/media`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  const data: ApiResponse<UploadResponse> = await response.json();

  if (!response.ok || !data.success || !data.data) {
    throw new Error(data.message || "Upload failed");
  }

  return data.data.url;
}

export function useSiteSettings() {
  const queryClient = useQueryClient();
  const [pendingUpdates, setPendingUpdates] = useState<Partial<SiteSettings>>(
    {},
  );

  const {
    data: serverSettings,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: SETTINGS_KEY,
    queryFn: fetchSettingsApi,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const saveMutation = useMutation({
    mutationFn: saveSettingsApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SETTINGS_KEY });
    },
    onError: (err: Error) => {
      throw err;
    },
  });

  const uploadMutation = useMutation({
    mutationFn: uploadMediaApi,
    onSuccess: () => {},
    onError: (err: Error) => {
      throw err;
    },
  });

  const updateSettings = useCallback(
    (updates: Partial<SiteSettings>) => {
      setPendingUpdates((prev) => ({ ...prev, ...updates }));

      queryClient.setQueryData<SiteSettings>(SETTINGS_KEY, (oldData) => {
        if (!oldData) return undefined;
        return { ...oldData, ...updates };
      });
    },
    [queryClient],
  );

  const saveSettingsHandler = useCallback(async () => {
    if (!serverSettings) return;

    const mergedSettings = { ...serverSettings, ...pendingUpdates };
    setPendingUpdates({});

    try {
      await saveMutation.mutateAsync(mergedSettings);
    } catch {
      throw new Error("Failed to save settings");
    }
  }, [serverSettings, pendingUpdates, saveMutation]);

  const uploadMediaHandler = useCallback(
    async (file: File): Promise<string> => {
      try {
        return await uploadMutation.mutateAsync(file);
      } catch {
        throw new Error("Upload failed");
      }
    },
    [uploadMutation],
  );

  const settings = { ...getDefaultSettings(), ...serverSettings };
  const isUploading = uploadMutation.isPending;
  const isSaving = saveMutation.isPending;
  const saveError = saveMutation.error?.message || null;

  return {
    settings,
    isLoading,
    isSaving,
    isUploading,
    error: error?.message || saveError,
    updateSettings,
    saveSettings: saveSettingsHandler,
    uploadMedia: uploadMediaHandler,
    refetch,
  };
}

function getDefaultSettings(): SiteSettings {
  return {
    siteName: "Gharsamma Ecommerce",
    siteDescription: "Your trusted online shopping destination",
    siteUrl: "https://gharsamma.com",
    siteLogo: "/image.png",
    siteFavicon: "/favicon.ico",
    email: "info@gharsamma.com",
    phone: "+977-1-2345678",
    address: "Thamel, Kathmandu",
    city: "Kathmandu",
    country: "Nepal",
    primaryColor: "#3B82F6",
    secondaryColor: "#10B981",
    theme: "light",
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordPolicy: "strong",
    lowStockThreshold: 10,
    autoReorder: false,
    trackInventory: true,
    facebookUrl: "",
    instagramUrl: "",
    tiktokUrl: "",
    seoTitle: "Gharsamma Ecommerce",
    seoDescription: "",
    seoKeywords: "",
    ogTitle: "",
    ogDescription: "",
    ogImage: "",
    ogType: "website",
    twitterCard: "summary_large_image",
    twitterSite: "",
    twitterCreator: "",
    canonicalUrl: "",
    robotsIndex: true,
    robotsFollow: true,
    sitemapUrl: "",
    googleAnalyticsId: "",
    googleTagManagerId: "",
    facebookPixelId: "",
    structuredData: "",
    googleAnalyticsMeasurementId: "",
    googleAnalyticsTrackingId: "",
    googleAnalyticsEnabled: false,
    enhancedEcommerceEnabled: false,
    googleAdsConversionId: "",
    googleAdsConversionLabel: "",
    googleAdsEnabled: false,
    facebookConversionApiEnabled: false,
    facebookConversionApiToken: "",
    facebookPixelAdvancedMatching: false,
    customTrackingScripts: "",
  };
}
