import type { Metadata, Viewport } from "next";
import "./globals.css";
import { public_sans } from "@/lib/fonts";
import { Providers } from "./providers";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { APP_CONFIG } from "./config";

export const metadata: Metadata = {
  title: {
    default: APP_CONFIG.title,
    template: APP_CONFIG.titleTemplate,
  },
  description: APP_CONFIG.description,
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
} satisfies Metadata;

export const viewport: Viewport = APP_CONFIG.viewport;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang={APP_CONFIG.locale} className={public_sans.className}>
      <body className={APP_CONFIG.bodyClasses}>
        <ErrorBoundary>
          <Providers>{children}</Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}
