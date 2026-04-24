"use client";

import Link from "next/link";
import Image from "next/image";
import { bricolage } from "@/app/fonts";

const GRID_ITEMS = [
  {
    id: "1",
    name: "Wool Carpet",
    image: "/carpet-layout.webp",
    link: "/products/handicrafts/wool-carpet",
    price: "Rs. 5000",
  },
  {
    id: "2",
    name: "Buddha Statue",
    image: "/statue-layout.webp",
    link: "/products/statues/buddha-statue",
    price: "Rs. 2000",
  },
  {
    id: "3",
    name: "Silk Carpet",
    image: "/carpet-layout.webp",
    link: "/products/handicrafts/silk-carpet",
    price: "Rs. 8000",
  },
  {
    id: "4",
    name: "Ganesh Statue",
    image: "/statue-layout.webp",
    link: "/products/statues/ganesh-statue",
    price: "Rs. 1500",
  },
  {
    id: "5",
    name: "Pashmina Shawl",
    image: "/pashmina-layout.webp",
    link: "/products/handicrafts/pashmina",
    price: "Rs. 3500",
  },
  {
    id: "6",
    name: "Shiva Statue",
    image: "/statue-layout.webp",
    link: "/products/statues/shiva-statue",
    price: "Rs. 2500",
  },
  {
    id: "7",
    name: "Metal Craft",
    image: "/metal-handicraft-300x300.png",
    link: "/products/handicrafts/metal-craft",
    price: "Rs. 1500",
  },
  {
    id: "8",
    name: "Krishna Statue",
    image: "/statue-layout.webp",
    link: "/products/statues/krishna-statue",
    price: "Rs. 1800",
  },
];

export default function HandicraftStatueSection() {
  return (
    <section className="w-full bg-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          className={`text-2xl font-bold text-gray-900 mb-6 ${bricolage.className}`}
        >
          Handicrafts & Statues
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {GRID_ITEMS.map((item) => (
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
                  className={`font-semibold text-gray-900 text-sm mb-1 ${bricolage.className}`}
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
