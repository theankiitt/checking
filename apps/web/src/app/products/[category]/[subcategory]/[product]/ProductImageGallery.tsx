"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Pagination, Zoom } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/free-mode";
import "swiper/css/zoom";
import { X, ZoomIn, ZoomOut } from "lucide-react";

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5555";

const getImageUrl = (url: string | undefined) => {
  if (!url) return "/image.png";
  if (url.startsWith("http")) return url;
  return `${API_BASE_URL}${url}`;
};

export default function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [showMobileModal, setShowMobileModal] = useState(false);
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
          className="relative aspect-square bg-gray-50 rounded-xl overflow-hidden cursor-crosshair"
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <Image
            src={getImageUrl(validImages[activeIndex])}
            alt={productName}
            fill
            className="object-contain"
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
                  className="object-contain"
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Mobile: Slider */}
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
              <button
                onClick={() => setShowMobileModal(true)}
                className="w-full aspect-square bg-gray-50 block"
              >
                <Image
                  src={getImageUrl(img)}
                  alt={productName}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority={idx === 0}
                />
              </button>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Mobile Image Modal */}
      {showMobileModal && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col md:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => setShowMobileModal(false)}
              className="p-2 text-white/80 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
            <span className="text-white/60 text-sm">
              {activeIndex + 1} / {validImages.length}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  const swiperEl = document.querySelector('.modal-swiper') as any;
                  if (swiperEl?.swiper?.zoom?.out) swiperEl.swiper.zoom.out();
                }}
                className="p-2 text-white/80 hover:text-white"
              >
                <ZoomOut className="w-5 h-5" />
              </button>
              <button
                onClick={() => {
                  const swiperEl = document.querySelector('.modal-swiper') as any;
                  if (swiperEl?.swiper?.zoom?.in) swiperEl.swiper.zoom.in();
                }}
                className="p-2 text-white/80 hover:text-white"
              >
                <ZoomIn className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 relative">
            <Swiper
              modules={[FreeMode, Pagination, Zoom]}
              zoom={{ maxRatio: 3, minRatio: 1 }}
              freeMode
              pagination={{ clickable: true, el: '.modal-pagination' }}
              initialSlide={activeIndex}
              onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
              className="modal-swiper h-full"
            >
              {validImages.map((img, idx) => (
                <SwiperSlide key={idx} className="flex items-center justify-center">
                  <div className="swiper-zoom-container w-full h-full flex items-center justify-center p-4">
                    <Image
                      src={getImageUrl(img)}
                      alt={`${productName} ${idx + 1}`}
                      fill
                      className="object-contain"
                      sizes="100vw"
                      priority={idx === 0}
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            <div className="modal-pagination absolute bottom-4 left-0 right-0"></div>
          </div>
        </div>
      )}
    </div>
  );
}
