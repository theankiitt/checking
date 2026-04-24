"use client";

import Link from "next/link";
import Image from "next/image";
import { manrope } from "@/app/fonts";

const HANDICRAFT_ITEMS = [
  {
    id: "1",
    name: "Wool Carpet",
    image: "/carpet-layout.webp",
    link: "/products/handicrafts/wool-carpet",
    price: "Rs. 5000",
  },
  {
    id: "2",
    name: "Silk Carpet",
    image: "/carpet-layout.webp",
    link: "/products/handicrafts/silk-carpet",
    price: "Rs. 8000",
  },
  {
    id: "3",
    name: "Pashmina Shawl",
    image: "/pashmina-layout.webp",
    link: "/products/handicrafts/pashmina",
    price: "Rs. 3500",
  },
  {
    id: "4",
    name: "Metal Craft",
    image: "/metal-handicraft-300x300.png",
    link: "/products/handicrafts/metal-craft",
    price: "Rs. 1500",
  },
];

export default function HandicraftSection() {
  return (
    <section className="w-full bg-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          className={`text-2xl font-bold text-gray-900 mb-6 ${manrope.className}`}
        >
          Handicrafts
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {HANDICRAFT_ITEMS.map((item) => (
            <Link
              key={item.id}
              href={item.link}
              className="group bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              <div className="relative w-full aspect-square overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="25vw"
                />
              </div>
              <div className="p-3">
                <h3
                  className={`font-semibold text-gray-900 text-sm mb-1 ${manrope.className}`}
                >
                  {item.name}
                </h3>
                <p className="text-gray-600 text-xs">{item.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
