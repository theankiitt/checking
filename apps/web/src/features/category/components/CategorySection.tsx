import { Suspense } from "react";
import CategorySectionClient from "./CategorySectionClient";
import CategorySectionSkeleton from "./CategorySectionSkeleton";
import type { Category } from "@/types/category.types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4444";

async function getCategories(): Promise<Category[] | null> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/categories?active=true`,
      {
        cache: "no-store",
      },
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    if (!data.success || !data.data?.categories?.length) {
      return null;
    }

    const categories: Category[] = data.data.categories.map((cat: any) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      image: cat.image || "",
      isActive: cat.isActive ?? true,
      createdAt: cat.createdAt || new Date().toISOString(),
      children:
        cat.children?.map((child: any) => ({
          id: child.id,
          name: child.name,
          slug: child.slug,
          image: child.image || "",
          isActive: child.isActive ?? true,
          createdAt: child.createdAt || new Date().toISOString(),
        })) || [],
    }));

    return categories.length > 0 ? categories : null;
  } catch (error) {
    return null;
  }
}

export default async function CategorySection() {
  const categories = await getCategories();

  return (
    <Suspense fallback={<CategorySectionSkeleton />}>
      <CategorySectionClient categories={categories || []} />
    </Suspense>
  );
}
