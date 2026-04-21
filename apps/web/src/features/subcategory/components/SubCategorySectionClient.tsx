"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { manrope } from "@/app/fonts";

interface SubCategory {
  id: string;
  name: string;
  slug: string;
  image: string;
}

interface SubCategorySectionClientProps {
  title: string;
  subtitle: string;
  subCategories: SubCategory[];
  categorySlug: string;
}

const getFullImageUrl = (imagePath: string): string => {
  if (!imagePath) return "";
  if (imagePath.startsWith("http")) return imagePath;
  if (imagePath.startsWith("/uploads/")) {
    const API_BASE_URL =
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4444";
    return `${API_BASE_URL}${imagePath}`;
  }
  return imagePath;
};

export default function SubCategorySectionClient({
  title,
  subtitle,
  subCategories,
}: SubCategorySectionClientProps) {
  if (!subCategories || subCategories.length === 0) {
    return (
      <section className="w-full bg-gray-100 py-6">
        <div className={`max-w-[88rem] mx-auto px-4 ${manrope.className}`}>
          <h2 className={`text-2xl md:text-3xl font-bold text-gray-900 mb-8 `}>
            {title}
          </h2>
          <div className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-gray-300 rounded-xl" />
                <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto mt-2" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-gray-100 py-6">
      <div className="max-w-[88rem] mx-auto px-4">
        <h2
          className={`text-2xl md:text-3xl tracking-tight font-bold text-black mb-4 ${manrope.className}`}
        >
          {title}
        </h2>

        <div className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {subCategories.slice(0, 8).map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/products/${category.slug}`} className="group block">
                <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100">
                  <Image
                    src={getFullImageUrl(category.image)}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <h3 className="mt-2 text-center font-semibold text-gray-900 text-sm md:text-base truncate">
                  {category.name}
                </h3>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
