import Image from "next/image";
import Link from "next/link";

export default function DualImageBanner() {
  return (
    <section className="w-full py-6 md:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div className="relative aspect-[16/9] rounded-xl overflow-hidden group">
            <Image
              src="/b1.jpg"
              alt="Banner 1"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              priority
            />
          </div>
          <div className="relative aspect-[16/9] rounded-xl overflow-hidden group">
            <Image
              src="/b2.jpg"
              alt="Banner 2"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
