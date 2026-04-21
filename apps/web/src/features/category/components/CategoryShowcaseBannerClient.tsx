"use client";

import Link from "next/link";
import Image from "next/image";

interface CategoryItem {
  id: string;
  title: string;
  image: string;
  link: string;
}

interface CategoryShowcaseBannerClientProps {
  categories: CategoryItem[];
  title?: string;
}

function BentoCard({ item }: { item: CategoryItem }) {
  const getFullImageUrl = (path: string) => {
    if (!path) return "/achar-layout.webp";
    if (path.startsWith("http")) return path;
    if (path.startsWith("/uploads/")) {
      const API_BASE_URL =
        process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4444";
      return `${API_BASE_URL}${path}`;
    }
    return path;
  };

  return (
    <Link
      href={item.link}
      className="group relative block h-full overflow-hidden rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
    >
      <div className="absolute inset-0">
        <Image
          src={getFullImageUrl(item.image)}
          alt={item.title}
          fill
          className="object-contain transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, 33vw"
          onError={(e) => {
            e.currentTarget.src = "/achar-layout.webp";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      </div>

      <div className="relative h-full flex flex-col justify-end p-4 md:p-6">
        <h3 className="text-white font-bold text-lg md:text-xl font-manrope leading-tight">
          {item.title}
        </h3>
        <div className="flex items-center text-white/90 text-xs md:text-sm font-medium mt-2">
          <span>Shop now</span>
          <svg
            className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1"
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
        </div>
      </div>
    </Link>
  );
}

export default function CategoryShowcaseBannerClient({
  categories,
  title = "Shop by Category",
}: CategoryShowcaseBannerClientProps) {
  if (!categories || categories.length === 0) {
    return null;
  }

  const firstCategory = categories[0];
  const secondCategory = categories[1];
  const thirdCategory = categories[2];
  const fourthCategory = categories[3];
  const fifthCategory = categories[4];
  const sixthCategory = categories[5];

  return (
    <section className="w-full bg-white pt-14 pb-4 ">
      <div className="max-w-[88rem] mx-auto ">
        <div
          className="grid grid-cols-3 md:grid-cols-3 gap-3"
          style={{ height: "500px" }}
        >
          {firstCategory && (
            <div className="col-span-1 row-span-1 h-full">
              <BentoCard item={firstCategory} />
            </div>
          )}

          {secondCategory && (
            <div className="col-span-1 row-span-1 h-full">
              <BentoCard item={secondCategory} />
            </div>
          )}

          {thirdCategory && (
            <div className="col-span-1 row-span-1 h-full">
              <BentoCard item={thirdCategory} />
            </div>
          )}

          {fourthCategory && (
            <div className="col-span-1 row-span-1 h-full">
              <BentoCard item={fourthCategory} />
            </div>
          )}

          {fifthCategory && (
            <div className="col-span-1 row-span-1 h-full">
              <BentoCard item={fifthCategory} />
            </div>
          )}

          {sixthCategory && (
            <div className="col-span-1 row-span-1 h-full">
              <BentoCard item={sixthCategory} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
