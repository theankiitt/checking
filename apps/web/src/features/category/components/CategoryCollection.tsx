"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Package } from "lucide-react";
import {
  MediaItem,
  CategoryCollectionProps,
  getCategoryColors,
  handleMediaError,
} from "./types";

const CategoryCollection: React.FC<CategoryCollectionProps> = ({
  className = "",
}) => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMediaItems = async () => {
      try {
        setLoading(true);
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;
        const response = await fetch(
          `${API_BASE_URL}/api/v1/media?active=true`,
        );

        if (!response.ok) throw new Error("Failed to fetch media items");

        const data = await response.json();
        const categoryMediaItems = (data.data.mediaItems || []).filter(
          (item: MediaItem) =>
            item.internalLink?.startsWith("/products/") ||
            item.linkTo === "category",
        );
        setMediaItems(categoryMediaItems);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch media items",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMediaItems();
  }, []);

  const getLink = (item: MediaItem) => {
    if (item.internalLink?.startsWith("/products/")) return item.internalLink;
    if (item.category) return `/products/${item.category.slug}`;
    return "#";
  };

  if (loading) {
    return (
      <div className={`py-16 bg-gray-100 ${className}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-200 rounded-2xl p-8 animate-pulse"
              >
                <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
                <div className="h-8 bg-gray-300 rounded w-48 mb-4"></div>
                <div className="h-4 bg-gray-300 rounded w-64 mb-6"></div>
                <div className="h-10 bg-gray-300 rounded w-32"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`py-16 bg-gray-100 ${className}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <div className="text-red-600 mb-4">
              <Package className="h-12 w-12 mx-auto mb-2" />
              <h3 className="text-lg font-semibold">
                Unable to load categories
              </h3>
              <p className="text-sm text-gray-600">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (mediaItems.length === 0) {
    return (
      <div className={`py-16 bg-gray-100 ${className}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <div className="text-gray-500">
              <Package className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                No media items available
              </h3>
              <p className="text-sm">Check back later for media updates</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const displayMediaItems = mediaItems.slice(0, 6);

  return (
    <div className={`py-16 bg-gray-100 ${className}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {displayMediaItems.map((item, index) => {
            const isLarge = index === 0;
            const colors = getCategoryColors(index);

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className={`rounded-2xl overflow-hidden group cursor-pointer ${
                  isLarge ? "lg:col-span-2 lg:row-span-2" : ""
                }`}
              >
                <Link href={getLink(item)}>
                  <div className="relative">
                    {item.mediaType === "IMAGE" ? (
                      <Image
                        src={item.mediaUrl}
                        alt={`Media ${index + 1}`}
                        width={isLarge ? 800 : 400}
                        height={isLarge ? 600 : 300}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={handleMediaError}
                      />
                    ) : (
                      <video
                        src={item.mediaUrl}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        muted
                        loop
                        playsInline
                      />
                    )}
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoryCollection;
