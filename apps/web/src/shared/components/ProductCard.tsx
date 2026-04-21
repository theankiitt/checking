"use client";

import { useState, memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { cn, formatPrice, calculateDiscountPercentage } from "@/lib/utils";
import type { Product } from "@/shared/types";

interface ProductCardProps {
  product: Product;
  viewMode?: "grid" | "list";
  onAddToCart?: (product: Product) => void;
  onToggleWishlist?: (product: Product) => void;
  priority?: boolean;
}

const ProductCard = memo(function ProductCard({
  product,
  viewMode = "grid",
  onAddToCart,
  onToggleWishlist,
  priority = false,
}: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const discount = product.comparePrice
    ? calculateDiscountPercentage(product.comparePrice, product.price)
    : 0;

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    onToggleWishlist?.(product);
  };

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart?.(product);
  };

  if (viewMode === "list") {
    return (
      <div
        className="flex gap-4 bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative w-32 h-32 flex-shrink-0">
          <Link href={`/product/${product.slug}`}>
            <Image
              src={product.image || "/placeholder-image.jpg"}
              alt={product.name}
              fill
              className="object-cover rounded-lg"
              priority={priority}
            />
          </Link>
          {discount > 0 && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
              {discount}% OFF
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <Link href={`/product/${product.slug}`}>
            <h3 className="font-semibold text-gray-900 hover:text-[#EB6426] line-clamp-2">
              {product.name}
            </h3>
          </Link>
          <p className="text-sm text-gray-600 mt-1">
            {product.category?.name || "Uncategorized"}
          </p>

          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm text-gray-600 ml-1">
                {(product.averageRating ?? 0).toFixed(1)}
              </span>
              <span className="text-sm text-gray-500 ml-1">
                ({product.reviewCount ?? 0})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-2">
            <span className="text-2xl font-bold text-[#EB6426]">
              {formatPrice(product.price)}
            </span>
            {product.comparePrice && (
              <span className="text-lg text-gray-400 line-through">
                {formatPrice(product.comparePrice)}
              </span>
            )}
          </div>

          <div className="flex gap-2 mt-3">
            <button
              onClick={handleAddToCartClick}
              className="flex-1 bg-[#EB6426] text-white py-2 px-4 rounded-lg hover:bg-[#d55a21] transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </button>
            <button
              onClick={handleWishlistClick}
              className={cn(
                "p-2 rounded-lg border transition-colors",
                isWishlisted
                  ? "bg-red-50 border-red-500 text-red-500"
                  : "border-gray-300 hover:border-red-500 text-gray-600",
              )}
            >
              <Heart
                className={cn("w-5 h-5", isWishlisted && "fill-current")}
              />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300",
        isHovered && "transform scale-105",
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-square overflow-hidden">
        <Link href={`/product/${product.slug}`}>
          <Image
            src={product.image || "/placeholder-image.jpg"}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            priority={priority}
          />
        </Link>

        {discount > 0 && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs px-3 py-1.5 rounded-full font-semibold">
            {discount}% OFF
          </span>
        )}

        <button
          onClick={handleWishlistClick}
          className={cn(
            "absolute top-3 right-3 p-2 rounded-full transition-all duration-300",
            isWishlisted
              ? "bg-red-500 text-white"
              : "bg-white/90 backdrop-blur-sm text-gray-600 hover:bg-red-500 hover:text-white",
            !isWishlisted && "opacity-0 group-hover:opacity-100",
          )}
        >
          <Heart className={cn("w-5 h-5", isWishlisted && "fill-current")} />
        </button>

        {(product.quantity ?? 0) > 0 ? (
          <div
            className={cn(
              "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 pt-12 transition-all duration-300",
              isHovered
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4",
            )}
          >
            <button
              onClick={handleAddToCartClick}
              className="w-full bg-white text-[#EB6426] py-2.5 rounded-lg font-semibold hover:bg-[#EB6426] hover:text-white transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" />
              Add to Cart
            </button>
          </div>
        ) : (
          <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-4">
            <span className="text-white font-semibold">Out of Stock</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-semibold text-gray-900 hover:text-[#EB6426] line-clamp-2 transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-gray-600 mt-1 line-clamp-1">
          {product.category?.name || "Uncategorized"}
        </p>

        <div className="flex items-center gap-1 mt-2">
          <Star className="w-4 h-4 text-yellow-400 fill-current" />
          <span className="text-sm text-gray-600">
            {(product.averageRating ?? 0).toFixed(1)}
          </span>
          <span className="text-sm text-gray-500">
            ({product.reviewCount ?? 0})
          </span>
        </div>

        <div className="flex items-center gap-2 mt-3">
          <span className="text-xl font-bold text-[#EB6426]">
            {formatPrice(product.price)}
          </span>
          {product.comparePrice && (
            <span className="text-sm text-gray-400 line-through">
              {formatPrice(product.comparePrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
});

export default ProductCard;
