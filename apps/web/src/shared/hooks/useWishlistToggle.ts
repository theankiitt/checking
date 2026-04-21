"use client";

import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import { apiClient } from "@/lib/api/client";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  [key: string]: any;
}

interface UseWishlistToggleReturn {
  wishlistItems: Set<string>;
  isToggling: boolean;
  toggleWishlist: (product: Product) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
}

/**
 * Custom hook for managing wishlist toggle functionality
 * Consolidates duplicate wishlist logic used across multiple components
 */
export function useWishlistToggle(): UseWishlistToggleReturn {
  const [wishlistItems, setWishlistItems] = useState<Set<string>>(new Set());
  const [isToggling, setIsToggling] = useState(false);

  const toggleWishlist = useCallback(
    async (product: Product) => {
      if (isToggling) return; // Prevent rapid clicks

      setIsToggling(true);
      const isInWishlist = wishlistItems.has(product.id);

      try {
        if (isInWishlist) {
          // Remove from wishlist
          await apiClient.delete(`/wishlist?productId=${product.id}`);
          setWishlistItems((prev) => {
            const next = new Set(prev);
            next.delete(product.id);
            return next;
          });
          toast.success("Removed from wishlist", {
            icon: "💔",
          });
        } else {
          // Add to wishlist
          await apiClient.post("/wishlist", {
            productId: product.id,
          });
          setWishlistItems((prev) => new Set([...prev, product.id]));
          toast.success("Added to wishlist", {
            icon: "❤️",
          });
        }
      } catch (error) {
        toast.error("Failed to update wishlist. Please try again.");
        // Revert optimistic update
        if (!isInWishlist) {
          setWishlistItems((prev) => {
            const next = new Set(prev);
            next.delete(product.id);
            return next;
          });
        } else {
          setWishlistItems((prev) => new Set([...prev, product.id]));
        }
      } finally {
        setIsToggling(false);
      }
    },
    [wishlistItems, isToggling],
  );

  const isInWishlist = useCallback(
    (productId: string) => {
      return wishlistItems.has(productId);
    },
    [wishlistItems],
  );

  return {
    wishlistItems,
    isToggling,
    toggleWishlist,
    isInWishlist,
  };
}

export default useWishlistToggle;
