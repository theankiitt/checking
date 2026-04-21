import { Suspense } from "react";
import CategoryClient from "./CategoryClient";
import { Product } from "@/shared/types";

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  children?: Category[];
  _count?: { products: number };
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4444";

async function fetchCategoryData(categorySlug: string) {
  try {
    const categoriesRes = await fetch(`${API_BASE_URL}/api/v1/categories?includeInactive=false`, {
      next: { revalidate: 3600 },
    });
    const categoriesData = await categoriesRes.json();

    if (categoriesData.success && categoriesData.data?.categories) {
      const categories = categoriesData.data.categories;
      const baseSlug = categorySlug?.split("-")[0] || "";
      let foundCategory: Category | null = null;

      for (const cat of categories) {
        const catBaseSlug = cat.slug?.split("-")[0] || "";
        if (catBaseSlug === baseSlug || cat.slug === categorySlug) {
          foundCategory = cat;
          break;
        }
      }

      if (foundCategory) {
        const productsRes = await fetch(`${API_BASE_URL}/api/v1/products?categorySlug=${foundCategory.slug}&limit=50`, {
          next: { revalidate: 300 },
        });
        const productsData = await productsRes.json();

        const products: Product[] = productsData.success
          ? productsData.data?.products || productsData.data?.items || productsData.data || []
          : [];

        const otherCategories = categories
          .filter((cat: Category) => cat.slug !== foundCategory?.slug)
          .slice(0, 3);

        const otherProductsPromises = otherCategories.map(async (cat: Category) => {
          const res = await fetch(`${API_BASE_URL}/api/v1/products?categorySlug=${cat.slug}&limit=8`, {
            next: { revalidate: 300 },
          });
          const data = await res.json();
          return {
            category: cat,
            products: data.success ? data.data?.products || data.data?.items || data.data || [] : [],
          };
        });

        const otherProducts = await Promise.all(otherProductsPromises);

        const subcategoryProducts: { category: Category; products: Product[] }[] = [];
        if (foundCategory.children && foundCategory.children.length > 0) {
          const subPromises = foundCategory.children.map(async (sub: Category) => {
            const res = await fetch(`${API_BASE_URL}/api/v1/products?subCategorySlug=${sub.slug}&categorySlug=${foundCategory!.slug}&limit=20`, {
              next: { revalidate: 300 },
            });
            const data = await res.json();
            return {
              category: sub,
              products: data.success ? data.data?.products || data.data?.items || data.data || [] : [],
            };
          });
          const subResults = await Promise.all(subPromises);
          subcategoryProducts.push(...subResults);
        }

        return { category: foundCategory, products, otherProducts, subcategoryProducts };
      }
    }
  } catch (error) {
  }

  return { category: null, products: [], otherProducts: [], subcategoryProducts: [] };
}

export default async function CategoryServer({ categorySlug }: { categorySlug: string }) {
  const { category, products, otherProducts, subcategoryProducts } = await fetchCategoryData(categorySlug);

  return (
    <Suspense fallback={<CategorySkeleton />}>
      <CategoryClient
        category={category}
        initialProducts={products}
        categorySlug={categorySlug}
        otherProducts={otherProducts}
        subcategoryProducts={subcategoryProducts}
      />
    </Suspense>
  );
}

function CategorySkeleton() {
  return (
    <div className="bg-[#F0F2F5] min-h-screen">
      <div className="max-w-[88rem] mx-auto px-4 pt-8 pb-12">
        <div className="animate-pulse">
          <div className="h-12 bg-gray-300 rounded w-48 mb-8"></div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-12">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-48 bg-gray-300 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
