"use client";

import React, { useState, memo } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/types/category.types";
import SectionHeader from "./SectionHeader";
import EmptyState from "./EmptyState";
import { manrope } from "@/app/fonts";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4444";

interface SafeImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}

const SafeImage = memo(function SafeImage({
  src,
  alt,
  fill,
  width,
  height,
  className,
  priority,
}: SafeImageProps) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div
        className={`bg-gray-200 flex items-center justify-center ${className || ""}`}
      >
        <span className="text-gray-400 text-sm">No Image</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      width={width}
      height={height}
      className={className}
      onError={() => setError(true)}
      priority={priority}
    />
  );
});

const getFullImageUrl = (imagePath: string): string => {
  if (!imagePath) return "";
  if (imagePath.startsWith("http")) return imagePath;
  if (imagePath.startsWith("/uploads/")) {
    return `${API_BASE_URL}${imagePath}`;
  }
  return `${API_BASE_URL}/uploads${imagePath}`;
};

interface CategoryCardProps {
  category: Category;
}

const CategoryCard = memo(function CategoryCard({
  category,
}: CategoryCardProps) {
  const firstChild = category.children?.[0];
  const parentImage = category.image;
  const childImage = firstChild?.image;
  const childCount = category.children?.length || 0;

  return (
    <Link
      href={`/products/${category.slug.split("-")[0]}`}
      className="group"
      aria-label={`Browse ${category.name}`}
    >
      <div className="h-full flex flex-col rounded-2xl overflow-hidden transition-all duration-300 ">
        <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-gray-100">
          {parentImage ? (
            <SafeImage
              src={getFullImageUrl(parentImage)}
              alt={category.name}
              fill
              className="object-contain group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-gray-500 text-3xl font-semibold">
                {category.name.charAt(0)}
              </span>
            </div>
          )}
        </div>

        <div className="flex-1 flex flex-col items-center justify-center py-3 px-3">
          <h3
            className={`font-bold tracking-tight text-black text-lg md:text-xl uppercase  truncate text-center ${manrope.className}`}
          >
            {category.name}
          </h3>
        </div>
      </div>
    </Link>
  );
});

interface CategorySectionClientProps {
  categories: Category[];
}

export default memo(function CategorySectionClient({
  categories,
}: CategorySectionClientProps) {
  if (categories.length === 0) {
    return <EmptyState message="No category found at the moment." title="Shop By Category" />;
  }

  return (
    <div
      className="container max-w-[88rem] mx-auto px-4 mt-12"
      role="region"
      aria-label="Categories"
    >
      <SectionHeader
        title="Shop More By Category"
        subtitle="Discover our curated collection"
      />

      <div className="flex gap-4 lg:gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
        {categories.map((category) => (
          <div
            key={category.id}
            className="flex-shrink-0 w-36 lg:w-48 snap-start"
          >
            <CategoryCard category={category} />
          </div>
        ))}
      </div>
    </div>
  );
});
