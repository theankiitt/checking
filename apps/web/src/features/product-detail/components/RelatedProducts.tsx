"use client";

import { motion } from "framer-motion";
import { Star, ShoppingCart, Eye, Heart } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { Product } from "../types";

interface RelatedProductsProps {
  products: Product[];
  popularProducts?: Product[];
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
};

const getDiscount = (price: number, comparePrice?: number) => {
  if (comparePrice && comparePrice > price) {
    return Math.round(((comparePrice - price) / comparePrice) * 100);
  }
  return 0;
};

// Resolve image URLs from API
const resolveImageURL = (url: string | undefined | null): string => {
  if (!url) return "/placeholder-product.jpg";
  if (url.startsWith("data:") || url.startsWith("http")) return url;
  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4444";
  return `${API_URL}${url.startsWith("/") ? "" : "/"}${url}`;
};

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  const discount = getDiscount(product.price, product.comparePrice);
  const imageSrc = resolveImageURL(product.images?.[0] || product.image);
  const productUrl = `/products/${product.category?.slug || "uncategorized"}/${product.slug}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300"
    >
      <Link href={productUrl} className="block">
        {/* Image Container */}
        <div className="relative aspect-square bg-gray-100 overflow-hidden">
          <img
            src={imageSrc}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder-product.jpg";
            }}
          />

          {/* Discount Badge */}
          {discount > 0 && (
            <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              -{discount}%
            </span>
          )}

          {/* Overlay Buttons */}
          <div className={`absolute inset-0 bg-black/20 flex items-center justify-center gap-2 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <button
              onClick={(e) => {
                e.preventDefault();
                // Quick view logic
              }}
              className="p-2 bg-white rounded-full hover:bg-orange-50 transition-colors shadow-md"
              title="Quick View"
            >
              <Eye className="w-4 h-4 text-gray-700" />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                // Add to cart logic
              }}
              className="p-2 bg-white rounded-full hover:bg-orange-50 transition-colors shadow-md"
              title="Add to Cart"
            >
              <ShoppingCart className="w-4 h-4 text-gray-700" />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                setIsWishlisted(!isWishlisted);
              }}
              className={`p-2 rounded-full transition-colors shadow-md ${isWishlisted ? 'bg-red-500 text-white' : 'bg-white hover:bg-red-50'}`}
              title="Add to Wishlist"
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : 'text-gray-700'}`} />
            </button>
          </div>
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4">
        <Link href={productUrl}>
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2 group-hover:text-orange-600 transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${i < Math.floor(product.averageRating || 0) ? "fill-current" : "text-gray-300"}`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">
            ({product.reviewCount || 0})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-orange-600">
            {formatPrice(product.price)}
          </span>
          {product.comparePrice && product.comparePrice > product.price && (
            <span className="text-xs text-gray-400 line-through">
              {formatPrice(product.comparePrice)}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function RelatedProducts({
  products,
  popularProducts = [],
}: RelatedProductsProps) {
  if (products.length === 0 && popularProducts.length === 0) return null;

  return (
    <div className="space-y-12">
      {/* Similar Products */}
      {products.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                Similar Products
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                More items you might like from this category
              </p>
            </div>
            <span className="text-sm text-orange-600 font-medium">
              {products.length} items
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {products.slice(0, 5).map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </section>
      )}

      {/* Products You May Like */}
      {popularProducts.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                Products You May Like
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Trending and popular picks for you
              </p>
            </div>
            <span className="text-sm text-orange-600 font-medium">
              {popularProducts.length} items
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {popularProducts.slice(0, 5).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
