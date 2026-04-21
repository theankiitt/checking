import ProductSliderClient from "./ProductSliderClient";
import ProductSliderSkeleton from "./ProductSliderSkeleton";
import type { Product, SliderSection } from "./types";

async function fetchProductsByType(
  type: "featured" | "bestSeller" | "new" | "onSale",
  limit = 8,
): Promise<Product[]> {
  try {
    const apiBaseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4444";
    let endpoint = "";

    switch (type) {
      case "featured":
        endpoint = `${apiBaseUrl}/api/v1/products/featured?limit=${limit}`;
        break;
      case "bestSeller":
        endpoint = `${apiBaseUrl}/api/v1/products/best-sellers?limit=${limit}`;
        break;
      case "new":
        endpoint = `${apiBaseUrl}/api/v1/products/new-arrivals?limit=${limit}`;
        break;
      case "onSale":
        endpoint = `${apiBaseUrl}/api/v1/products/on-sale?limit=${limit}`;
        break;
    }

    const response = await fetch(endpoint, {
      next: { revalidate: 300 },
    });

    if (response.ok) {
      const data = await response.json();
      const products = data.data?.products || data.data?.sliders || [];

      return products.map((product: any) => ({
        ...product,
        image:
          product.image ||
          product.thumbnail ||
          (product.images?.[0] ? `${apiBaseUrl}${product.images[0]}` : null),
      }));
    }
  } catch (error) {
    return [];
  }

  return [];
}

async function fetchCategories(limit = 6): Promise<Product[]> {
  try {
    const apiBaseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4444";
    const response = await fetch(
      `${apiBaseUrl}/api/v1/categories?limit=${limit}&isActive=true`,
      { next: { revalidate: 600 } },
    );

    if (response.ok) {
      const data = await response.json();
      return data.data?.categories || [];
    }
  } catch (error) {
    return [];
  }

  return [];
}

export default async function ProductSlider() {
  const [featuredProducts, bestSellers, newArrivals, onSale, categories] =
    await Promise.all([
      fetchProductsByType("featured", 8),
      fetchProductsByType("bestSeller", 8),
      fetchProductsByType("new", 8),
      fetchProductsByType("onSale", 8),
      fetchCategories(6),
    ]);

  const sections: SliderSection[] = [];

  if (featuredProducts.length > 0) {
    sections.push({
      id: "featured",
      title: "Featured Products",
      subtitle: "Hand-picked just for you",
      products: featuredProducts,
    });
  }

  if (bestSellers.length > 0) {
    sections.push({
      id: "best-sellers",
      title: "Best Sellers",
      subtitle: "Most loved by customers",
      products: bestSellers,
    });
  }

  if (newArrivals.length > 0) {
    sections.push({
      id: "new-arrivals",
      title: "New Arrivals",
      subtitle: "Fresh from our collection",
      products: newArrivals,
    });
  }

  if (onSale.length > 0) {
    sections.push({
      id: "on-sale",
      title: "On Sale",
      subtitle: "Limited time offers",
      products: onSale,
    });
  }

  if (categories.length > 0) {
    sections.push({
      id: "categories",
      title: "Shop by Category",
      subtitle: "Explore our collections",
      products: categories,
    });
  }

  if (!sections.length) {
    return <ProductSliderSkeleton />;
  }

  return <ProductSliderClient sections={sections} />;
}
