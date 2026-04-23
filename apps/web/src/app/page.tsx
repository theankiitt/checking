import { Suspense } from "react";
import { Slider } from "@/features/slider";
import { CategorySection } from "@/features/category";


import { SnacksSubCategory } from "@/features/subcategory";
import JewelrySection from "@/features/subcategory/components/CarpetSubCategory";
import HandicraftSection from "@/features/subcategory/components/HandicraftSection";

import { AboutUs } from "@/features/about";
import { OrganizationSchema, WebSiteSchema } from "@/components/utils/schemas";
import { getPromotionalBanners } from "@/components/services/homepage.service";
import { SITE_CONFIG } from "@/lib/constants";
import CustomOrderSection from "@/components/CustomOrderSection";
import HomepageBanner from "@/components/HomepageBanner";
import DualImageBanner from "@/components/DualImageBanner";
import { manrope } from "./fonts";
import InfoBanner from "@/components/InfoBanner";

const SECTION_CONFIG = [
  {
    Component: CategorySection,
    label: "Product Categories",
    key: "categories",
  },
  {
    Component: DualImageBanner,
    label: "Dual Image Banner",
    key: "dual-image-banner",
  },
  {
    Component: InfoBanner,
    label: "Info Banner",
    key: "info-banner",
  },
  { Component: SnacksSubCategory, label: "Snacks Collection", key: "snacks-subcategory" },
  {
    Component: HandicraftSection,
    label: "Handicraft Collection",
    key: "handicraft",
  },
  
  {
    Component: JewelrySection,
    label: "Jewelry Collection",
    key: "jewelry",
  },

  
] as const;

export default async function Homepage() {
  const promotionalBanners = await getPromotionalBanners().catch(() => []);

  return (
    <>
      <OrganizationSchema />
      <WebSiteSchema />

      <main className="min-h-screen" role="main">
        <h1 className="sr-only">
          {SITE_CONFIG.name} - Authentic Nepali Handicrafts & Traditional
          Products
        </h1>

        <Slider />

        {SECTION_CONFIG.map(({ Component, label, key }) => (
          <section key={key} aria-label={label}>
            <Component />
          </section>
        ))}

         <div className="bg-[#EB6426] text-white py-3 px-4 text-center my-8">
          <p className={`text-md md:text-lg font-semibold tracking-wide ${manrope.className}`}>
            Save 10% — Order Now and Enjoy Instant Savings!
          </p>
        </div>

        <HomepageBanner />

       

        <CustomOrderSection />

        <AboutUs />

        {/* <PromotionalBanner banners={promotionalBanners} /> */}
      </main>
    </>
  );
}
