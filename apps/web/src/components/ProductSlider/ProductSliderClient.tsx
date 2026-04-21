"use client";

import Link from "next/link";
import Image from "next/image";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import type { Product, SliderSection } from "./types";

interface ProductSliderClientProps {
  sections: SliderSection[];
}

export default function ProductSliderClient({
  sections,
}: ProductSliderClientProps) {
  if (sections.length === 0) {
    return null;
  }

  return (
    <div className="w-full space-y-12 md:space-y-16">
      {sections.map((section) => (
        <section
          key={section.id}
          className="relative w-full px-4 md:px-8 lg:px-16"
          aria-label={section.title}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                {section.title}
              </h2>
              {section.subtitle && (
                <p className="text-sm md:text-base text-gray-600 mt-1">
                  {section.subtitle}
                </p>
              )}
            </div>
            <Link
              href={`/products?filter=${section.id}`}
              className="text-sm md:text-base text-blue-600 hover:text-blue-800 font-medium"
            >
              See all
            </Link>
          </div>

          <div className="relative">
            <Swiper
              modules={[Navigation]}
              spaceBetween={16}
              slidesPerView={1}
              navigation={{
                nextEl: `.${section.id}-next`,
                prevEl: `.${section.id}-prev`,
              }}
              breakpoints={{
                320: { slidesPerView: 1, spaceBetween: 12 },
                480: { slidesPerView: 2, spaceBetween: 16 },
                640: { slidesPerView: 2, spaceBetween: 16 },
                768: { slidesPerView: 3, spaceBetween: 20 },
                1024: { slidesPerView: 4, spaceBetween: 24 },
                1280: { slidesPerView: 5, spaceBetween: 24 },
              }}
              className="!pb-12"
            >
              {section.products.map((product) => (
                <SwiperSlide key={product.id}>
                  <ProductCard product={product} />
                </SwiperSlide>
              ))}
            </Swiper>

            {section.products.length > 1 && (
              <>
                <button
                  className={`${section.id}-prev absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-4 z-10 bg-white shadow-lg hover:shadow-xl rounded-full p-2 md:p-3 transition-all duration-200 opacity-0 group-hover:opacity-100 disabled:opacity-50`}
                  aria-label="Previous slide"
                >
                  <svg
                    className="w-5 h-5 md:w-6 md:h-6 text-gray-800"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>

                <button
                  className={`${section.id}-next absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-4 z-10 bg-white shadow-lg hover:shadow-xl rounded-full p-2 md:p-3 transition-all duration-200 opacity-0 group-hover:opacity-100 disabled:opacity-50`}
                  aria-label="Next slide"
                >
                  <svg
                    className="w-5 h-5 md:w-6 md:h-6 text-gray-800"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </>
            )}
          </div>
        </section>
      ))}
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const discountPercentage = product.comparePrice
    ? Math.round(
        ((product.comparePrice - product.price) / product.comparePrice) * 100,
      )
    : 0;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
    >
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 480px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}

        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isNew && (
            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">
              New
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded">
              Best Seller
            </span>
          )}
          {product.isOnSale && discountPercentage > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
              -{discountPercentage}%
            </span>
          )}
        </div>
      </div>

      <div className="p-3 md:p-4">
        {product.category && (
          <p className="text-xs text-gray-500 mb-1">{product.category.name}</p>
        )}

        <h3 className="font-medium text-sm md:text-base text-gray-900 line-clamp-2 mb-2 min-h-[2.5rem]">
          {product.name}
        </h3>

        {product.averageRating !== undefined &&
          product.reviewCount !== undefined && (
            <div className="flex items-center gap-1 mb-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-3 h-3 md:w-4 md:h-4 ${
                      i < Math.round(product.averageRating || 0)
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-xs text-gray-500">
                ({product.reviewCount})
              </span>
            </div>
          )}

        <div className="flex items-center gap-2">
          <span className="text-base md:text-lg font-bold text-gray-900">
            NPR {product.price.toLocaleString()}
          </span>
          {product.comparePrice && product.comparePrice > product.price && (
            <span className="text-xs md:text-sm text-gray-500 line-through">
              NPR {product.comparePrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
