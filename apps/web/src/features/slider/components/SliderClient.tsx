"use client";

import Link from "next/link";
import Image from "next/image";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import type { SliderImage } from "@/types";
import { ChevronIcon } from "@/components/ui/ChevronIcon";
import { SLIDER_CONFIG } from "../config";
import styles from "./SliderClient.module.css";

interface SliderClientProps {
  sliders: SliderImage[];
}

export default function SliderClient({ sliders }: SliderClientProps) {
  if (!sliders || sliders.length === 0) {
    return null;
  }

  const { autoplay, speed } = SLIDER_CONFIG;

  return (
    <section
      className={`relative w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8 mt-4 md:mt-8 h-[200px] md:h-[300px] lg:h-[400px] xl:h-[450px] rounded-lg overflow-hidden ${styles.section}`}
      aria-label="Featured carousel"
      role="region"
    >
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        navigation={{
          nextEl: ".slider-button-next",
          prevEl: ".slider-button-prev",
        }}
        pagination={{
          clickable: true,
          bulletClass: styles.bullet,
          bulletActiveClass: styles.bulletActive,
        }}
        autoplay={autoplay}
        loop={sliders.length > 1}
        speed={speed}
        className="w-full h-full"
        aria-live="polite"
        aria-roledescription="carousel"
      >
        {sliders.map((slider, index) => (
          <SwiperSlide
            key={slider.id}
            className="w-full h-full overflow-hidden"
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${sliders.length}`}
          >
            <Link
              href={slider.internalLink || "#"}
              className="block w-full h-full"
              aria-label={`View slide ${index + 1}`}
            >
              <Image
                src={slider.imageUrl}
                alt={`Slide ${index + 1}`}
                fill
                className="object-cover rounded-xl"
                sizes="100vw"
                quality={85}
                priority={index === 0}
                loading={index === 0 ? "eager" : "lazy"}
              />
            </Link>
          </SwiperSlide>
        ))}

        <SliderNavButtons count={sliders.length} />
      </Swiper>
    </section>
  );
}

interface SliderNavButtonsProps {
  count: number;
}

function SliderNavButtons({ count }: SliderNavButtonsProps) {
  if (count <= 1) return null;

  return (
    <>
      <NavButton
        direction="left"
        ariaLabel="Previous slide"
        className="slider-button-prev"
      />
      <NavButton
        direction="right"
        ariaLabel="Next slide"
        className="slider-button-next"
      />
    </>
  );
}

interface NavButtonProps {
  direction: "left" | "right";
  ariaLabel: string;
  className: string;
}

function NavButton({ direction, ariaLabel, className }: NavButtonProps) {
  return (
    <button
      className={`absolute top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-gray-800 p-2 md:p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed opacity-0 group-hover/slider:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className} ${styles.navButton}`}
      aria-label={ariaLabel}
    >
      <ChevronIcon direction={direction} className="w-5 h-5 md:w-6 md:h-6" />
    </button>
  );
}
