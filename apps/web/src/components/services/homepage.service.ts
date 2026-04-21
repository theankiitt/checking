import { Banner, CACHE_TAGS, CACHE_DURATION } from "../types/homepage";

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function fetchWithErrorHandling<T>(
  url: string,
  options?: RequestInit,
): Promise<T> {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new ApiError(
        response.status,
        `HTTP error! status: ${response.status}`,
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new ApiError(0, "Network error - server unreachable");
    }
    throw error;
  }
}

export async function getPromotionalBanners(): Promise<Banner[]> {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!API_BASE_URL) {
    return [];
  }

  try {
    const data = await fetchWithErrorHandling<{
      data: { mediaItems: Banner[] };
    }>(`${API_BASE_URL}/api/v1/media?linkTo=home&active=true`, {
      next: {
        revalidate: CACHE_DURATION.banners,
        tags: [CACHE_TAGS.promotionalBanners],
      },
    });

    return data?.data?.mediaItems ?? [];
  } catch (error) {
    return [];
  }
}

export { ApiError };
