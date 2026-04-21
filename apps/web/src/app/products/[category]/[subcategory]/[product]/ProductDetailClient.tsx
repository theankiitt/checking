"use client";

import { useState } from "react";
import { Product } from "@/shared/types";
import { useCart } from "@/contexts/CartContext";
import toast from "react-hot-toast";
import { ShoppingCart, Check } from "lucide-react";
import ProductImageGallery from "./ProductImageGallery";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4444";

export default function ProductDetailClient({ product, categorySlug, subcategorySlug }: { product: Product; categorySlug: string; subcategorySlug: string }) {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const getImageUrl = (url: string | undefined) => {
    if (!url) return "/image.png";
    if (url.startsWith("http")) return url;
    return `${API_BASE_URL}${url}`;
  };

  const getCurrencyPrice = () => {
    if (product.currencyPrices && product.currencyPrices.length > 0) {
      const usdPrice = product.currencyPrices.find((cp) => cp.country === "United States");
      if (usdPrice) {
        return { price: usdPrice.price, symbol: usdPrice.currencySymbol || "$", currency: usdPrice.currency };
      }
      const first = product.currencyPrices[0];
      return { price: first.price, symbol: first.currencySymbol || "$", currency: first.currency };
    }
    return { price: product.price, symbol: "$", currency: "USD" };
  };

  const { price, symbol } = getCurrencyPrice();

  const handleAddToCart = () => {
    if ((product.quantity ?? 0) <= 0) return;

    setIsAdding(true);

    addToCart({
      id: product.id,
      name: product.name,
      price: Number(price),
      image: product.images?.[0] || product.image || "/image.png",
    }, 1);

    toast.success("Added to cart", {
      icon: "🛒",
      duration: 2000,
    });

    setTimeout(() => setIsAdding(false), 1500);
  };

  return (
    <div className="bg-white tracking-tight">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="text-sm text-gray-500 mb-6">
          <a href={`/products/${categorySlug}`} className="hover:text-[#EB6426]">
            {product.category?.name || categorySlug}
          </a>
          <span className="mx-2">/</span>
          <a href={`/products/${categorySlug}/${subcategorySlug}`} className="hover:text-[#EB6426]">
            {subcategorySlug}
          </a>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ProductImageGallery images={product.images || []} productName={product.name} />

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
              {product.category && (
                <p className="text-gray-600 mt-2">Category: {product.category.name}</p>
              )}
            </div>

            <div className="flex items-baseline gap-4">
              <span className="text-4xl font-bold text-[#EB6426]">
                {symbol}{Number(price).toFixed(2)}
              </span>
              {product.comparePrice && (
                <span className="text-xl text-gray-400 line-through">
                  {symbol}{product.comparePrice.toFixed(2)}
                </span>
              )}
            </div>

            {product.description && (
              <div
                className="prose max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            )}

            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${(product.quantity ?? 0) > 0 ? "text-green-600" : "text-red-600"}`}>
                {(product.quantity ?? 0) > 0 ? "In Stock" : "Out of Stock"}
              </span>
              {(product.quantity ?? 0) > 0 && (
                <span className="text-sm text-gray-500">({product.quantity} available)</span>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              disabled={(product.quantity ?? 0) <= 0 || isAdding}
              className="w-full bg-[#EB6426] text-white py-4 rounded-xl font-semibold hover:bg-[#d55a21] transition-all disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isAdding ? (
                <>
                  <Check className="w-5 h-5" />
                  Added to Cart
                </>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5" />
                  {(product.quantity ?? 0) > 0 ? "Add to Cart" : "Out of Stock"}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
