import { apiClient } from "@/lib/api/client";
import { WishlistItem } from "@/shared/types";

export const wishlistApi = {
  getWishlist: async (): Promise<WishlistItem[]> => {
    const response = await apiClient.get<{ wishlist: WishlistItem[] }>(
      "/wishlist",
    );
    return response.wishlist || [];
  },

  addToWishlist: async (productId: string): Promise<void> => {
    await apiClient.post("/wishlist", { productId });
  },

  removeFromWishlist: async (productId: string): Promise<void> => {
    await apiClient.delete(`/wishlist/${productId}`);
  },
};
