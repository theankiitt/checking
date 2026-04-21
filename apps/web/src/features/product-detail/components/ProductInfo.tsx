"use client";

import { useMemo } from "react";
import { ShoppingCart, Star } from "lucide-react";
import { Product } from "../types";
import { manrope, public_sans } from "@/app/fonts";

interface ProductInfoProps {
  product: Product;
  selectedColor: string | null;
  setSelectedColor: (color: string) => void;
  selectedSize: string | null;
  setSelectedSize: (size: string) => void;
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(price);
};

const getDiscountPercentage = (price: number, comparePrice?: number) => {
  if (comparePrice && price) {
    return Math.round(((comparePrice - price) / comparePrice) * 100);
  }
  return 0;
};

export default function ProductInfo({
  product,
  selectedColor,
  setSelectedColor,
  selectedSize,
  setSelectedSize,
}: ProductInfoProps) {
  const colorVariants = useMemo(
    () => product.variants?.filter((v) => v.name === "Color") || [],
    [product.variants],
  );
  const sizeVariants = useMemo(
    () => product.variants?.filter((v) => v.name === "Size") || [],
    [product.variants],
  );
  const uniqueColors = useMemo(
    () => [...new Set(colorVariants.map((v) => v.value))],
    [colorVariants],
  );
  const uniqueSizes = useMemo(
    () => [...new Set(sizeVariants.map((v) => v.value))],
    [sizeVariants],
  );
  const discountPercentage = useMemo(
    () => getDiscountPercentage(product.price, product.comparePrice),
    [product.price, product.comparePrice],
  );
  const inStock = product.quantity > 0;

  return (
    <div className={`space-y-4 ${manrope.className}`}>
      {/* Rating Section - Top */}
      <div className="flex items-center gap-2">
        <div className="flex text-yellow-400">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${i < Math.floor(product.averageRating || 0) ? "fill-current" : "text-gray-300"}`}
            />
          ))}
        </div>
        <span className="text-sm text-gray-600">
          {product.averageRating?.toFixed(1) || "0.0"} | {product.reviewCount || 0} reviews
        </span>
      </div>

      {/* Product Title - After Rating */}
      <div>
        <h1 className={`text-2xl lg:text-3xl font-bold text-gray-900 leading-tight ${manrope.className}`}>
          {product.name}
        </h1>
        {product.brand?.name && (
          <p className="text-sm text-gray-500 mt-1">
            Brand: <span className="text-gray-700 font-medium">{product.brand.name}</span>
          </p>
        )}
      </div>

      {/* Price Section */}
      <div className={`space-y-5 py-4 border-t border-b border-gray-300 ${manrope.className}`}>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-3">
              <span className="text-4xl font-bold text-[#EB6426]">
                {formatPrice(product.price)}
              </span>
              {product.comparePrice && (
                <span className="text-xl text-gray-400 line-through">
                  {formatPrice(product.comparePrice)}
                </span>
              )}
            </div>
            <p className="text-sm text-black mt-2">Inclusive of all taxes</p>
          </div>
          <div className="flex flex-col items-end">
            {product.comparePrice && (
              <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-sm font-medium mb-2">
                {discountPercentage}% OFF
              </span>
            )}
          </div>
        </div>
      </div>

      {uniqueColors.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2 mt-5 ">
            Color:{" "}
            <span className="text-gray-600 font-normal">
              {selectedColor || "Select Color"}
            </span>
          </label>
          <div className="flex flex-wrap gap-2">
            {uniqueColors.map((colorValue) => (
              <button
                key={colorValue}
                type="button"
                onClick={() => setSelectedColor(colorValue)}
                className={`px-4 py-2 rounded-lg border-2 transition-colors custom-font ${
                  selectedColor === colorValue
                    ? "border-[#0077b6] text-[#0077b6] bg-blue-50"
                    : "border-gray-300 text-gray-700 hover:border-gray-400"
                }`}
              >
                {colorValue}
              </button>
            ))}
          </div>
        </div>
      )}

      {uniqueSizes.length > 0 && (
        <div className="bg-red-400 mt-10">
          <label className="block text-sm text-gray-900 mb-2">
            Size:{" "}
            <span className="text-gray-600 font-normal">
              {selectedSize || "Select Size"}
            </span>
          </label>
          <div className="flex flex-wrap gap-2">
            {uniqueSizes.map((sizeValue) => (
              <button
                key={sizeValue}
                type="button"
                onClick={() => setSelectedSize(sizeValue)}
                className={`px-4 py-2 rounded-lg border-2 transition-colors custom-font ${
                  selectedSize === sizeValue
                    ? "border-[#0077b6] text-[#0077b6] bg-blue-50"
                    : "border-gray-300 text-gray-700 hover:border-gray-400"
                }`}
              >
                {sizeValue}
              </button>
            ))}
          </div>
        </div>
      )}

      {product.dimensions && (
        <div>
          <h3 className="text-xl text-black mb-3 font-bold">
            Size:{" "}
            <span className="text-gray-900 font-medium">
              {product.dimensions.width} {product.dimensions.unit || "cm"} ×{" "}
              {product.dimensions.height} {product.dimensions.unit || "cm"}
            </span>
            {product.weight && (
              <div className="mt-1 font-bold">
                Weight:{" "}
                <span className="text-gray-900 font-medium">
                  {product.weight} {product.weightUnit || "g"}
                </span>
              </div>
            )}
          </h3>
        </div>
      )}

      <div className="flex space-x-3">
        <button className="flex-1 bg-[#EB6426] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#d65a1f] transition-colors flex items-center justify-center space-x-2">
          <ShoppingCart className="w-5 h-5" />
          <span>Add to Cart</span>
        </button>
      </div>

      {/* Mobile Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t border-gray-200 shadow-lg z-50 px-4 py-3 safe-area-bottom">
        <div className="flex items-center justify-between gap-3 max-w-lg mx-auto">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 line-through">
              {product.comparePrice ? formatPrice(product.comparePrice) : ""}
            </span>
            <span className="text-xl font-bold text-[#EB6426]">
              {formatPrice(product.price)}
            </span>
            <span className={`text-xs ${inStock ? 'text-green-600' : 'text-red-600'}`}>
              {inStock ? '✓ In Stock' : '✕ Out of Stock'}
            </span>
          </div>
          <button 
            disabled={!inStock}
            className="flex-1 bg-[#EB6426] text-white py-3 px-6 rounded-lg font-medium hover:bg-[#d65a1f] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 shadow-md"
          >
            <ShoppingCart className="w-5 h-5" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
}
