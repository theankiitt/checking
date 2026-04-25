"use client";

import { useState, useEffect, useMemo, memo } from "react";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import TopBanner from "@/components/TopBanner";
import SearchBar from "../SearchBar";
import { SiteLogo } from "./SiteLogo";
import { CartButton } from "./CartButton";
import { MobileMenu } from "./MobileMenu";
import { NavigationDropdown } from "./NavigationDropdown";
import { NavbarClientProps, SiteSettings } from "./types";
import { manrope } from "@/app/fonts";

const COLORS = {
  primary: "#EB6426",
  primaryDark: "#d65a1f",
  secondary: "#622A1F",
} as const;

const Z_INDEX = {
  mobile: 40,
  dropdown: 200,
  dropdownContent: 9999,
} as const;

function NavbarClient({
  navigationItems: serverNavigationItems,
}: NavbarClientProps) {
  const pathname = usePathname();

  const [navigationItems] = useState(serverNavigationItems);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    siteName: "Celebrate Multi Industries",
    siteLogo: "",
    siteFavicon: "",
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const fetchSiteSettings = async () => {
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;
        const response = await fetch(
          `${API_BASE_URL}/api/v1/configuration/public/site-settings`,
          { next: { revalidate: 3600 } },
        );

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            setSiteSettings(data.data);
          }
        }
      } catch (error) {
      }
    };

    fetchSiteSettings();
  }, []);

  useEffect(() => {
    if (siteSettings.siteFavicon) {
      const link = document.querySelector(
        "link[rel~='icon']",
      ) as HTMLLinkElement;
      if (link) {
        link.href = siteSettings.siteFavicon;
      } else {
        const newLink = document.createElement("link");
        newLink.rel = "icon";
        newLink.href = siteSettings.siteFavicon;
        document.head.appendChild(newLink);
      }
    }
  }, [siteSettings.siteFavicon]);

  const isActive = useMemo(
    () => (href: string) => pathname?.startsWith(href),
    [pathname],
  );

  return (
    <div className="w-full font-inter fixed top-0 left-0 right-0 z-50 bg-white">
      <TopBanner />

      <div
        className="border-b"
        style={{
          backgroundColor: COLORS.primary,
          borderColor: COLORS.primaryDark,
        }}
      >
        <div className="max-w-8xl mx-auto px-0 sm:px-4 md:px-6 lg:px-8 xl:px-10 py-0.5 sm:py-2 md:py-3">
          <div className="flex lg:hidden items-center justify-between gap-2 mb-2 px-4">
            <SiteLogo settings={siteSettings} size="sm" />
            <div className="flex items-center gap-2">
              <CartButton />
            </div>
          </div>

          <motion.div
            className="lg:hidden mb-2 space-y-2"
            initial={{ opacity: 0, y: -10 }}
            animate={isMounted ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
            transition={isMounted ? { duration: 0.3 } : { duration: 0 }}
          >
            <div className="mx-4 flex items-center gap-2">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-1.5 text-white rounded-lg hover:bg-orange-700 transition-colors"
                aria-label="Open menu"
                aria-expanded={isMobileMenuOpen}
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="flex-1">
                <SearchBar />
              </div>
            </div>
          </motion.div>

          <div className="px-4 relative">
            <MobileMenu
              isOpen={isMobileMenuOpen}
              onClose={() => setIsMobileMenuOpen(false)}
              navigationItems={navigationItems}
              siteSettings={siteSettings}
            />
          </div>

          <div className="hidden lg:flex items-center justify-between w-full">
            <SiteLogo settings={siteSettings} size="lg" />

            <div className="flex-1 flex justify-center max-w-4xl mx-6">
              <SearchBar className="w-full" inputClassName="text-base py-2" />
            </div>

            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-4">
                <CartButton />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="hidden md:block relative bg-[#EB6426]"
        style={{ overflow: "visible" }}
      >
        <div className="w-full px-6 py-2" style={{ overflow: "visible" }}>
          <nav
            className="flex items-center justify-center"
            style={{ overflow: "visible" }}
          >
<div
               className={`flex flex-wrap space-x-3 md:space-x-5 text-lg font-medium text-white ${manrope.className}`}
             >
              {navigationItems.map((item) =>
                item.type === "dropdown" ? (
                  <NavigationDropdown
                    key={item.id}
                    item={item}
                    isActive={activeDropdown === item.id}
                    onMouseEnter={() => setActiveDropdown(item.id)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  />
                ) : (
                  <a
                    key={item.id}
                    href={item.href}
                    className={`transition-colors whitespace-nowrap block py-2 px-3 relative `}
                  >
                    {item.label}
                  </a>
                ),
              )}
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
}

export default memo(NavbarClient);
