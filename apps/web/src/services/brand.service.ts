import { apiClient } from "@/lib/api/client";

export interface Brand {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  isActive: boolean;
}

export async function getBrands(params?: {
  page?: number;
  limit?: number;
}): Promise<Brand[]> {
  try {
    const data = await apiClient.get<{
      success: boolean;
      data: {
        brands?: Brand[];
      };
    }>("/api/v1/brands", params);

    if (!data.success || !Array.isArray(data.data?.brands)) {
      return [];
    }

    return data.data.brands;
  } catch (error) {
    return [];
  }
}
