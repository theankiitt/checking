"use client";

import { MessageCircle, Package } from "lucide-react";
import { manrope } from "@/app/fonts";

const BANNER_MESSAGES = [
  {
    text: "All orders will be confirmed through WhatsApp conversation",
    icon: MessageCircle,
  },
  {
    text: "Minimum order weight must be 5kg or more",
    icon: Package,
  },
];

export default function InfoBanner() {
  return (
    <div className={`bg-[#EB6426] text-white overflow-hidden py-3 my-8 ${manrope.className}`}>
      <div className="relative flex items-center">
        <div
          className="flex items-center gap-8 whitespace-nowrap animate-marquee"
        >
          {[...BANNER_MESSAGES, ...BANNER_MESSAGES, ...BANNER_MESSAGES].map(
            (item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="flex items-center gap-3 flex-shrink-0"
                >
                  <Icon className="w-5 h-5" />
                  <p className={`text-sm md:text-base font-medium ${manrope.className}`}>
                    {item.text}
                  </p>
                  <span className="text-white/40">•</span>
                </div>
              );
            }
          )}
        </div>
      </div>
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
