"use client";

import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ProductCard from "@/shared/components/ProductCard";
import { ProductGridSkeleton } from "@/shared/components/Skeleton";
import type { Product } from "@/shared/types";

interface ProductGridProps {
  products: Product[];
  viewMode?: "grid" | "list";
  onAddToCart?: (product: Product) => void;
  onToggleWishlist?: (product: Product) => void;
  onQuickView?: (product: Product) => void;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
}

export default function ProductGrid({
  products,
  viewMode: initialViewMode = "grid",
  onAddToCart,
  onToggleWishlist,
  onQuickView,
  loading = false,
  emptyMessage = "No products found. Try adjusting your filters or search terms.",
  className = "",
}: ProductGridProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">(initialViewMode);

  const handleAddToCart = useCallback(
    (product: Product) => {
      onAddToCart?.(product);
    },
    [onAddToCart],
  );

  const handleToggleWishlist = useCallback(
    (product: Product) => {
      onToggleWishlist?.(product);
    },
    [onToggleWishlist],
  );

  const handleQuickView = useCallback(
    (product: Product) => {
      onQuickView?.(product);
    },
    [onQuickView],
  );

  if (loading) {
    return <ProductGridSkeleton count={6} viewMode={viewMode} />;
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {emptyMessage}
        </h3>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={viewMode}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className={`${
          viewMode === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            : "space-y-4"
        } ${className}`}
      >
        {products.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            viewMode={viewMode}
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
            priority={index < 6}
          />
        ))}
      </motion.div>
    </AnimatePresence>
  );
}
