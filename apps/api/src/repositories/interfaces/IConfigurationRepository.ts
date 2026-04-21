export interface SystemConfig {
  id: string;
  key: string;
  value: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface NavigationMenu {
  items: NavigationItem[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface NavigationItem {
  id: string;
  label: string;
  href?: string;
  children?: NavigationItem[];
  icon?: string;
  isActive?: boolean;
}

export interface SiteSettings {
  siteName?: string;
  siteLogo?: string;
  siteFavicon?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  currency?: string;
  timezone?: string;
  language?: string;
  primaryColor?: string;
  secondaryColor?: string;
  theme?: string;
  taxRate?: number;
  shippingCost?: number;
}

export interface CurrencyRate {
  id: string;
  country: string;
  currency: string;
  symbol: string;
  rateToNPR: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IConfigurationRepository {
  getNavigationMenu(): Promise<NavigationMenu | null>;
  setNavigationMenu(menu: NavigationMenu): Promise<NavigationMenu>;
  getSiteSettings(): Promise<SiteSettings>;
  getSiteSettingsByKeys(keys: string[]): Promise<Record<string, any>>;
  updateSiteSettings(settings: Partial<SiteSettings>): Promise<void>;
  getCurrencyRates(): Promise<CurrencyRate[]>;
  updateCurrencyRates(
    rates: Omit<CurrencyRate, "id" | "createdAt" | "updatedAt">[],
  ): Promise<void>;
  getSystemConfig(key: string): Promise<any>;
  setSystemConfig(key: string, value: any): Promise<void>;
  deleteSystemConfig(key: string): Promise<void>;
  getDefaultCurrency(): Promise<string>;
  setDefaultCurrency(currency: string): Promise<void>;
}
