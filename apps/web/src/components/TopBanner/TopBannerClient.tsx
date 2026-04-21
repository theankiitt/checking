"use client";

import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Banner, BANNER_INTERVAL_MS } from "./types";

interface TopBannerClientProps {
  banners: Banner[];
}

function stripHtmlTags(input: string): string {
  return input.replace(/<[^>]*>/g, "");
}

function BannerContent({ banner }: { banner: Banner }) {
  const title = stripHtmlTags(banner.title);

  if (banner.link) {
    return (
      <a
        href={banner.link}
        target="_blank"
        rel="noopener noreferrer"
        className="text-white font-medium text-center text-lg md:text-xl hover:opacity-80 transition-opacity"
      >
        {title}
      </a>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="text-white font-semibold font-inter text-center text-lg md:text-xl"
    >
      {title}
    </motion.div>
  );
}

function DefaultBanner() {
  return (
    <div className="flex-grow flex justify-center">
      <div className="text-white text-center text-lg">
        Free Shipping on Orders Above $100
      </div>
    </div>
  );
}

export default function TopBannerClient({ banners }: TopBannerClientProps) {
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  const activeBanners = useMemo(
    () => banners.filter((b) => b.isActive),
    [banners],
  );

  const bannerCount = activeBanners.length;

  useEffect(() => {
    setCurrentBannerIndex((prev) => (prev >= bannerCount ? 0 : prev));
  }, [bannerCount]);

  useEffect(() => {
    if (bannerCount === 0) return;

    const interval = setInterval(
      () => setCurrentBannerIndex((prev) => (prev + 1) % bannerCount),
      BANNER_INTERVAL_MS,
    );
    return () => clearInterval(interval);
  }, [bannerCount]);

  const currentBanner = activeBanners[currentBannerIndex];

  return (
    <div
      className="border-b border-gray-800 bg-[#262626]"
      role="banner"
      aria-label="Promotional banner"
      aria-live="polite"
    >
      <div className="max-w-9xl mx-auto px-3 md:px-6 py-1 md:py-2 flex justify-center items-center gap-2 text-sm">
        {currentBanner ? (
          <div className="flex-grow flex justify-center">
            <AnimatePresence mode="wait">
              <BannerContent key={currentBanner.id} banner={currentBanner} />
            </AnimatePresence>
          </div>
        ) : (
          <DefaultBanner />
        )}
      </div>
    </div>
  );
}
