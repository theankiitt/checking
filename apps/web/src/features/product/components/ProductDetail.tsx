"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Star,
  Share2,
  Minus,
  Plus,
  CheckCircle,
  MapPin,
  Package,
  DollarSign,
  Info,
} from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import ProductReviews from "./ProductReviews";
import ProductQuestions from "./ProductQuestions";
import ProductTabs from "./ProductTabs";
import DeliveryOptions from "./DeliveryOptions";
import { useLocation } from "@/contexts/LocationContext";
import { getProductById, getRelatedProducts } from "@/services";
import {
  formatPrice,
  calculateDiscountPercentage,
  getEtaDate,
} from "@/lib/utils";
import type { Product, Review } from "@/shared/types";
import {
  DELIVERY_OPTIONS,
  DELIVERY_COUNTRIES,
  DELIVERY_METHODS,
} from "@/lib/constants";

interface ProductDetailProps {
  productId: string;
}

export default function ProductDetail({ productId }: ProductDetailProps) {
  const router = useRouter();
  const { selectedCountry, selectedCity } = useLocation();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [hoveredImage, setHoveredImage] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [deliveryCountry, setDeliveryCountry] =
    useState<(typeof DELIVERY_COUNTRIES)[number]>("USA");
  const [deliveryMethod, setDeliveryMethod] =
    useState<(typeof DELIVERY_METHODS)[number]>("standard");
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [categoryDetails, setCategoryDetails] = useState<any>(null);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const productData = await getProductById(productId);

        if (productData) {
          setProduct(productData);
        }
      } catch (error) {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const related = await getRelatedProducts(productId, 6);
        setRelatedProducts(
          related.filter((p) => p.id !== productId).slice(0, 3),
        );
      } catch (error) {
      }
    };

    if (productId) {
      fetchRelated();
    }
  }, [productId, selectedCountry]);

  const selectedDelivery = useMemo(() => {
    return DELIVERY_OPTIONS[deliveryCountry]?.[deliveryMethod];
  }, [deliveryCountry, deliveryMethod]);

  const etaDate = useMemo(() => {
    return getEtaDate(selectedDelivery?.days || 0);
  }, [selectedDelivery]);

  const discount = useMemo(() => {
    if (!product?.comparePrice) return 0;
    return calculateDiscountPercentage(product.comparePrice, product.price);
  }, [product]);

  const colors = useMemo(() => {
    if (!product?.variants) return [];
    return Array.from(
      new Set(
        product.variants.filter((v) => v.name === "Color").map((v) => v.value),
      ),
    );
  }, [product]);

  const sizes = useMemo(() => {
    if (!product?.variants) return [];
    return Array.from(
      new Set(
        product.variants.filter((v) => v.name === "Size").map((v) => v.value),
      ),
    );
  }, [product]);

  const handleQuantityChange = useCallback((change: number) => {
    setQuantity((prev) => Math.max(1, prev + change));
  }, []);

  const handleAddToCart = useCallback(() => {
  }, [product, quantity]);

  const handleBuyNow = useCallback(() => {
    if (!product) return;
    router.push(`/checkout?product=${product.id}&quantity=${quantity}`);
  }, [product, quantity, router]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Product not found
          </h2>
          <button
            onClick={() => router.back()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center space-x-2 text-lg text-black mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center space-x-1 hover:text-blue-600"
        >
          ←<span>Back</span>
        </button>
        <span>/</span>
        <span className="capitalize">
          {product.category?.name || "Product"}
        </span>
        <span>/</span>
        <span className="text-gray-900">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        <div className="lg:col-span-5">
          <ImageGallery
            images={product.images}
            productName={product.name}
            selectedImage={selectedImage}
            hoveredImage={hoveredImage}
            onSelectImage={setSelectedImage}
            onHoverImage={setHoveredImage}
            isZoomed={isZoomed}
            mousePosition={mousePosition}
            onMouseMove={handleMouseMove}
            onZoomToggle={() => setIsZoomed(!isZoomed)}
            onCloseZoom={() => setIsZoomed(false)}
          />
        </div>

        <div className="lg:col-span-4 space-y-3 mt-5">
          <ProductInfo
            product={product}
            discount={discount}
            quantity={quantity}
            colors={colors}
            sizes={sizes}
            selectedColor={selectedColor}
            selectedSize={selectedSize}
            onColorSelect={setSelectedColor}
            onSizeSelect={setSelectedSize}
            onQuantityChange={handleQuantityChange}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
          />
        </div>

        <div className="lg:col-span-3">
          <DeliveryOptions
            deliveryCountry={deliveryCountry}
            deliveryMethod={deliveryMethod}
            selectedCity={selectedCity}
            selectedCountry={selectedCountry}
            selectedDelivery={selectedDelivery}
            etaDate={etaDate}
            onChangeCountry={setDeliveryCountry}
            onChangeMethod={setDeliveryMethod}
            onOpenModal={() => setShowDeliveryModal(true)}
          />
        </div>
      </div>

      <ProductTabs
        product={product}
        categoryDetails={categoryDetails}
        isDescriptionExpanded={isDescriptionExpanded}
        onToggleDescription={() =>
          setIsDescriptionExpanded(!isDescriptionExpanded)
        }
      />

      <ProductReviews
        productId={product.id}
        reviews={reviews}
        averageRating={product.averageRating ?? 0}
        reviewCount={product.reviewCount ?? 0}
        setReviews={setReviews}
        setProduct={setProduct}
      />

      <ProductQuestions productId={product.id} />
    </div>
  );
}

function ImageGallery({
  images,
  productName,
  selectedImage,
  hoveredImage,
  onSelectImage,
  onHoverImage,
  isZoomed,
  mousePosition,
  onMouseMove,
  onZoomToggle,
  onCloseZoom,
}: any) {
  return (
    <>
      <div className="flex flex-row md:flex-col gap-2 mb-4">
        {images.map((image: string, index: number) => (
          <button
            key={index}
            onClick={() => onSelectImage(index)}
            onMouseEnter={() => onHoverImage(index)}
            onMouseLeave={() => onHoverImage(null)}
            className={`aspect-square w-20 rounded-lg overflow-hidden border-2 transition-all duration-200 hover:scale-105 ${
              selectedImage === index
                ? "border-blue-600 ring-2 ring-blue-200"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <img
              src={image}
              alt={`${productName} ${index + 1}`}
              className="w-full h-full object-contain"
            />
          </button>
        ))}
      </div>

      <div
        className="relative aspect-square rounded-lg overflow-hidden shadow-lg cursor-zoom-in"
        onMouseMove={onMouseMove}
        onClick={onZoomToggle}
      >
        <img
          src={images[hoveredImage !== null ? hoveredImage : selectedImage]}
          alt={productName}
          className="w-full h-full object-cover"
        />
      </div>

      {isZoomed && (
        <div
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-[90vw] h-[90vw] max-w-[800px] max-h-[800px] rounded-xl overflow-hidden shadow-2xl border-2 border-gray-300 bg-white"
          onClick={onCloseZoom}
        >
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `url(${images[hoveredImage !== null ? hoveredImage : selectedImage]})`,
              backgroundSize: "250%",
              backgroundPosition: `${mousePosition.x}% ${mousePosition.y}%`,
              backgroundRepeat: "no-repeat",
            }}
          />
        </div>
      )}
    </>
  );
}

function ProductInfo({
  product,
  discount,
  quantity,
  colors,
  sizes,
  selectedColor,
  selectedSize,
  onColorSelect,
  onSizeSelect,
  onQuantityChange,
  onAddToCart,
  onBuyNow,
}: any) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg text-[#EB6426] underline">{product.slug}</h3>
        <h1 className="text-2xl font-semibold font-bricolage text-gray-900 mt-2">
          {product.name}
        </h1>
      </div>

      <div className="flex items-center space-x-2">
        <div className="flex text-yellow-400">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-3 h-3 ${i < Math.floor(product.averageRating) ? "fill-current" : ""}`}
            />
          ))}
        </div>
        <span className="text-sm text-gray-600">
          ({product.averageRating}) | {product.reviewCount} reviews
        </span>
      </div>

      <div className="space-y-5 py-4 font-bricolage border-t border-b border-gray-300">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-3">
              <span className="text-4xl font-bold text-[#EB6426]">
                {formatPrice(product.price)}
              </span>
              {product.comparePrice && (
                <span className="text-xl text-gray-400 line-through">
                  {formatPrice(product.comparePrice)}
                </span>
              )}
            </div>
            <p className="text-sm text-black mt-2">Inclusive of all taxes</p>
          </div>
          {discount > 0 && (
            <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm font-medium mb-2">
              {discount}% OFF
            </span>
          )}
        </div>
      </div>

      {colors.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Color:{" "}
            <span className="text-gray-600 font-normal">
              {selectedColor || "Select Color"}
            </span>
          </label>
          <div className="flex flex-wrap gap-2">
            {colors.map((color: string) => (
              <button
                key={color}
                type="button"
                onClick={() => onColorSelect(color)}
                className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                  selectedColor === color
                    ? "border-[#0077b6] text-[#0077b6] bg-blue-50"
                    : "border-gray-300 text-gray-700 hover:border-gray-400"
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}

      {sizes.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Size:{" "}
            <span className="text-gray-600 font-normal">
              {selectedSize || "Select Size"}
            </span>
          </label>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size: string) => (
              <button
                key={size}
                type="button"
                onClick={() => onSizeSelect(size)}
                className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                  selectedSize === size
                    ? "border-[#0077b6] text-[#0077b6] bg-blue-50"
                    : "border-gray-300 text-gray-700 hover:border-gray-400"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <label className="block text-base font-medium text-gray-900 mb-2">
          Quantity
        </label>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => onQuantityChange(-1)}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-black"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-16 text-center font-medium text-black">
            {quantity}
          </span>
          <button
            onClick={() => onQuantityChange(1)}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-black"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex space-x-3">
        <button
          onClick={onAddToCart}
          className="flex-1 bg-[#EB6426] text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
        >
          Add to Cart
        </button>
        <button
          onClick={onBuyNow}
          disabled={product.quantity === 0}
          className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {product.quantity === 0 ? "Out of Stock" : "Buy Now"}
        </button>
      </div>

      <div
        className={`flex items-center space-x-2 ${product.quantity > 0 ? "text-green-600" : "text-red-600"}`}
      >
        <CheckCircle className="w-5 h-5" />
        <span className="font-medium">
          {product.quantity > 0
            ? `In Stock (${product.quantity} available)`
            : "Currently unavailable"}
        </span>
      </div>
    </div>
  );
}
