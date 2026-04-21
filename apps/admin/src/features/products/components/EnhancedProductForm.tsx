"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Package,
  FileText,
  DollarSign,
  Camera,
  Search,
  Settings,
  X,
  CheckCircle,
} from "lucide-react";
import toast from "react-hot-toast";

import {
  IdentityTab,
  DetailsTab,
  PricingTab,
  MediaTab,
  SEOTab,
  SettingsTab,
} from "./tabs";
import { slugify, getInitialFormData } from "../utils";
import { ProductFormData, CurrencyPrice, PricingTier } from "../types/product";
import RichTextEditor from "@/components/RichTextEditor";

interface EnhancedProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProductFormData) => void;
  initialData?: Partial<ProductFormData>;
  isLoading?: boolean;
  categories?: Array<{
    id: string;
    name: string;
    slug: string;
    children?: Array<{ id: string; name: string; slug: string }>;
    _count?: { products: number };
  }>;
  onSuccess?: () => void;
}

export default function EnhancedProductForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
  categories = [],
  onSuccess,
}: EnhancedProductFormProps) {
  const [activeTab, setActiveTab] = useState("identity");
  const [formData, setFormData] = useState<ProductFormData>(
    getInitialFormData(initialData),
  );
  const [showSuccess, setShowSuccess] = useState(false);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(
    !!initialData?.slug?.trim(),
  );
  const prevInitialDataRef = useRef<Partial<ProductFormData> | null>(null);

  useEffect(() => {
    if (initialData && initialData !== prevInitialDataRef.current) {
      setFormData(getInitialFormData(initialData));
      setSlugManuallyEdited(!!initialData.slug?.trim());
    }
    prevInitialDataRef.current = initialData ?? null;
  }, [initialData]);

  useEffect(() => {
    if (!slugManuallyEdited && formData.name) {
      handleInputChange("slug", slugify(formData.name));
    }
  }, [formData.name, slugManuallyEdited]);

  const handleInputChange = (field: keyof ProductFormData, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const tabs = [
    { id: "identity", label: "Product Identity", icon: Package },
    { id: "details", label: "Product Details", icon: FileText },
    { id: "pricing", label: "Pricing", icon: DollarSign },
    { id: "media", label: "Media", icon: Camera },
    { id: "seo", label: "SEO", icon: Search },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields before submission
    if (!formData.name?.trim()) {
      toast.error("Product name is required");
      setActiveTab("identity");
      return;
    }

    if (!formData.categoryId?.trim()) {
      toast.error("Please select a category");
      setActiveTab("identity");
      return;
    }

    const finalCurrencyPrices = formData.currencyPrices?.length
      ? formData.currencyPrices.map(cp => ({
          ...cp,
          minDeliveryDays: cp.minDeliveryDays || 1,
          maxDeliveryDays: cp.maxDeliveryDays || 7,
          isActive: cp.isActive !== false,
        }))
      : [
          {
            country: "USA",
            currency: "USD",
            symbol: "$",
            price: 1,
            comparePrice: undefined,
            minDeliveryDays: 1,
            maxDeliveryDays: 7,
            isActive: true,
          },
        ];

    const submissionData = {
      ...formData,
      currencyPrices: finalCurrencyPrices,
    };

    setShowSuccess(true);
    onSubmit(submissionData);

    if (!initialData) {
      setTimeout(() => {
        setFormData(getInitialFormData());
        setShowSuccess(false);
        onSuccess?.();
      }, 1500);
    } else {
      setTimeout(() => setShowSuccess(false), 1500);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="bg-white rounded-xl w-full max-w-6xl max-h-[95vh] overflow-hidden flex flex-col"
        initial={{ scale: 0.9, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 50 }}
        transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-black">
            {initialData ? "Edit Product" : "Add New Product"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {showSuccess && (
          <motion.div
            className="bg-green-50 border-l-4 border-green-400 p-4 mx-6 mt-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
              <p className="text-green-700">
                {initialData
                  ? "Product updated successfully!"
                  : "Product added successfully! Form has been cleared."}
              </p>
            </div>
          </motion.div>
        )}

        <div className="flex border-b border-gray-200 overflow-x-auto bg-gray-100">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-orange-500 text-orange-600 bg-white"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6">
            {activeTab === "identity" && (
              <IdentityTab
                formData={formData}
                categories={categories}
                onChange={handleInputChange}
              />
            )}

            {activeTab === "details" && (
              <DetailsTab formData={formData} onChange={handleInputChange} />
            )}

            {activeTab === "pricing" && (
              <PricingTab
                formData={formData}
                onChange={(field, value) => {
                  if (field === "currencyPrices") {
                    handleInputChange(
                      "currencyPrices",
                      value as CurrencyPrice[],
                    );
                  }
                }}
              />
            )}

            {activeTab === "media" && (
              <MediaTab formData={formData} onChange={handleInputChange} />
            )}

            {activeTab === "seo" && (
              <SEOTab formData={formData} onChange={handleInputChange} />
            )}

            {activeTab === "settings" && (
              <SettingsTab formData={formData} onChange={handleInputChange} />
            )}
          </div>

          <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex justify-between items-center">
            {/* Previous Button */}
            <button
              type="button"
              onClick={() => {
                const currentIndex = tabs.findIndex(t => t.id === activeTab);
                if (currentIndex > 0) {
                  setActiveTab(tabs[currentIndex - 1].id);
                }
              }}
              disabled={tabs.findIndex(t => t.id === activeTab) === 0}
              className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium text-sm"
            >
              ← Previous
            </button>

            {/* Middle Section - Progress Indicator */}
            <div className="flex items-center gap-2">
              {tabs.map((tab, index) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    activeTab === tab.id
                      ? "bg-orange-500 w-8"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                  title={tab.label}
                />
              ))}
            </div>

            {/* Next / Save Button */}
            {activeTab === "settings" ? (
              // Last tab - Show Save/Update button
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium text-sm shadow-sm"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </>
                ) : initialData ? (
                  <>✓ Update Product</>
                ) : (
                  <>✓ Add Product</>
                )}
              </button>
            ) : (
              // Other tabs - Show Next button
              <button
                type="button"
                onClick={() => {
                  const currentIndex = tabs.findIndex(t => t.id === activeTab);
                  if (currentIndex < tabs.length - 1) {
                    setActiveTab(tabs[currentIndex + 1].id);
                  }
                }}
                className="px-5 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2 font-medium text-sm"
              >
                Next →
              </button>
            )}
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

