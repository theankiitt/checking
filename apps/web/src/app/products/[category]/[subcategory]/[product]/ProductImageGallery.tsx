"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4444";

const getImageUrl = (url: string | undefined) => {
  if (!url) return "/image.png";
  if (url.startsWith("http")) return url;
  return `${API_BASE_URL}${url}`;
};

export default function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const mainImageRef = useRef<HTMLDivElement>(null);

  const validImages = images.filter(Boolean);

  if (validImages.length === 0) {
    return (
      <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center">
        <span className="text-gray-400">No image</span>
      </div>
    );
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mainImageRef.current) return;
    const rect = mainImageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  const handleMouseEnter = () => setIsZoomed(true);
  const handleMouseLeave = () => setIsZoomed(false);

  return (
    <div>
      {/* Desktop: Main image with zoom + thumbnails */}
      <div className="hidden md:block">
        <div
          ref={mainImageRef}
          className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden cursor-crosshair"
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <Image
            src={getImageUrl(validImages[activeIndex])}
            alt={productName}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
          {isZoomed && (
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: `url(${getImageUrl(validImages[activeIndex])})`,
                backgroundSize: "200%",
                backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                backgroundRepeat: "no-repeat",
              }}
            />
          )}
        </div>

        {validImages.length > 1 && (
          <div className="flex gap-3 mt-4">
            {validImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                  activeIndex === idx
                    ? "border-[#EB6426] ring-2 ring-[#EB6426]/20"
                    : "border-transparent hover:border-gray-300"
                }`}
              >
                <Image
                  src={getImageUrl(img)}
                  alt={`${productName} ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Mobile: Swiper slider */}
      <div className="md:hidden">
        <Swiper
          modules={[Pagination]}
          pagination={{ clickable: true }}
          spaceBetween={0}
          slidesPerView={1}
          onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
          className="rounded-xl overflow-hidden"
        >
          {validImages.map((img, idx) => (
            <SwiperSlide key={idx}>
              <div className="aspect-square bg-gray-100">
                <Image
                  src={getImageUrl(img)}
                  alt={productName}
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority={idx === 0}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
