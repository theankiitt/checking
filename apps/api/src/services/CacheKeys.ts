export const CacheKeys = {
  category: {
    all: (includeInactive = false) => `category:all:${includeInactive}`,
    byId: (id: string) => `category:${id}`,
    bySlug: (slug: string) => `category:slug:${slug}`,
    tree: (includeInactive = false) => `category:tree:${includeInactive}`,
    withCounts: () => `category:withCounts`,
  },

  product: {
    all: (page: number, limit: number, filter: string) =>
      `product:all:${page}:${limit}:${filter}`,
    byId: (id: string) => `product:${id}`,
    bySlug: (slug: string) => `product:slug:${slug}`,
    featured: (limit: number) => `product:featured:${limit}`,
    onSale: (limit: number) => `product:onSale:${limit}`,
    byCategory: (categoryId: string, limit: number) =>
      `product:category:${categoryId}:${limit}`,
    search: (query: string, limit: number) =>
      `product:search:${query}:${limit}`,
  },

  brand: {
    all: () => `brand:all`,
    byId: (id: string) => `brand:${id}`,
    byName: (name: string) => `brand:name:${name}`,
  },

  config: {
    navigation: () => `config:navigation`,
    siteSettings: () => `config:siteSettings`,
    currencyRates: () => `config:currencyRates`,
    defaultCurrency: () => `config:defaultCurrency`,
    system: (key: string) => `config:system:${key}`,
  },

  user: {
    byId: (id: string) => `user:${id}`,
    profile: (id: string) => `user:${id}:profile`,
  },

  stats: {
    products: () => `stats:products`,
    orders: () => `stats:orders`,
    revenue: () => `stats:revenue`,
  },
} as const;

export const CacheTTL = {
  short: 60,
  medium: 300,
  long: 600,
  veryLong: 3600,
  day: 86400,
} as const;

export const CachePatterns = {
  categories: "category:*",
  products: "product:*",
  brands: "brand:*",
  config: "config:*",
  users: "user:*",
} as const;
