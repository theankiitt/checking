import { apiClient } from "@/lib/api/client";
import { ApiError, logError } from "@/lib/error-handler";
import type { Product, GetProductsParams } from "@/types/product.types";
import type { Review } from "@/shared/types";

function normalizeProductImage(product: Product): Product {
  let image = product.image || "/image.png";

  if (!image.startsWith("http")) {
    image = `${process.env.NEXT_PUBLIC_API_BASE_URL}${image.startsWith("/") ? "" : "/"}${image}`;
  }

  return { ...product, image };
}

function normalizeProduct(product: any): Product {
  let image = product.thumbnail || product.images?.[0] || "/image.png";

  if (!image.startsWith("http")) {
    image = `${process.env.NEXT_PUBLIC_API_BASE_URL}${image.startsWith("/") ? "" : "/"}${image}`;
  }

  const price = Number(product.price);
  const comparePrice = product.comparePrice
    ? Number(product.comparePrice)
    : undefined;
  const discount =
    comparePrice && comparePrice > price
      ? Math.round(((comparePrice - price) / comparePrice) * 100)
      : undefined;

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    price,
    comparePrice,
    discount,
    image,
    thumbnail: product.thumbnail,
    images: product.images,
    category: product.category,
    brand: product.brand,
    isOnSale: product.isOnSale,
    isActive: product.isActive,
    stock: product.stock,
    description: product.description,
    shortDescription: product.shortDescription,
  };
}

export async function getProducts(
  params: GetProductsParams = {},
): Promise<{ products: Product[]; pagination?: any; error?: ApiError | null }> {
  try {
    const queryParams = {
      page: params.page,
      limit: params.limit,
      category: params.category,
      brand: params.brand,
      minPrice: params.minPrice,
      maxPrice: params.maxPrice,
      search: params.search,
      sort: params.sort,
      isOnSale: params.isOnSale,
      isActive: params.isActive,
      country: params.country,
    };

    const data = await apiClient.get<{
      success: boolean;
      data: {
        products?: Product[];
        pagination?: any;
      };
    }>("/api/v1/products", queryParams);

    if (!data.success || !data.data) {
      return {
        products: [],
        error: new ApiError("Failed to fetch products", 0, data)
      };
    }

    const products = (data.data.products || []).map(normalizeProduct);
    return { products, pagination: data.data.pagination };
  } catch (error) {
    const apiError = error instanceof ApiError ? error : new ApiError("Failed to fetch products", 0, error);
    logError(apiError, { params });
    return { products: [], error: apiError };
  }
}

export async function getOngoingSalesProducts(
  limit: number = 4,
): Promise<Product[]> {
  const { products } = await getProducts({
    limit,
    isOnSale: true,
    isActive: true,
  });
  return products || [];
}

export async function getFeaturedProducts(
  limit: number = 20,
): Promise<Product[]> {
  const { products } = await getProducts({ limit, isActive: true });
  return products || [];
}

export async function getProductById(
  id: string,
  params?: { includeReviews?: boolean; includeRelated?: boolean },
): Promise<Product | null> {
  try {
    const searchParams: Record<string, string> = {};
    if (params?.includeReviews) searchParams.includeReviews = "true";
    if (params?.includeRelated) searchParams.includeRelated = "true";

    const data = await apiClient.get<{
      success: boolean;
      data: { product: any };
    }>(`/api/v1/products/${id}`, searchParams);

    if (!data.success || !data.data?.product) return null;
    return normalizeProduct(data.data.product);
  } catch (error) {
    const apiError = error instanceof ApiError ? error : new ApiError("Failed to fetch product", 0, error);
    logError(apiError, { productId: id });
    return null;
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const data = await apiClient.get<{
      success: boolean;
      data: { product: any };
    }>(`/api/v1/products/slug/${slug}`);

    if (!data.success || !data.data?.product) return null;
    return normalizeProduct(data.data.product);
  } catch (error) {
    const apiError = error instanceof ApiError ? error : new ApiError("Failed to fetch product", 0, error);
    logError(apiError, { slug });
    return null;
  }
}

export async function getRelatedProducts(
  productId: string,
  limit: number = 6,
): Promise<Product[]> {
  try {
    const data = await apiClient.get<{
      success: boolean;
      data: { products: any[] };
    }>(`/api/v1/products/${productId}/related`, { limit });

    if (!data.success || !Array.isArray(data.data?.products)) return [];
    return data.data.products.map(normalizeProduct);
  } catch (error) {
    const apiError = error instanceof ApiError ? error : new ApiError("Failed to fetch related products", 0, error);
    logError(apiError, { productId });
    return [];
  }
}

export async function submitProductReview(
  productId: string,
  reviewData: {
    rating: number;
    title?: string;
    comment: string;
    images?: File[];
  },
): Promise<Review | null> {
  try {
    if (reviewData.images && reviewData.images.length > 0) {
      const formData = new FormData();
      formData.append("rating", String(reviewData.rating));
      if (reviewData.title) {
        formData.append("title", reviewData.title);
      }
      formData.append("comment", reviewData.comment);
      reviewData.images.forEach((image) => {
        formData.append("images", image);
      });

      const response = await apiClient.postFormData<{
        success: boolean;
        data: { review: Review };
      }>(`/api/v1/products/${productId}/reviews`, formData);

      if (!response.success || !response.data?.review) {
        return null;
      }
      return response.data.review;
    } else {
      const response = await apiClient.post<{
        success: boolean;
        data: { review: Review };
      }>(`/api/v1/products/${productId}/reviews`, {
        rating: reviewData.rating,
        title: reviewData.title || null,
        comment: reviewData.comment,
      });

      if (!response.success || !response.data?.review) {
        return null;
      }
      return response.data.review;
    }
  } catch (error) {
    const apiError = error instanceof ApiError ? error : new ApiError("Failed to submit review", 0, error);
    logError(apiError, { productId });
    return null;
  }
}
