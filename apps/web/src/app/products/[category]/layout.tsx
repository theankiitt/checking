import type { Metadata } from "next";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4444";

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  const baseSlug = category?.split("-")[0] || category || "";
  const title = baseSlug.charAt(0).toUpperCase() + baseSlug.slice(1).replace(/-./g, m => m[1].toUpperCase());

  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/categories?includeInactive=false`, { next: { revalidate: 3600 } });
    const data = await res.json();

    if (data.success && data.data?.categories) {
      for (const cat of data.data.categories) {
        const catBase = cat.slug?.split("-")[0] || "";
        if (catBase === baseSlug || cat.slug === category) {
          return {
            title: `${cat.name} | GharSamma`,
            description: cat.description || `Shop authentic Nepali ${cat.name.toLowerCase()} products at GharSamma. Quality traditional items delivered worldwide.`,
            openGraph: {
              title: `${cat.name} | GharSamma`,
              description: cat.description || `Shop authentic Nepali ${cat.name.toLowerCase()} products at GharSamma.`,
              type: "website",
            },
          };
        }
      }
    }
  } catch {
    // Fallback to default
  }

  return {
    title: `${title} | GharSamma`,
    description: `Shop authentic Nepali ${baseSlug.toLowerCase()} products at GharSamma. Quality traditional items delivered worldwide.`,
  };
}

export default function CategoryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
