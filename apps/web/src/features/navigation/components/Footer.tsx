"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";
import { Mail, Phone, MapPin } from "lucide-react";
import Image from "next/image";
import { manrope } from "@/app/fonts";
import { SiteSettings, QuickLink, SocialLink } from "@/features/navigation/components/Navbar/types";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  facebook: FaFacebookF,
  instagram: FaInstagram,
  tiktok: FaTiktok,
};

const DEFAULT_QUICK_LINKS: QuickLink[] = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Categories", href: "/categories" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const DEFAULT_SOCIAL_LINKS: SocialLink[] = [
  { name: "Facebook", href: "https://www.facebook.com", icon: "facebook" },
  { name: "Instagram", href: "https://www.instagram.com", icon: "instagram" },
  { name: "TikTok", href: "https://www.tiktok.com", icon: "tiktok" },
];

interface FooterProps {
  siteSettings?: SiteSettings;
}

function SocialLinks({ links }: { links: SocialLink[] }) {
  return (
    <div className="space-y-4">
      <h3 className={`text-white font-bold text-xl ${manrope.className}`}>
        Social
      </h3>
      <div className="flex gap-3">
        {links.map((social) => {
          const Icon = ICON_MAP[social.icon.toLowerCase()] || FaFacebookF;
          return (
            <a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.name}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <Icon className="w-5 h-5 text-white" />
            </a>
          );
        })}
      </div>
    </div>
  );
}

function ContactInfo({ settings }: { settings: SiteSettings }) {
  return (
    <div className="space-y-4">
      <h3 className={`text-white font-bold text-xl ${manrope.className}`}>
        Contact
      </h3>
      <ul className="space-y-3">
        <li className="flex items-center gap-3">
          <Phone className="w-5 h-5 text-gray-400 flex-shrink-0" />
          <a
            href={`tel:${settings.phone?.replace(/\s/g, "")}`}
            className="text-sm text-gray-300 hover:text-white transition-colors"
          >
            {settings.phone}
          </a>
        </li>
        <li className="flex items-center gap-3">
          <Mail className="w-5 h-5 text-gray-400 flex-shrink-0" />
          <a
            href={`mailto:${settings.email}`}
            className="text-sm text-gray-300 hover:text-white transition-colors"
          >
            {settings.email}
          </a>
        </li>
      </ul>
    </div>
  );
}

function QuickLinksSection({ links }: { links: QuickLink[] }) {
  return (
    <div className="space-y-4">
      <h3 className={`text-white font-bold text-xl ${manrope.className}`}>
        Quick Links
      </h3>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.href + link.label}>
            <Link
              href={link.href}
              className="text-sm text-gray-300 hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FooterBottom({ siteName }: { siteName: string }) {
  const currentYear = new Date().getFullYear();

  return (
    <div className="border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col items-center md:items-start gap-1">
            <p className={`text-sm text-gray-400 ${manrope.className}`}>
              © {currentYear} {siteName}. All rights reserved.
            </p>
            <span className="text-sm text-gray-500">
              Website by{" "}
              <a
                href="https://syncforge.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors font-medium"
              >
                Sync.Forge
              </a>
            </span>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-6">
            <Link
              href="/privacy-policy"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms-and-conditions"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Footer({ siteSettings }: FooterProps) {
  const [settings, setSettings] = useState<SiteSettings>(
    siteSettings || {
      siteName: "Celebrate Multi Industries",
      siteLogo: "/main.png",
      siteFavicon: "/favicon.ico",
      email: "gharsamma6@gmail.com",
      phone: "+977 123 456 7890",
      address: "Kathmandu, Nepal",
      city: "",
      country: "Nepal",
      footerQuickLinks: DEFAULT_QUICK_LINKS,
      socialLinks: DEFAULT_SOCIAL_LINKS,
      footerDescription: "Authentic Nepali handicrafts, traditional foods, and cultural products. We deliver the rich heritage of Nepal directly to your doorstep worldwide.",
    }
  );
  const [categoryLinks, setCategoryLinks] = useState<QuickLink[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(DEFAULT_SOCIAL_LINKS);

  useEffect(() => {
    if (!siteSettings) {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
      fetch(`${API_BASE_URL}/api/v1/configuration/public/site-settings`)
        .then((res) => res.json())
        .then((result) => {
          if (result.success) {
            setSettings(result.data);
          }
        })
        .catch(() => {});
    }
  }, [siteSettings]);

  useEffect(() => {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
    fetch(`${API_BASE_URL}/api/v1/categories?active=true`)
      .then((res) => res.json())
      .then((result) => {
        if (result.success && result.data) {
          const links = (result.data.categories || []).map((cat: any) => ({
            label: cat.name,
            href: `/products/${cat.slug}`,
          }));
          setCategoryLinks(links);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
    fetch(`${API_BASE_URL}/api/v1/configuration/public/site-settings`)
      .then((res) => res.json())
      .then((result) => {
        if (result.success && result.data) {
          const data = result.data;
          const links: SocialLink[] = [];
          if (data.facebookUrl) {
            links.push({ name: "Facebook", href: data.facebookUrl, icon: "facebook" });
          }
          if (data.instagramUrl) {
            links.push({ name: "Instagram", href: data.instagramUrl, icon: "instagram" });
          }
          if (data.tiktokUrl) {
            links.push({ name: "TikTok", href: data.tiktokUrl, icon: "tiktok" });
          }
          if (links.length > 0) {
            setSocialLinks(links);
          }
        }
      })
      .catch(() => {});
  }, []);

  const quickLinks = categoryLinks.length > 0 ? categoryLinks : (settings.footerQuickLinks || DEFAULT_QUICK_LINKS);

  return (
    <footer className="bg-[#262626] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          <div>
            <Link href="/" className="inline-block mb-4">
                <Image
                  src="/gharsamma-logo.png"
                  alt={settings.siteName || "Celebrate Multi Industries"}
                  width={120}
                  height={40}
                  className="h-10 w-auto object-contain brightness-0 invert"
                  style={{ width: "auto", height: "auto" }}
                  priority
                />
            </Link>
            <p className="text-md text-white text-justify leading-relaxed">
              {settings.footerDescription ||
                "Authentic Nepali handicrafts, traditional foods, and cultural products. We deliver the rich heritage of Nepal directly to your doorstep worldwide."}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-[auto_1fr_1fr] gap-x-16 gap-y-8">
            <QuickLinksSection links={quickLinks} />
            <ContactInfo settings={settings} />
            <SocialLinks links={socialLinks} />
          </div>
        </div>
      </div>

      <FooterBottom siteName={settings.siteName || "Celebrate Multi Industries"} />
    </footer>
  );
}
