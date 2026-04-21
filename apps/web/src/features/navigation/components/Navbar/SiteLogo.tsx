import Image from "next/image";
import Link from "next/link";
import { SiteSettings } from "./types";

interface SiteLogoProps {
  settings: SiteSettings;
  size?: "sm" | "md" | "lg";
}

const SIZE_CLASSES = {
  sm: "h-8 w-auto",
  md: "h-10 w-auto",
  lg: "h-10 lg:h-11 xl:h-12 w-36 lg:w-40",
};

export function SiteLogo({ settings, size = "md" }: SiteLogoProps) {
  const logoSrc = settings.siteLogo && settings.siteLogo !== "/logo.png" ? settings.siteLogo : "/main.png";

  return (
    <Link href="/" className="flex items-center flex-shrink-0">
      <Image
        src={logoSrc}
        alt={settings.siteName || "GharSamma Logo"}
        width={144}
        height={48}
        className={`${SIZE_CLASSES[size]} object-contain`}
        style={{ width: "auto", height: "auto" }}
        priority
      />
    </Link>
  );
}
