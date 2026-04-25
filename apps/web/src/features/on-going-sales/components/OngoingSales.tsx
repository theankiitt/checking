"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { getOngoingSalesProducts } from "@/services/product.service";
import { Product } from "@/shared/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4444";

const getImageUrl = (url: string | undefined) => {
  if (!url) return "/image.png";
  if (url.startsWith("http")) return url;
  return `${API_BASE_URL}${url}`;
};

export default function OngoingSales() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOngoingSalesProducts(4).then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  if (loading) return null;
  if (products.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">On Sale Now</h2>
          <p className="text-gray-500 mt-1">Grab these deals before they are gone</p>
        </div>
        <Link href="/products?sale=true" className="text-[#EB6426] font-medium flex items-center gap-1 hover:underline">
          View All <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.category?.slug || "foods"}/${product.slug}`}
            className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
          >
            <div className="relative aspect-square bg-gray-100 overflow-hidden">
              <Image
                src={getImageUrl(product.images?.[0])}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              {product.comparePrice && (
                <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  -{Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}%
                </span>
              )}
            </div>
            <div className="p-3 md:p-4">
              <h3 className="font-semibold text-gray-900 truncate">{product.name}</h3>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-lg font-bold text-[#EB6426]">
                  ${Number(product.price).toFixed(2)}
                </span>
                {product.comparePrice && (
                  <span className="text-sm text-gray-400 line-through">
                    ${Number(product.comparePrice).toFixed(2)}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
