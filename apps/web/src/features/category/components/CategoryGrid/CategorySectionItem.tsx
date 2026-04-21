import React from "react";
import Link from "next/link";
import Image from "next/image";
import { CategorySection } from "../types";

interface CategorySectionItemProps {
  section: CategorySection;
  colorScheme?: "orange" | "blue";
}

const getFullImageUrl = (path: string): string => {
  if (!path) return "/achar-layout.webp";
  if (path.startsWith("http")) return path;
  if (path.startsWith("/uploads/")) {
    const API_BASE_URL =
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4444";
    return `${API_BASE_URL}${path}`;
  }
  return path;
};

const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
  e.currentTarget.src = "/achar-layout.webp";
};

export default function CategorySectionItem({
  section,
  colorScheme = "orange",
}: CategorySectionItemProps) {
  const linkColor =
    colorScheme === "orange"
      ? "text-[#EB6426] hover:text-[#005f8f]"
      : "text-[#0077b6] hover:text-[#005f8f]";

  return (
    <div className="flex-shrink-0 w-80 bg-white p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900 font-bricolage mb-1">
          {section.title}
        </h3>
        {section.subtitle && (
          <p className="text-sm text-gray-600 custom-font">
            {section.subtitle}
          </p>
        )}
      </div>

      <div
        className="grid mb-6"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gridTemplateRows: "repeat(2, 1fr)",
          gap: "8px",
        }}
      >
        {section.items.slice(0, 4).map((item, index) => {
          const gridStyles: Record<number, React.CSSProperties> = {
            0: { gridColumn: "span 1", gridRow: "span 2" },
            1: { gridColumn: "span 1", gridRow: "span 1" },
            2: { gridColumn: "span 1", gridRow: "span 1", gridRowStart: "2" },
            3: { gridColumn: "span 1", gridRow: "span 2" },
          };
          return (
            <Link key={item.id} href={item.link} className="group block">
              <div
                className="relative bg-gray-50 overflow-hidden"
                style={gridStyles[index]}
              >
                <Image
                  src={getFullImageUrl(item.image)}
                  alt={item.name}
                  fill
                  className="object-contain group-hover:scale-105 transition-transform duration-300"
                  onError={handleImageError}
                />
              </div>
              <p className="text-sm font-medium text-gray-900 text-center custom-font">
                {item.name}
              </p>
            </Link>
          );
        })}
      </div>

      <div className="text-center">
        <Link
          href={section.linkHref}
          className={`inline-flex items-center text-sm font-medium transition-colors custom-font ${linkColor}`}
        >
          {section.linkText}
          <svg
            className="w-4 h-4 ml-1"
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
        </Link>
      </div>
    </div>
  );
}
