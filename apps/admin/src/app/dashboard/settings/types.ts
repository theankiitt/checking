export interface SiteSettings {
  // General Settings
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  siteLogo: string;
  siteFavicon: string;

  // Contact Information
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;

  // Appearance Settings
  primaryColor: string;
  secondaryColor: string;
  theme: "light" | "dark" | "auto";

  // Notification Settings
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;

  // Security Settings
  twoFactorAuth: boolean;
  sessionTimeout: number;
  passwordPolicy: string;

  // Inventory Settings
  lowStockThreshold: number;
  autoReorder: boolean;
  trackInventory: boolean;

  // Social Media Links
  facebookUrl: string;
  instagramUrl: string;
  tiktokUrl: string;

  // SEO Settings
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogType: string;
  twitterCard: string;
  twitterSite: string;
  twitterCreator: string;
  canonicalUrl: string;
  robotsIndex: boolean;
  robotsFollow: boolean;
  sitemapUrl: string;
  googleAnalyticsId: string;
  googleTagManagerId: string;
  facebookPixelId: string;
  structuredData: string;

  // Analytics & Conversion API Settings
  googleAnalyticsMeasurementId: string;
  googleAnalyticsTrackingId: string;
  googleAnalyticsEnabled: boolean;
  enhancedEcommerceEnabled: boolean;
  googleAdsConversionId: string;
  googleAdsConversionLabel: string;
  googleAdsEnabled: boolean;
  facebookConversionApiEnabled: boolean;
  facebookConversionApiToken: string;
  facebookPixelAdvancedMatching: boolean;
  customTrackingScripts: string;
}

export type TabKey =
  | "general"
  | "contact"
  | "social"
  | "notifications"
  | "security"
  | "inventory"
  | "seo"
  | "analytics";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface UploadResponse {
  url: string;
  originalName: string;
  size: number;
  type: string;
  filename: string;
}
