import Image from "next/image";
import Link from "next/link";
import { manrope } from "@/app/fonts";

export default function HomepageBanner() {
  return (
    <section className="w-full bg-[#EB6426] py-8 md:py-12">
      <div className="max-w-[88rem] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="flex-1 text-left">
            <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight ${manrope.className}`}>
              Discover Authentic
              <br />
              Nepali Statues
            </h2>
            <p className="mt-4 text-white/80 text-lg md:text-xl max-w-lg">
              Exquisite handcrafted statues for worship and decoration, made with devotion and tradition.
            </p>
            <Link
              href="/products/statue"
              className="inline-block mt-6 text-white font-semibold text-lg underline underline-offset-4 hover:text-white/80 transition-colors"
            >
              Order Now
            </Link>
          </div>

          <div className="flex-1 relative w-full max-w-md md:max-w-lg">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
              <Image
                src="/statue.png"
                alt="Authentic Nepali Handicrafts"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
