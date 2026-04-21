import Link from "next/link";
import Image from "next/image";

interface Banner {
  id: string;
  mediaUrl: string;
  linkTo?: string;
  internalLink?: string;
}

interface PromotionalBannerProps {
  banners: Banner[];
}

export default function PromotionalBanner({ banners }: PromotionalBannerProps) {
  if (banners.length === 0) {
    return <DefaultPromotionalBanner />;
  }

  const banner = banners[0];

  return (
    <div className="bg-white pb-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href={banner.internalLink || "/special-offers"}
          className="block group"
        >
          <div className="relative w-full h-48 md:h-64 lg:h-80 rounded-2xl overflow-hidden shadow-lg">
            <Image
              src={banner.mediaUrl}
              alt={banner.linkTo || "Promotional Banner"}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent flex items-center">
              <div className="px-6 md:px-12 text-white">
                <h3 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4 custom-font">
                  Exclusive Offers
                </h3>
                <p className="text-base md:text-lg mb-4 md:mb-6 opacity-90 custom-font">
                  Discover amazing deals and special promotions
                </p>
                <button className="px-6 py-3 md:px-8 md:py-4 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-sm md:text-base">
                  Shop Now
                </button>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}

function DefaultPromotionalBanner() {
  return (
    <div className="bg-white pb-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/special-offers" className="block group">
          <div className="relative w-full h-48 md:h-64 lg:h-80 rounded-2xl overflow-hidden shadow-lg bg-gradient-to-r from-blue-600 to-purple-600">
            <div className="absolute inset-0 flex items-center">
              <div className="px-6 md:px-12 text-white">
                <h3 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4 custom-font">
                  Exclusive Offers
                </h3>
                <p className="text-base md:text-lg mb-4 md:mb-6 opacity-90 custom-font">
                  Discover amazing deals and special promotions
                </p>
                <button className="px-6 py-3 md:px-8 md:py-4 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-sm md:text-base">
                  Shop Now
                </button>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
