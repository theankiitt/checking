export interface Banner {
  id: string;
  mediaUrl: string;
  linkTo?: string;
  internalLink?: string;
  altText?: string;
}

export const SITE_CONFIG = {
  name: "Celebrate Multi Industries",
  url: "https://gharsamma.com",
  logo: "/gharsamma-logo.png",
  social: {
    facebook: "https://facebook.com/gharsamma",
    instagram: "https://instagram.com/gharsamma",
    twitter: "https://twitter.com/gharsamma",
  },
} as const;

export const SEO_KEYWORDS = [
  "Nepali handicrafts",
  "traditional artifacts",
  "Nepalese products",
  "organic foods Nepal",
  "handmade crafts",
  "cultural products",
  "sari",
  "jewelry Nepal",
  "statues",
  "carpets Nepal",
] as const;

export const CACHE_TAGS = {
  promotionalBanners: "promotional-banners",
} as const;

export const CACHE_DURATION = {
  banners: 3600,
} as const;
