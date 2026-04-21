"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SubCategory {
  id: string;
  name: string;
  slug: string;
  image?: string;
  productCount?: number;
}

interface MobileSubCategorySidebarProps {
  categorySlug: string;
  categoryName: string;
  subCategories: SubCategory[];
  loading?: boolean;
  onSubCategorySelect?: (slug: string) => void;
}

// Resolve image URLs from API
const resolveImageURL = (url: string | undefined | null): string => {
  if (!url) return "";
  if (url.startsWith("data:") || url.startsWith("http")) return url;
  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4444";
  return `${API_URL}${url.startsWith("/") ? "" : "/"}${url}`;
};

// Extract image URL from category object (tries multiple possible field names)
const getCategoryImage = (category: any): string | undefined => {
  return category.image || category.icon || category.logo || category.imageUrl || category.thumbnail;
};

export default function MobileSubCategorySidebar({
  categorySlug,
  categoryName,
  subCategories,
  loading,
  onSubCategorySelect,
}: MobileSubCategorySidebarProps) {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  const checkScroll = useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  }, []);

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [subCategories, checkScroll]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 100;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleSubCategoryClick = (slug: string) => {
    setSelectedSlug(slug);
    if (onSubCategorySelect) {
      onSubCategorySelect(slug);
    } else {
      router.push(`/products/${categorySlug}/${slug}`);
    }
  };

  if (loading) {
    return (
      <div className="md:hidden border-b border-gray-200 bg-white p-3">
        <div className="flex gap-3 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 w-20 animate-pulse">
              <div className="w-16 h-16 mx-auto bg-gray-200 rounded-xl mb-2" />
              <div className="h-3 bg-gray-200 rounded w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (subCategories.length === 0) {
    return null;
  }

  return (
    <div className="md:hidden  relative">
      {/* Scroll Arrows */}
      {showLeftArrow && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-1 top-1/2 -translate-y-1/2 z-10 w-7 h-7 bg-white shadow-md rounded-full flex items-center justify-center border border-gray-200"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-4 h-4 text-gray-600" />
        </button>
      )}

      {showRightArrow && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-1 top-1/2 -translate-y-1/2 z-10 w-7 h-7 bg-white shadow-md rounded-full flex items-center justify-center border border-gray-200"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-4 h-4 text-gray-600" />
        </button>
      )}

      {/* Scrollable Container */}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex overflow-x-auto scrollbar-hide py-3 px-2 gap-3"
      >
        {subCategories.map((sub) => {
          const isActive = selectedSlug === sub.slug;
          const imageUrl = resolveImageURL(sub.image);
          
          return (
            <button
              key={sub.id}
              onClick={() => handleSubCategoryClick(sub.slug)}
              className={`flex-shrink-0 flex flex-col items-center gap-1.5 group min-w-[72px] transition-all ${
                isActive ? "scale-105" : ""
              }`}
            >
              {/* Image Container */}
              <div className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shadow-sm ${
                isActive 
                  ? "border-orange-500 ring-2 ring-orange-200 bg-orange-50" 
                  : "border-gray-200 group-hover:border-orange-300 bg-white"
              }`}>
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={sub.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder-category.jpg";
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-400">
                      {sub.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              {/* Label */}
              <span className={`text-[10px] font-medium text-center leading-tight line-clamp-2 max-w-[64px] ${
                isActive ? "text-orange-600 font-semibold" : "text-gray-600 group-hover:text-orange-600"
              }`}>
                {sub.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
