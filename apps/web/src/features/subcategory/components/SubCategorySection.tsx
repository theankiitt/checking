import { Suspense } from "react";
import SubCategorySectionClient from "./SubCategorySectionClient";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4444";

interface SubCategory {
  id: string;
  name: string;
  slug: string;
  image: string;
}

interface SubCategorySectionProps {
  categorySlug: string;
  title: string;
  subtitle: string;
}

function SubCategorySkeleton({ title }: { title: string }) {
  return (
    <div className="w-full bg-white py-8 md:py-12">
      <div className="max-w-[88rem] mx-auto px-4">
        <div className="h-10 w-64 bg-gray-200 animate-pulse rounded mb-2" />
        <div className="h-5 w-96 bg-gray-200 animate-pulse rounded mb-8" />
        <div className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="aspect-square bg-gray-200 animate-pulse rounded-xl"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

async function getSubCategories(parentSlug: string): Promise<SubCategory[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/categories?active=true`,
      {
        cache: "no-store",
      },
    );

    if (!response.ok) {
      return [];
    }

    const data = await response.json();

    if (!data.success || !data.data?.categories?.length) {
      return [];
    }

    const parentCategory = data.data.categories.find(
      (cat: any) => cat.slug === parentSlug,
    );

    if (parentCategory?.children && parentCategory.children.length > 0) {
      return parentCategory.children.map((child: any) => ({
        id: child.id,
        name: child.name,
        slug: child.slug,
        image: child.image ,
      }));
    }

    return [];
  } catch (error) {
    return [];
  }
}

export default async function SubCategorySection({
  categorySlug,
  title,
  subtitle,
}: SubCategorySectionProps) {
  const subCategories = await getSubCategories(categorySlug);

  return (
    <Suspense fallback={<SubCategorySkeleton title={title} />}>
      <SubCategorySectionClient
        title={title}
        subtitle={subtitle}
        subCategories={subCategories}
        categorySlug={categorySlug}
      />
    </Suspense>
  );
}
