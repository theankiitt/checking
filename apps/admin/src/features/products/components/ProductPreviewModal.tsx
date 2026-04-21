"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Package, EyeOff } from "lucide-react";
import { Product } from "@/shared/types";

// Helper to get correct image URL
const getProductImageUrl = (imagePath: string | undefined): string => {
  if (!imagePath) return "";
  if (imagePath.startsWith("data:")) return imagePath;
  if (imagePath.startsWith("blob:")) return imagePath;
  if (imagePath.startsWith("http")) return imagePath;
  if (imagePath.startsWith("/uploads/")) {
    return `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4444"}${imagePath}`;
  }
  return imagePath;
};

interface ProductPreviewModalProps {
  product: Product | null;
  onClose: () => void;
  onEdit: (product: Product) => void;
}

export default function ProductPreviewModal({
  product,
  onClose,
  onEdit,
}: ProductPreviewModalProps) {
  if (!product) return null;

  const price = Number(product.price) || 0;
  const comparePrice = Number(product.comparePrice) || 0;
  const hasDiscount = comparePrice > price && comparePrice > 0;
  const discountPercent = hasDiscount
    ? Math.round(((comparePrice - price) / comparePrice) * 100)
    : 0;

  // State for selected image
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const allImages = product.images || [];
  const mainImage = allImages[selectedImageIndex] || allImages[0];

  const handleThumbnailClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 overflow-y-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <div className="flex min-h-screen items-center justify-center p-4">
          <motion.div
            className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Product Preview
              </h2>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <EyeOff className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <div className="space-y-4">
                    <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                      {mainImage ? (
                        <img
                          src={getProductImageUrl(mainImage)}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-16 h-16 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {allImages.length > 1 && (
                      <div className="flex space-x-2 overflow-x-auto pb-2">
                        {allImages.map((image, index) => (
                          <button
                            key={index}
                            onClick={() => handleThumbnailClick(index)}
                            className={`w-20 h-20 rounded-lg object-cover flex-shrink-0 cursor-pointer border-2 transition-all hover:opacity-75 ${
                              selectedImageIndex === index
                                ? 'border-orange-500 ring-2 ring-orange-200'
                                : 'border-transparent'
                            }`}
                          >
                            <img
                              src={getProductImageUrl(image)}
                              alt={`${product.name} ${index + 1}`}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {product.name || "N/A"}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {product.description || "No description available"}
                    </p>

                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>SKU: {product.sku || "N/A"}</span>
                      <span>•</span>
                      <span>
                        Category:{" "}
                        {typeof product.category === "string"
                          ? product.category
                          : product.category?.name || "N/A"}
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-baseline space-x-3">
                      <span className="text-3xl font-bold text-gray-900">
                        ${price.toFixed(2)}
                      </span>
                      {hasDiscount && (
                        <span className="text-lg text-gray-500 line-through">
                          ${comparePrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                    {hasDiscount && (
                      <div className="mt-2">
                        <span className="inline-flex px-2 py-1 bg-red-100 text-red-600 text-sm font-medium rounded">
                          {discountPercent}% OFF
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-sm text-gray-500 mb-1">
                        Stock Quantity
                      </div>
                      <div className="text-xl font-semibold text-gray-900">
                        {product.stock}
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-sm text-gray-500 mb-1">Status</div>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            product.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {product.isActive ? "Active" : "Inactive"}
                        </span>
                        {product.isFeatured && (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            Featured
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {product.tags && product.tags.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">
                        Tags
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {product.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      Physical Details
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Weight:</span>
                        <span className="ml-2 font-medium">
                          {product.weight} kg
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Dimensions:</span>
                        <span className="ml-2 font-medium">
                          {product.dimensions?.length || 0} ×{" "}
                          {product.dimensions?.width || 0} ×{" "}
                          {product.dimensions?.height || 0} cm
                        </span>
                      </div>
                    </div>
                  </div>

                  {product.seo && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">
                        SEO Information
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-gray-500">Title:</span>
                          <span className="ml-2">
                            {product.seo.title || "N/A"}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Description:</span>
                          <span className="ml-2">
                            {product.seo.description || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onClose();
                  onEdit(product);
                }}
                className="px-4 py-2 text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors"
              >
                Edit Product
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

