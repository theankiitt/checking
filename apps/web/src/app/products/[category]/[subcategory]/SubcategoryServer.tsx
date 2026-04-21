import { Suspense } from "react";
import SubcategoryClient from "./SubcategoryClient";
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

async function fetchSubcategoryData(subcategorySlug: string, categorySlug: string) {
  try {
    // First, try to find as sub-sub-category (3rd level)
    const categoriesRes = await fetch(`${API_BASE_URL}/api/v1/categories?includeInactive=false`, {
      next: { revalidate: 3600 },
    });
    const categoriesData = await categoriesRes.json();

    let foundSubcategory: Category | null = null;
    let isSubSubCategory = false;

    if (categoriesData.success && categoriesData.data?.categories) {
      const categories = categoriesData.data.categories;
      for (const cat of categories) {
        if (cat.children) {
          for (const sub of cat.children) {
            if (sub.slug === subcategorySlug) {
              foundSubcategory = sub;
              break;
            }
            // Check sub-sub-categories (children of children)
            if (sub.children) {
              for (const subSub of sub.children) {
                if (subSub.slug === subcategorySlug) {
                  foundSubcategory = subSub;
                  isSubSubCategory = true;
                  break;
                }
              }
            }
            if (foundSubcategory) break;
          }
        }
        if (foundSubcategory) break;
      }
    }

    // Build API query params
    let productsUrl = `${API_BASE_URL}/api/v1/products?categorySlug=${categorySlug}&limit=50`;
    if (isSubSubCategory) {
      productsUrl += `&subSubCategorySlug=${subcategorySlug}`;
    } else if (foundSubcategory) {
      productsUrl += `&subCategorySlug=${subcategorySlug}`;
    }

    const productsRes = await fetch(productsUrl, {
      next: { revalidate: 300 },
    });
    const productsData = await productsRes.json();

    const products: Product[] = productsData.success
      ? productsData.data?.products || productsData.data?.items || productsData.data || []
      : [];

    return { subcategory: foundSubcategory, products, isSubSubCategory };
  } catch (error) {
  }

  return { subcategory: null, products: [], isSubSubCategory: false };
}

export default async function SubcategoryServer({ subcategorySlug, categorySlug }: { subcategorySlug: string; categorySlug: string }) {
  const { subcategory, products, isSubSubCategory } = await fetchSubcategoryData(subcategorySlug, categorySlug);

  return (
    <Suspense fallback={<SubcategorySkeleton />}>
      <SubcategoryClient
        subcategory={subcategory}
        initialProducts={products}
        subcategorySlug={subcategorySlug}
        categorySlug={categorySlug}
        isSubSubCategory={isSubSubCategory}
      />
    </Suspense>
  );
}

function SubcategorySkeleton() {
  return (
    <div className="bg-[#F0F2F5] min-h-screen">
      <div className="max-w-[88rem] mx-auto px-4 pt-8 pb-12">
        <div className="animate-pulse">
          <div className="h-12 bg-gray-300 rounded w-48 mb-8"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-64 bg-gray-300 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
