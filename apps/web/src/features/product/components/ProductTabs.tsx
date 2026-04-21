"use client";

import type { Product } from "@/shared/types";

interface ProductTabsProps {
  product: Product;
  categoryDetails?: any;
  isDescriptionExpanded: boolean;
  onToggleDescription: () => void;
}

export default function ProductTabs({
  product,
  categoryDetails,
  isDescriptionExpanded,
  onToggleDescription,
}: ProductTabsProps) {
  const [activeTab, setActiveTab] = React.useState<
    "description" | "details" | "custom"
  >("description");
  const [customFields] = React.useState<any[]>([]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab("description")}
            className={`py-4 px-1 text-lg font-medium ${
              activeTab === "description"
                ? "border-b-2 border-[#7c3aed] text-[#7c3aed]"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Description
          </button>
          <button
            onClick={() => setActiveTab("details")}
            className={`py-4 px-1 text-lg font-medium ${
              activeTab === "details"
                ? "border-b-2 border-[#7c3aed] text-[#7c3aed]"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Product Details
          </button>
          {customFields.length > 0 && (
            <button
              onClick={() => setActiveTab("custom")}
              className={`py-4 px-1 text-lg font-medium ${
                activeTab === "custom"
                  ? "border-b-2 border-[#7c3aed] text-[#7c3aed]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Additional Information
            </button>
          )}
        </nav>
      </div>

      <div className="mt-6">
        {activeTab === "description" && (
          <div className="prose max-w-none text-gray-700 leading-relaxed text-lg">
            {isDescriptionExpanded ? (
              <div
                dangerouslySetInnerHTML={{ __html: product.description || "" }}
              />
            ) : (
              <div>
                <div
                  dangerouslySetInnerHTML={{
                    __html:
                      (product.description?.length ?? 0) > 300
                        ? (product.description || "").substring(0, 300) + "..."
                        : product.description || "",
                  }}
                />
                {(product.description?.length ?? 0) > 300 && (
                  <button
                    onClick={onToggleDescription}
                    className="text-blue-600 hover:text-blue-800 font-medium mt-2"
                  >
                    Read More
                  </button>
                )}
              </div>
            )}
            {isDescriptionExpanded &&
              (product.description?.length ?? 0) > 300 && (
                <button
                  onClick={onToggleDescription}
                  className="text-blue-600 hover:text-blue-800 font-medium mt-2"
                >
                  Show Less
                </button>
              )}
          </div>
        )}

        {activeTab === "details" && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Product Specifications
            </h3>
            <div className="space-y-3">
              {product.attributes &&
                product.attributes.length > 0 &&
                product.attributes.map((attr) => (
                  <div
                    key={attr.id}
                    className="flex justify-between py-2 border-b border-gray-100"
                  >
                    <span className="text-gray-600 font-medium">
                      {attr.name}
                    </span>
                    <span className="text-gray-900">{attr.value}</span>
                  </div>
                ))}
              {product.dimensions && (
                <>
                  {product.dimensions.width !== undefined && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600 font-medium">Width</span>
                      <span className="text-gray-900">
                        {product.dimensions.width}{" "}
                        {product.dimensions.unit || "cm"}
                      </span>
                    </div>
                  )}
                  {product.dimensions.height !== undefined && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600 font-medium">Height</span>
                      <span className="text-gray-900">
                        {product.dimensions.height}{" "}
                        {product.dimensions.unit || "cm"}
                      </span>
                    </div>
                  )}
                </>
              )}
              {product.weight !== undefined && (
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Weight</span>
                  <span className="text-gray-900">
                    {product.weight} {product.weightUnit || "g"}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "custom" && customFields.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Additional Information
            </h3>
            <div className="space-y-3">
              {customFields.map((field, index) => (
                <div
                  key={index}
                  className="flex justify-between py-2 border-b border-gray-100"
                >
                  <span className="text-gray-600 font-medium">
                    {field.label}
                  </span>
                  <span
                    className="text-gray-900"
                    dangerouslySetInnerHTML={{ __html: field.content }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {categoryDetails?.disclaimer && (
        <div className="mt-8 pt-8 border-t border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Disclaimer</h3>
          <div
            className="prose max-w-none text-gray-700"
            dangerouslySetInnerHTML={{ __html: categoryDetails.disclaimer }}
          />
        </div>
      )}

      {categoryDetails?.faqs && categoryDetails.faqs.length > 0 && (
        <div className="mt-8 pt-8 border-t border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h3>
          <div className="space-y-6">
            {categoryDetails.faqs.map((faq: any, index: number) => (
              <div
                key={index}
                className="border-b border-gray-200 pb-6 last:border-b-0"
              >
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  {faq.question}
                </h4>
                <p className="text-gray-700">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

import React from "react";
