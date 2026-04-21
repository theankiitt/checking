import { MetadataRoute } from "next";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4444";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://gharsamma.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "daily" as const, priority: 1 },
    { url: `${SITE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${SITE_URL}/contact`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
  ];

  let categoryRoutes: MetadataRoute.Sitemap = [];

  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/categories?includeInactive=false`, {
      next: { revalidate: 3600 },
    });
    const data = await res.json();

    if (data.success && data.data?.categories) {
      categoryRoutes = data.data.categories.map((cat: any) => ({
        url: `${SITE_URL}/products/${cat.slug.split("-")[0]}`,
        lastModified: new Date(cat.updatedAt || cat.createdAt),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }));
    }
  } catch {
    // Fallback to empty
  }

  return [...staticRoutes, ...categoryRoutes];
}
