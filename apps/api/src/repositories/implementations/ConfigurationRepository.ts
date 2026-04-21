import prisma from "@/config/database";
import { cacheService, CacheKeys, CacheTTL } from "@/services";
import {
  IConfigurationRepository,
  NavigationMenu,
  SiteSettings,
  CurrencyRate,
} from "../interfaces";

export class ConfigurationRepository implements IConfigurationRepository {
  async getNavigationMenu(): Promise<NavigationMenu | null> {
    return cacheService.getOrSet(
      CacheKeys.config.navigation(),
      async () => {
        const config = await prisma.systemConfig.findUnique({
          where: { key: "navigation_menu" },
        });
        return config?.value as unknown as NavigationMenu | null;
      },
      CacheTTL.veryLong,
    );
  }

  async setNavigationMenu(menu: NavigationMenu): Promise<NavigationMenu> {
    const config = await prisma.systemConfig.upsert({
      where: { key: "navigation_menu" },
      update: { value: menu as any },
      create: { key: "navigation_menu", value: menu as any },
    });

    await cacheService.delete(CacheKeys.config.navigation());

    return config.value as unknown as NavigationMenu;
  }

  async getSiteSettings(): Promise<SiteSettings> {
    return cacheService.getOrSet(
      CacheKeys.config.siteSettings(),
      async () => {
        const settings = await prisma.systemConfig.findMany({
          where: {
            key: {
              in: [
                "siteName",
                "siteLogo",
                "siteFavicon",
                "email",
                "phone",
                "address",
                "city",
                "country",
                "currency",
              ],
            },
          },
        });

        const result: SiteSettings = {
          siteName: "GharSamma",
          siteLogo: "/logo.png",
          siteFavicon: "/favicon.ico",
        };

        settings.forEach((config) => {
          (result as any)[config.key] = config.value;
        });

        return result;
      },
      CacheTTL.veryLong,
    );
  }

  async getSiteSettingsByKeys(keys: string[]): Promise<Record<string, any>> {
    const cacheKey = `config:settings:${keys.sort().join(",")}`;

    return cacheService.getOrSet(
      cacheKey,
      async () => {
        const settings = await prisma.systemConfig.findMany({
          where: { key: { in: keys } },
        });

        const result: Record<string, any> = {};
        settings.forEach((config) => {
          result[config.key] = config.value;
        });

        return result;
      },
      CacheTTL.veryLong,
    );
  }

  async updateSiteSettings(settings: Partial<SiteSettings>): Promise<void> {
    await prisma.$transaction(
      Object.entries(settings).map(([key, value]) =>
        prisma.systemConfig.upsert({
          where: { key },
          update: { value: value as any },
          create: { key, value: value as any },
        }),
      ),
    );

    await Promise.all([
      cacheService.delete(CacheKeys.config.siteSettings()),
      cacheService.deletePattern("config:settings:*"),
    ]);
  }

  async getCurrencyRates(): Promise<CurrencyRate[]> {
    return cacheService.getOrSet(
      CacheKeys.config.currencyRates(),
      async () => {
        const rates = await prisma.currencyRate.findMany({
          orderBy: { createdAt: "asc" },
        });

        return rates.map((rate) => ({
          ...rate,
          rateToNPR: Number(rate.rateToNPR),
        })) as CurrencyRate[];
      },
      CacheTTL.long,
    );
  }

  async updateCurrencyRates(
    rates: Omit<CurrencyRate, "id" | "createdAt" | "updatedAt">[],
  ): Promise<void> {
    await prisma.$transaction([
      prisma.currencyRate.deleteMany(),
      prisma.currencyRate.createMany({ data: rates }),
    ]);

    await cacheService.delete(CacheKeys.config.currencyRates());
  }

  async getSystemConfig(key: string): Promise<any> {
    return cacheService.getOrSet(
      CacheKeys.config.system(key),
      async () => {
        const config = await prisma.systemConfig.findUnique({
          where: { key },
        });
        return config?.value;
      },
      CacheTTL.day,
    );
  }

  async setSystemConfig(key: string, value: any): Promise<void> {
    await prisma.systemConfig.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });

    await cacheService.delete(CacheKeys.config.system(key));
  }

  async deleteSystemConfig(key: string): Promise<void> {
    await prisma.systemConfig.delete({ where: { key } });
    await cacheService.delete(CacheKeys.config.system(key));
  }

  async getDefaultCurrency(): Promise<string> {
    return cacheService.getOrSet(
      CacheKeys.config.defaultCurrency(),
      async () => {
        const config = await prisma.systemConfig.findUnique({
          where: { key: "defaultCurrency" },
        });
        return (config?.value as string) || "NPR";
      },
      CacheTTL.day,
    );
  }

  async setDefaultCurrency(currency: string): Promise<void> {
    await this.setSystemConfig("defaultCurrency", currency);
    await cacheService.delete(CacheKeys.config.defaultCurrency());
  }
}

export const configurationRepository = new ConfigurationRepository();
