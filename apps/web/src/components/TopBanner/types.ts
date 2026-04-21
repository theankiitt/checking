import { publicApiClient } from "@/lib/api/client";

export interface Banner {
  id: string;
  title: string;
  link?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const BANNER_INTERVAL_MS = 3000;

export async function getAllBanners(): Promise<Banner[]> {
  const data = await publicApiClient.get<Banner[]>("/banners");
  return data;
}
