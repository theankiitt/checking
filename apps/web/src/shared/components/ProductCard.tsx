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
  categorySlug?: string;
  subcategorySlug?: string;
}

const ProductCard = memo(function ProductCard({
  product,
  viewMode = "grid",
  onAddToCart,
  onToggleWishlist,
  priority = false,
  categorySlug,
  subcategorySlug,
}: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4444";

  const getImageUrl = (url: string | undefined) => {
    if (!url) return null;
    if (url.startsWith("http")) {
      return url.replace("localhost:5555", "localhost:4444");
    }
    return `${API_BASE_URL}${url}`;
  };

  const discount = product.comparePrice
    ? calculateDiscountPercentage(product.comparePrice, product.price)
    : 0;

  const productHref = categorySlug && subcategorySlug
    ? `/products/${categorySlug}/${subcategorySlug}/${product.slug}`
    : product.category?.slug
      ? `/products/${product.category.slug}/${product.slug}`
      : `/products/${product.slug}`;

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
          <Link href={productHref}>
            <Image
              src={getImageUrl(product.images?.[0] || product.image) || "/placeholder-image.jpg"}
              alt={product.name}
              fill
              className="object-contain rounded-lg"
              priority={priority}
            />
          </Link>
          
        </div>

        <div className="flex-1 min-w-0">
          <Link href={productHref}>
            <h3 className="font-semibold mt-4 text-gray-900 text-base tracking-tight  group-hover:text-[#EB6426] transition-color">
              {product.name}
            </h3>
          </Link>
         

         


     
        </div>
      </div>
    );
  }

  return (
    <div
      className="group rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-square overflow-hidden ">
        <Link href={productHref}>
          <Image
            src={getImageUrl(product.images?.[0] || product.image) || "/placeholder-image.jpg"}
            alt={product.name}
            fill
            className="object-contain group-hover:scale-110 transition-transform duration-500"
            priority={priority}
          />
        </Link>
      
      </div>

      <div className="p-4">
        <Link href={productHref}>
          <h3 className="font-semibold mt-4 text-gray-900 text-base tracking-tight  group-hover:text-[#EB6426] transition-color">
            {product.name}
          </h3>
        </Link>
       
      </div>
    </div>
  );
});

export default ProductCard;
