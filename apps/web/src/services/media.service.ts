import { apiClient } from "@/lib/api/client";

export interface MediaItem {
  id: string;
  title?: string;
  description?: string;
  imageUrl: string;
  linkTo?: string;
  internalLink?: string;
  isActive: boolean;
  order?: number;
  type?: string;
}

export async function getMediaItems(params?: {
  active?: boolean;
  linkTo?: string;
  type?: string;
}): Promise<MediaItem[]> {
  try {
    const data = await apiClient.get<{
      success: boolean;
      data: {
        mediaItems?: MediaItem[];
      };
    }>("/api/v1/media", params);

    if (!data.success || !Array.isArray(data.data?.mediaItems)) {
      return [];
    }

    return data.data.mediaItems.map((item: MediaItem) => ({
      ...item,
      imageUrl: item.imageUrl.startsWith("http")
        ? item.imageUrl
        : `${process.env.NEXT_PUBLIC_API_BASE_URL}${item.imageUrl.startsWith("/") ? "" : "/"}${item.imageUrl}`,
    }));
  } catch (error) {
    return [];
  }
}
