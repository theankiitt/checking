"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronRight, Shield, Truck, ArrowLeft } from "lucide-react";
import Link from "next/link";

import { Product, Review, CustomField } from "../types";
import { MOCK_FAQS } from "../data/mockData";
import ProductImageGallery from "./ProductImageGallery";
import ProductInfo from "./ProductInfo";
import DeliveryOptions from "./DeliveryOptions";
import ProductTabs from "./ProductTabs";
import FAQSection from "./FAQSection";
import ReviewsSection from "./ReviewsSection";
import RelatedProducts from "./RelatedProducts";
import ProductDetailSkeleton from "./ProductDetailSkeleton";
import { useLocation } from "@/contexts/LocationContext";
import { manrope } from "@/app/fonts";

interface ProductDetailProps {
  productId?: string;
  productSlug?: string;
  category: string;
}

interface ApiProduct {
  id: string;
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  price: number | string;
  comparePrice?: number | string | null;
  image?: string;
  images?: string[];
  brand?: { name: string } | null;
  averageRating?: number;
  reviewCount?: number;
  category: { slug: string; name: string };
  variants?: { name: string; value: string; stock: number }[];
  specifications?: { key: string; value: string }[];
  tags?: string[];
}

interface ApiReview {
  id: string;
  rating: number;
  comment: string;
  user: { name: string };
  createdAt: string;
}

function mapApiProductToProduct(apiProduct: ApiProduct): Product {
  return {
    id: apiProduct.id,
    name: apiProduct.name,
    slug: apiProduct.slug,
    description: apiProduct.description || apiProduct.shortDescription || "",
    shortDescription: apiProduct.shortDescription || "",
    price: Number(apiProduct.price) || 0,
    comparePrice: apiProduct.comparePrice
      ? Number(apiProduct.comparePrice)
      : undefined,
    image: apiProduct.image || "/image.png",
    images:
      apiProduct.images && apiProduct.images.length > 0
        ? apiProduct.images
        : [apiProduct.image || "/image.png"],
    averageRating: apiProduct.averageRating || 0,
    reviewCount: apiProduct.reviewCount || 0,
    category: {
      id: apiProduct.id,
      slug: apiProduct.category?.slug || "",
      name: apiProduct.category?.name || "",
    },
    brand: apiProduct.brand
      ? {
          id: apiProduct.id,
          name: apiProduct.brand.name || "",
        }
      : undefined,
    quantity: 1,
    variants:
      apiProduct.variants?.map((v, idx) => ({
        id: String(idx),
        name: v.name,
        value: v.value,
        price: 0,
        quantity: v.stock,
      })) || [],
  };
}

export default function ProductDetail({
  productId,
  productSlug,
  category,
}: ProductDetailProps) {
  const { selectedCountry } = useLocation();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [popularProducts, setPopularProducts] = useState<Product[]>([]);
  const [latestProducts, setLatestProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [deliveryCountry, setDeliveryCountry] = useState<
    "USA" | "UK" | "Canada" | "Australia"
  >("USA");


  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:4444";

        const productRes = await fetch(
          `${apiUrl}/api/v1/products/${productSlug || productId}?country=${selectedCountry || "USA"}`,
        );
        const productData = await productRes.json();

        let currentProduct: Product | null = null;

        if (productData.success && productData.data) {
          currentProduct = mapApiProductToProduct(productData.data);
          setProduct(currentProduct);
        } else {
          setError("Product not found");
          const latestRes = await fetch(
            `${apiUrl}/api/v1/products?limit=8&country=${selectedCountry || "USA"}`,
          );
          const latestData = await latestRes.json();
          if (latestData.success) {
            setLatestProducts(
              (latestData.data.products || [])
                .slice(0, 8)
                .map(mapApiProductToProduct),
            );
          }
          setLoading(false);
          return;
        }

        const [reviewsRes, relatedRes, popularRes] = await Promise.all([
          fetch(
            `${apiUrl}/api/v1/products/${productSlug || productId}/reviews?limit=10`,
          ),
          // Use product's actual category slug if available, fallback to URL param
          fetch(
            `${apiUrl}/api/v1/products?categorySlug=${currentProduct?.category?.slug || category}&limit=8&country=${selectedCountry || "USA"}`,
          ),
          fetch(
            `${apiUrl}/api/v1/products?limit=8&country=${selectedCountry || "USA"}`,
          ),
        ]);

        const [reviewsData, relatedData, popularData] = await Promise.all([
          reviewsRes.json(),
          relatedRes.json(),
          popularRes.json(),
        ]);

        // Helper to safely extract products array from API response
        const extractProducts = (res: any) => {
          if (!res.success) return [];
          if (Array.isArray(res.data)) return res.data;
          if (res.data?.products && Array.isArray(res.data.products)) return res.data.products;
          return [];
        };

        if (reviewsData.success) {
          setReviews(
            reviewsData.data.reviews?.map((r: ApiReview) => ({
              id: r.id,
              userName: r.user?.name || "Anonymous",
              rating: r.rating,
              comment: r.comment,
              date: r.createdAt,
              verified: false,
            })) || [],
          );
        }

        const relatedProductsList = extractProducts(relatedData)
          .filter((p: ApiProduct) => p.slug !== productSlug)
          .slice(0, 5)
          .map(mapApiProductToProduct);
        setRelatedProducts(relatedProductsList);

        const popularProductsList = extractProducts(popularData)
          .filter((p: ApiProduct) => p.slug !== productSlug)
          .slice(0, 5)
          .map(mapApiProductToProduct);
        setPopularProducts(popularProductsList);
        
        // Fetch latest products as fallback if related/popular are empty
        if (relatedProductsList.length === 0 || popularProductsList.length === 0) {
           const latestRes = await fetch(
            `${apiUrl}/api/v1/products?limit=10&country=${selectedCountry || "USA"}`,
          );
          const latestData = await latestRes.json();
          if (latestData.success) {
             const latestList = extractProducts(latestData)
               .filter((p: ApiProduct) => p.slug !== productSlug)
               .slice(0, 5)
               .map(mapApiProductToProduct);
             setLatestProducts(latestList);
          }
        }

        setCustomFields([]);
      } catch (err) {
        
        setError("Failed to load product. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (productSlug || productId) {
      fetchProductData();
    }
  }, [productSlug, productId, category, selectedCountry]);

  if (loading) {
    return <ProductDetailSkeleton />;
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto px-4"
        >
          <div className="w-20 h-20 mx-auto mb-6 bg-gray-200 rounded-2xl flex items-center justify-center">
            <svg
              className="w-10 h-10 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 2a10 10 0 110 20 10 10 0 010-20z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Product Not Found
          </h2>
          <p className="text-gray-500 mb-8">
            {error || "This product is no longer available."}
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-medium hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          {latestProducts.length > 0 && (
            <div className="mt-16">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 text-left">
                You might also like
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {latestProducts.slice(0, 4).map((p) => (
                  <Link
                    key={p.id}
                    href={`/products/${(p.category?.slug || "uncategorized").split("-")[0]}/${p.slug}`}
                    className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="aspect-square bg-gray-100">
                      <img
                        src={p.image || p.images?.[0] || "/image.png"}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-medium text-gray-900 line-clamp-1">
                        {p.name}
                      </p>
                      <p className="text-sm font-semibold text-orange-600 mt-1">
                        ${(Number(p.price) || 0).toFixed(2)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    );
  }

  const discount = product.comparePrice
    ? Math.round(
        ((Number(product.comparePrice) - Number(product.price)) /
          Number(product.comparePrice)) *
          100,
      )
    : 0;

  return (
    <div className="bg-white tracking-tight">
      {/* Breadcrumb Navigation */}
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4 pt-2 ${manrope.className} `}>
        <nav className="flex items-center gap-2 text-md font-medium text-black bg-gray-100 px-4 py-2 rounded-md">
          <Link href="/" className="hover:text-orange-600 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link
            href={`/products/${product.category?.slug || category}`}
            className="capitalize hover:text-orange-600 transition-colors"
          >
            {product.category?.name || category}
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium line-clamp-1">
            {product.name}
          </span>
        </nav>
      </div>

      {/* Main Product Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-16 pb-24">
        {/* Top Grid: Images + Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
          {/* Left: Image Gallery */}
          <div className="lg:sticky lg:top-4 lg:self-start">
            <ProductImageGallery
              images={product.images}
              productName={product.name}
            />
          </div>

          {/* Right: Product Info + Delivery */}
          <div className="space-y-6">
            {/* Product Info Card */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 lg:p-8 shadow-sm">
              {discount > 0 && (
                <span className="inline-block px-3 py-1 bg-red-100 text-red-600 text-sm font-semibold rounded-full mb-4">
                  {discount}% OFF
                </span>
              )}

              <ProductInfo
                product={product}
                selectedColor={selectedColor}
                setSelectedColor={setSelectedColor}
                selectedSize={selectedSize}
                setSelectedSize={setSelectedSize}
              />
            </div>

            {/* Delivery Options Card */}
            <div className="bg-gray-100 rounded-lg border border-gray-200 p-6 lg:p-8">
              <div className="flex items-center gap-2 mb-4">
                <Truck className="w-5 h-5 text-orange-600" />
                <h3 className={`${manrope.className} text-lg font-semibold text-gray-900`}>
                  Shipping & Delivery
                </h3>
              </div>
              <DeliveryOptions
                country={deliveryCountry}
                setCountry={setDeliveryCountry}
              />
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center text-center p-3 bg-gray-50 rounded-xl border border-gray-200">
                <Shield className="w-5 h-5 text-orange-600 mb-2" />
                <span className="text-xs font-medium text-gray-700">
                  Secure Checkout
                </span>
              </div>
              <div className="flex flex-col items-center text-center p-3 bg-gray-50 rounded-xl border border-gray-200">
                <Truck className="w-5 h-5 text-orange-600 mb-2" />
                <span className="text-xs font-medium text-gray-700">
                  Fast Delivery
                </span>
              </div>
              <div className="flex flex-col items-center text-center p-3 bg-gray-50 rounded-xl border border-gray-200">
                <svg
                  className="w-5 h-5 text-orange-600 mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <span className="text-xs font-medium text-gray-700">
                  Easy Returns
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Full Width Sections */}
        <div className="space-y-12">
          {/* Tabs Section */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <ProductTabs product={product} customFields={customFields} />
          </div>

          {/* Reviews Section */}
          <div className="p-6 lg:p-8 ">
            <ReviewsSection
              reviews={reviews}
              averageRating={product.averageRating}
              reviewCount={product.reviewCount}
            />
          </div>

          {/* FAQ Section */}
          <div className="p-6 lg:p-8">
            <FAQSection faqs={MOCK_FAQS} />
          </div>

          {/* Related Products */}
          <div className="pt-8">
            <RelatedProducts
              // Fallback to latest products if specific related products are empty
              products={relatedProducts.length > 0 ? relatedProducts : latestProducts}
              // Fallback to latest products if specific popular products are empty
              popularProducts={popularProducts.length > 0 ? popularProducts : latestProducts}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
