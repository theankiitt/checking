const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4444";

export interface Banner {
  id: string;
  title: string;
  link?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBannerInput {
  title: string;
  isActive: boolean;
}

export interface UpdateBannerInput {
  title?: string;
  isActive?: boolean;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${API_BASE_URL}/api/v1${endpoint}`;

  const response = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || errorData.message || "API request failed",
    );
  }

  return response.json();
}

export async function getBanners(): Promise<ApiResponse<Banner[]>> {
  return fetchApi<ApiResponse<Banner[]>>("/banners/admin");
}

export async function getBanner(id: string): Promise<ApiResponse<Banner>> {
  return fetchApi<ApiResponse<Banner>>(`/banners/${id}`);
}

export async function createBanner(
  data: CreateBannerInput,
): Promise<ApiResponse<Banner>> {
  return fetchApi<ApiResponse<Banner>>("/banners", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateBanner(
  id: string,
  data: UpdateBannerInput,
): Promise<ApiResponse<Banner>> {
  return fetchApi<ApiResponse<Banner>>(`/banners/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function toggleBanner(id: string): Promise<ApiResponse<Banner>> {
  return fetchApi<ApiResponse<Banner>>(`/banners/${id}/toggle`, {
    method: "PATCH",
  });
}

export async function deleteBanner(id: string): Promise<ApiResponse<void>> {
  return fetchApi<ApiResponse<void>>(`/banners/${id}`, {
    method: "DELETE",
  });
}
