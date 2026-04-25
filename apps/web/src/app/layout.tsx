import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Suspense } from "react";
import { headers } from "next/headers";
import "./globals.css";
import { Providers, CookieConsent } from "@/features/layout";
import { BottomNavWrapper, Footer, Navbar } from "@/features/navigation";
import SmoothScroll from "@/components/SmoothScroll";
import WhatsAppButton from "@/components/WhatsAppButton";
import { public_sans } from "./fonts";

const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || "G-6H6MX4145F";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://gharsamma.com",
  ),
  title: {
    default: "Celebrate Multi Industries - Traditional Nepali Products",
    template: "%s | Celebrate Multi Industries",
  },
  description:
    "Discover authentic Nepali handicrafts, puja samagri, musical instruments, herbs, and jewelry at GharSamma",
  keywords: [
    "nepali handicrafts",
    "traditional products",
    "nepal",
    "handmade",
    "puja samagri",
    "handicrafts",
  ],
  authors: [{ name: "Celebrate Multi Industries" }],
  creator: "Celebrate Multi Industries",
  publisher: "Celebrate Multi Industries",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Celebrate Multi Industries",
    title: "Celebrate Multi Industries - Traditional Nepali Products",
    description:
      "Discover authentic Nepali handicrafts, puja samagri, musical instruments, herbs, and jewelry",
    images: [
      {
        url: "/gharsamma-logo.png",
        width: 1200,
        height: 630,
        alt: "Celebrate Multi Industries",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Celebrate Multi Industries - Traditional Nepali Products",
    description:
      "Discover authentic Nepali handicrafts, puja samagri, musical instruments, herbs, and jewelry",
    images: ["/og-image.jpg"],
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
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#EB6426",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "/";
  const showNavbar = !pathname.startsWith("/help");

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${GA_MEASUREMENT_ID}', { page_path: window.location.pathname });`}
        </Script>
      </head>
      <body className={`${public_sans.className}  antialiased`}>
        <SmoothScroll />
        <Providers>
          <CookieConsent />
          {showNavbar && <Navbar />}

          <div className="min-h-screen flex flex-col pt-[80px] md:pt-[100px]">
            <main className="flex-1 pb-20 md:pb-0">
              <Suspense fallback={null}>{children}</Suspense>
            </main>
          </div>

          <BottomNavWrapper />
          <WhatsAppButton />
        </Providers>
      </body>
    </html>
  );
}
