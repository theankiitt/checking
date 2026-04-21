import { Suspense } from "react";
import CategoryShowcaseBannerClient from "./CategoryShowcaseBannerClient";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4444";

interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  internalLink: string | null;
  children: Category[];
}

interface CategoryItem {
  id: string;
  title: string;
  image: string;
  link: string;
}

const FALLBACK_CATEGORIES: CategoryItem[] = [
  {
    id: "1",
    title: "Foods",
    image: "/achar-layout.webp",
    link: "/products/foods",
  },
  {
    id: "2",
    title: "Dress",
    image: "/sari-layout.webp",
    link: "/products/dress",
  },
  {
    id: "3",
    title: "Statues",
    image: "/statue-layout.webp",
    link: "/products/statues",
  },
  {
    id: "4",
    title: "Carpets",
    image: "/carpet-layout.webp",
    link: "/products/carpets",
  },
];

function CategoryShowcaseBannerSkeleton() {
  return (
    <div className="w-full bg-white py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="grid grid-cols-2 md:grid-cols-3 gap-4"
          style={{ height: "600px" }}
        >
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-gray-200 animate-pulse rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

async function getCategories(): Promise<CategoryItem[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/categories?active=true`,
      {
        next: { revalidate: 300 },
      },
    );

    if (!response.ok) {
      return FALLBACK_CATEGORIES;
    }

    const data = await response.json();

    if (!data.success || !data.data?.categories?.length) {
      return FALLBACK_CATEGORIES;
    }

    const categories: CategoryItem[] = [];

    data.data.categories.forEach((cat: Category) => {
      if (cat.children && cat.children.length > 0) {
        cat.children.slice(0, 2).forEach((child: Category) => {
          categories.push({
            id: child.id,
            title: child.name,
            image: child.image || cat.image || "/achar-layout.webp",
            link: child.internalLink || `/products/${cat.slug}/${child.slug}`,
          });
        });
      } else {
        categories.push({
          id: cat.id,
          title: cat.name,
          image: cat.image || "/achar-layout.webp",
          link: cat.internalLink || `/products/${cat.slug}`,
        });
      }
    });

    return categories.length > 0 ? categories.slice(0, 6) : FALLBACK_CATEGORIES;
  } catch (error) {
    return FALLBACK_CATEGORIES;
  }
}

export default async function CategoryShowcaseBanner({
  title,
}: {
  title?: string;
}) {
  const categories = await getCategories();

  return (
    <Suspense fallback={<CategoryShowcaseBannerSkeleton />}>
      <CategoryShowcaseBannerClient categories={categories} title={title} />
    </Suspense>
  );
}
