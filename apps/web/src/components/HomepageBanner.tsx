import Image from "next/image";
import Link from "next/link";
import { manrope } from "@/app/fonts";
import { ArrowRight, Sparkles } from "lucide-react";

export default function HomepageBanner() {
  return (
    <section className="w-full bg-gradient-to-br from-[#EB6426] via-[#d65a1f] to-[#c44e18] py-12 md:py-20 overflow-hidden relative">
      {/* White line pattern background */}
      <div className="absolute inset-0 opacity-[0.07]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="linePattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#linePattern)" />
        </svg>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left - Content */}
          <div className="text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6">
            
              <span className={`text-sm font-medium text-white ${manrope.className}`}>Handcrafted with Love</span>
            </div>
            <h2 className={`text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight ${manrope.className}`}>
              Discover Handcrafted 
              <br />
              <span className="text-white/90">Nepali Statues</span>
            </h2>
          
            <p className="text-white/80 text-lg md:text-xl max-w-lg leading-relaxed mt-8">
              Exquisite handcrafted statues for worship and decoration, made with devotion and tradition passed down through generations.
            </p>
            <Link
              href="/products/statue"
              className="inline-flex items-center gap-2 mt-8 px-4 py-2  text-white font-semibold rounded-xl  transition-all duration-300 group"
            >
              Order Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>

          {/* Right - Image */}
          <div className="relative">
            <div className="relative aspect-[4/3] overflow-hidden s">
              <Image
                src="/statue.png"
                alt="Authentic Nepali Handicrafts"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </div>
            {/* Decorative frame */}
            <div className="absolute -bottom-4 -right-4 w-full h-full border-2 border-white/20 rounded-2xl -z-10" />
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-white/10 rounded-xl -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
}
