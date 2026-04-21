"use client";

import { useState, useMemo } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Product, CustomField } from "../types";

interface ProductTabsProps {
  product: Product;
  customFields: CustomField[];
}

type AccordionType = "key-info" | "description" | "production" | "custom";

export default function ProductTabs({
  product,
  customFields,
}: ProductTabsProps) {
  const [openSection, setOpenSection] = useState<AccordionType | null>("key-info");

  const toggleSection = (section: AccordionType) => {
    setOpenSection(openSection === section ? null : section);
  };

  const specs = useMemo(() => {
    const items: { label: string; value: string }[] = [];
    product.attributes?.forEach((attr) => {
      items.push({ label: attr.name, value: attr.value });
    });
    if (product.dimensions?.width !== undefined) {
      items.push({
        label: "Width",
        value: `${product.dimensions.width} ${product.dimensions.unit || "cm"}`,
      });
    }
    if (product.dimensions?.height !== undefined) {
      items.push({
        label: "Height",
        value: `${product.dimensions.height} ${product.dimensions.unit || "cm"}`,
      });
    }
    if (product.weight) {
      items.push({
        label: "Weight",
        value: `${product.weight} ${product.weightUnit || "g"}`,
      });
    }
    return items;
  }, [product]);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm bg-gray-100">
      

      {/* Product Description Accordion */}
      <div className="border-b border-gray-200 ">
        <button
          onClick={() => toggleSection("description")}
          className="w-full flex items-center justify-between p-5 lg:p-6 hover:bg-gray-50 transition-colors"
        >
          <h3 className="text-lg font-semibold text-gray-900">
            Product Description
          </h3>
          {openSection === "description" ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </button>
        {openSection === "description" && (
          <div className="px-5 lg:px-6 pb-6">
            <div
              className="prose max-w-none text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: product.description || "No description available." }}
            />
          </div>
        )}
      </div>

      {/* Production Information Accordion */}
      <div className="border-b border-gray-200">
        <button
          onClick={() => toggleSection("production")}
          className="w-full flex items-center justify-between p-5 lg:p-6 hover:bg-gray-50 transition-colors"
        >
          <h3 className="text-lg font-semibold text-gray-900">
            Production Information
          </h3>
          {openSection === "production" ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </button>
        {openSection === "production" && (
          <div className="px-5 lg:px-6 pb-6">
            {specs.length > 0 ? (
              <div className="space-y-3">
                {specs.map((spec, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0"
                  >
                    <span className="text-sm text-gray-600 font-medium">
                      {spec.label}
                    </span>
                    <span className="text-sm text-gray-900 font-semibold">
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">
                No production details available for this product.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Additional Information Accordion */}
      {customFields.length > 0 && (
        <div>
          <button
            onClick={() => toggleSection("custom")}
            className="w-full flex items-center justify-between p-5 lg:p-6 hover:bg-gray-50 transition-colors"
          >
            <h3 className="text-lg font-semibold text-gray-900">
              Additional Information
            </h3>
            {openSection === "custom" ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </button>
          {openSection === "custom" && (
            <div className="px-5 lg:px-6 pb-6">
              <div className="space-y-3">
                {customFields.map((field, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0"
                  >
                    <span className="text-sm text-gray-600 font-medium">
                      {field.name}
                    </span>
                    <span className="text-sm text-gray-900 font-semibold">
                      {field.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
