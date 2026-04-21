import { Metadata } from "next";
import { SITE_CONFIG, SEO_KEYWORDS } from "../types/homepage";

export const generateMetadata = (): Metadata => ({
  title: `${SITE_CONFIG.name} - Authentic Nepali Handicrafts & Traditional Products`,
  description:
    "Discover authentic Nepali handicrafts, traditional artifacts, organic foods, and premium products. Shop the finest collection with secure payment and fast delivery across Nepal.",
  keywords: [...SEO_KEYWORDS],
  authors: [{ name: SITE_CONFIG.name }],
  openGraph: {
    title: `${SITE_CONFIG.name} - Authentic Nepali Handicrafts & Traditional Products`,
    description:
      "Discover authentic Nepali handicrafts and traditional products. Premium quality with secure payment and fast delivery.",
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_CONFIG.name} - Authentic Nepali Handicrafts`,
    description:
      "Discover authentic Nepali handicrafts and traditional products.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: SITE_CONFIG.url,
  },
});
