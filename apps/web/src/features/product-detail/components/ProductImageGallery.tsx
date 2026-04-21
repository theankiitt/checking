"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Image from "next/image";

// Helper to resolve image URLs from API
const resolveImageURL = (url: string | undefined | null): string => {
  if (!url) return "";
  if (url.startsWith("data:") || url.startsWith("http")) return url;
  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4444";
  return `${API_URL}${url.startsWith("/") ? "" : "/"}${url}`;
};

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
}

export default function ProductImageGallery({
  images,
  productName,
}: ProductImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [showZoom, setShowZoom] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const [imageError, setImageError] = useState<Set<number>>(new Set());

  // Resolve all image URLs
  const resolvedImages = images.map(resolveImageURL);
  const mainImage = resolvedImages[selectedImage];

  const handleImageSelect = useCallback((index: number) => {
    setSelectedImage(index);
  }, []);

  const handleImageError = useCallback((index: number) => {
    setImageError((prev) => {
      const newSet = new Set(prev);
      newSet.add(index);
      return newSet;
    });
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  }, []);

  const handleMouseEnter = useCallback(() => {
    setShowZoom(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setShowZoom(false);
  }, []);

  const hasValidImages = resolvedImages.length > 0 && !imageError.has(selectedImage) && mainImage;

  return (
    <div className="flex flex-col md:flex-row gap-4 relative">
      <div className="relative order-1 md:order-1 flex flex-col gap-2">
        <div
          ref={imageContainerRef}
          className="relative h-[300px] md:h-[500px] w-full md:w-[450px] rounded-lg overflow-hidden shadow-lg cursor-crosshair"
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {hasValidImages ? (
            <Image
              src={mainImage}
              alt={productName}
              fill
              sizes="(max-width: 768px) 100vw, 450px"
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
              No image available
            </div>
          )}

          <div
            className="absolute border-2 border-orange-500 pointer-events-none opacity-50"
            style={{
              width: "20%",
              height: "20%",
              left: `${zoomPosition.x}%`,
              top: `${zoomPosition.y}%`,
              transform: "translate(-50%, -50%)",
            }}
          />
        </div>

        <div className="flex flex-row gap-2 order-2 md:order-1 overflow-x-auto pb-2">
          {resolvedImages.map((image, index) => (
            <button
              key={index}
              onClick={() => handleImageSelect(index)}
              className={`relative h-16 md:h-20 w-16 md:w-20 rounded-lg overflow-hidden border-2 transition-all duration-200 hover:scale-105 flex-shrink-0 ${
                selectedImage === index
                  ? "border-orange-500 ring-2 ring-orange-200"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              aria-label={`View image ${index + 1}`}
            >
              {imageError.has(index) || !image ? (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
                  N/A
                </div>
              ) : (
                <Image
                  src={image}
                  alt={`${productName} ${index + 1}`}
                  fill
                  sizes="80px"
                  className="object-cover"
                  onError={() => handleImageError(index)}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {showZoom && hasValidImages && (
        <div className="hidden md:block w-[400px] h-[500px] rounded-xl overflow-hidden shadow-2xl border-2 border-gray-200 bg-white flex-shrink-0 order-2 md:order-2">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `url(${mainImage})`,
              backgroundSize: "500%",
              backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
              backgroundRepeat: "no-repeat",
            }}
          />
        </div>
      )}
    </div>
  );
}
