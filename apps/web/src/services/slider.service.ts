import { apiClient } from "@/lib/api/client";
import type { SliderImage } from "@/types";
import { cache } from "react";
import { normalizeImageUrl } from "@/features/slider/utils";
import { SLIDER_CONFIG } from "@/features/slider/config";

export const getSliders = cache(async (): Promise<SliderImage[]> => {
  try {
    const data = await apiClient.get<{ sliders: SliderImage[] }>("/sliders");

    if (!data?.sliders) {
      return [];
    }

    return data.sliders
      .filter((slider: SliderImage) => slider.isActive)
      .map((slider: SliderImage) => ({
        ...slider,
        imageUrl: normalizeImageUrl(slider.imageUrl, process.env.NEXT_PUBLIC_API_BASE_URL || ""),
      }))
      .sort((a: SliderImage, b: SliderImage) => a.order - b.order);
  } catch {
    return [];
  }
});

export const getSliderById = cache(
  async (id: string): Promise<SliderImage | null> => {
    try {
      const data = await apiClient.get<{
        success: boolean;
        data: { slider: SliderImage };
      }>(`/api/v1/sliders/${id}`);

      if (!data.success || !data.data?.slider) return null;

      return {
        ...data.data.slider,
        imageUrl: normalizeImageUrl(data.data.slider.imageUrl, process.env.NEXT_PUBLIC_API_BASE_URL || ""),
      };
    } catch {
      return null;
    }
  },
);

export const revalidate = SLIDER_CONFIG.revalidate;
