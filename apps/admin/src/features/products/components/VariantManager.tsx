"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  X,
  ChevronDown,
  ChevronUp,
  Package,
  Layers,
  Palette,
  Ruler,
  Weight,
  Shirt,
  Image as ImageIcon,
  Copy,
  Trash2,
  Sparkles,
} from "lucide-react";

// ========================
// Type Definitions
// ========================

interface VariantOption {
  id: string;
  value: string;
  colorHex?: string; // For color variants
  image?: string; // For image-based variants
}

interface VariantAttribute {
  id: string;
  name: string; // e.g., "Size", "Color", "Material"
  icon?: string;
  options: VariantOption[];
}

interface ProductVariant {
  id: string;
  sku: string;
  price: number;
  comparePrice?: number;
  stock: number;
  trackInventory: boolean;
  allowBackorder: boolean;
  lowStockThreshold: number;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: string;
  };
  barcode?: string;
  isActive: boolean;
  isDefault: boolean;
  // Dynamic option mapping
  options: Record<string, string>; // { "Color": "Red", "Size": "Large" }
}

interface CategoryVariantTemplate {
  category: string;
  attributes: {
    name: string;
    icon: string;
    defaultOptions: string[];
    allowsCustomOptions: boolean;
    supportsColorPicker: boolean;
  }[];
  recommendedAttributes: string[];
}

// ========================
// Category Templates
// ========================

const CATEGORY_TEMPLATES: Record<string, CategoryVariantTemplate> = {
  clothing: {
    category: "Clothing",
    attributes: [
      {
        name: "Size",
        icon: "ruler",
        defaultOptions: ["XS", "S", "M", "L", "XL", "XXL", "3XL"],
        allowsCustomOptions: true,
        supportsColorPicker: false,
      },
      {
        name: "Color",
        icon: "palette",
        defaultOptions: [
          "Black",
          "White",
          "Red",
          "Navy",
          "Royal Blue",
          "Gray",
          "Heather Gray",
        ],
        allowsCustomOptions: true,
        supportsColorPicker: true,
      },
      {
        name: "Material",
        icon: "layers",
        defaultOptions: ["Cotton", "Polyester", "Silk", "Wool", "Linen"],
        allowsCustomOptions: true,
        supportsColorPicker: false,
      },
    ],
    recommendedAttributes: ["Size", "Color"],
  },
  statue: {
    category: "Statue",
    attributes: [
      {
        name: "Size",
        icon: "ruler",
        defaultOptions: ["Small (6-8\")", "Medium (10-12\")", "Large (14-18\")", "Extra Large (20-24\")"],
        allowsCustomOptions: true,
        supportsColorPicker: false,
      },
      {
        name: "Material",
        icon: "layers",
        defaultOptions: ["Bronze", "Brass", "Copper", "Wood", "Stone", "Marble"],
        allowsCustomOptions: true,
        supportsColorPicker: false,
      },
      {
        name: "Finish",
        icon: "palette",
        defaultOptions: ["Polished", "Antique", "Matte", "Gold Plated", "Silver Plated"],
        allowsCustomOptions: true,
        supportsColorPicker: false,
      },
      {
        name: "Color",
        icon: "palette",
        defaultOptions: ["Natural Bronze", "Gold", "Silver", "Copper", "Black"],
        allowsCustomOptions: true,
        supportsColorPicker: true,
      },
    ],
    recommendedAttributes: ["Size", "Material"],
  },
  carpet: {
    category: "Carpet",
    attributes: [
      {
        name: "Size",
        icon: "ruler",
        defaultOptions: [
          "2x3 ft",
          "3x5 ft",
          "4x6 ft",
          "5x7 ft",
          "6x9 ft",
          "8x10 ft",
          "9x12 ft",
          "10x14 ft",
        ],
        allowsCustomOptions: true,
        supportsColorPicker: false,
      },
      {
        name: "Material",
        icon: "layers",
        defaultOptions: ["Wool", "Silk", "Cotton", "Jute", "Synthetic", "Blend"],
        allowsCustomOptions: true,
        supportsColorPicker: false,
      },
      {
        name: "Color",
        icon: "palette",
        defaultOptions: ["Red", "Blue", "Beige", "Gray", "Navy", "Multi-Color"],
        allowsCustomOptions: true,
        supportsColorPicker: true,
      },
      {
        name: "Design",
        icon: "image",
        defaultOptions: ["Traditional", "Modern", "Persian", "Geometric", "Floral"],
        allowsCustomOptions: true,
        supportsColorPicker: false,
      },
    ],
    recommendedAttributes: ["Size", "Material", "Color"],
  },
  jewelry: {
    category: "Jewelry",
    attributes: [
      {
        name: "Size",
        icon: "ruler",
        defaultOptions: ["6", "7", "8", "9", "10", "11", "12"],
        allowsCustomOptions: true,
        supportsColorPicker: false,
      },
      {
        name: "Metal",
        icon: "layers",
        defaultOptions: ["Gold 14K", "Gold 18K", "Gold 22K", "Silver 925", "Platinum"],
        allowsCustomOptions: false,
        supportsColorPicker: false,
      },
      {
        name: "Color",
        icon: "palette",
        defaultOptions: ["Yellow Gold", "White Gold", "Rose Gold", "Silver"],
        allowsCustomOptions: true,
        supportsColorPicker: true,
      },
      {
        name: "Stone",
        icon: "sparkles",
        defaultOptions: ["Diamond", "Ruby", "Emerald", "Sapphire", "Pearl", "None"],
        allowsCustomOptions: true,
        supportsColorPicker: false,
      },
    ],
    recommendedAttributes: ["Size", "Metal"],
  },
  default: {
    category: "General",
    attributes: [
      {
        name: "Size",
        icon: "ruler",
        defaultOptions: ["Small", "Medium", "Large"],
        allowsCustomOptions: true,
        supportsColorPicker: false,
      },
      {
        name: "Color",
        icon: "palette",
        defaultOptions: ["Black", "White", "Red", "Blue", "Green"],
        allowsCustomOptions: true,
        supportsColorPicker: true,
      },
      {
        name: "Material",
        icon: "layers",
        defaultOptions: ["Standard", "Premium", "Deluxe"],
        allowsCustomOptions: true,
        supportsColorPicker: false,
      },
    ],
    recommendedAttributes: ["Size", "Color"],
  },
};

// ========================
// Helper Functions
// ========================

function generateId(): string {
  return `var_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function getIconComponent(iconName: string) {
  const icons: Record<string, React.ComponentType<{ className?: string }>> = {
    ruler: Ruler,
    palette: Palette,
    layers: Layers,
    package: Package,
    image: ImageIcon,
    sparkles: Sparkles,
    shirt: Shirt,
    weight: Weight,
  };
  return icons[iconName] || Package;
}

function cartesianProduct(arrays: VariantOption[][]): VariantOption[][] {
  return arrays.reduce<VariantOption[][]>(
    (results, array) => {
      return results
        .map((result) => array.map((item) => [...result, item]))
        .reduce((a, b) => [...a, ...b], []);
    },
    [[]],
  );
}

// ========================
// Main Component
// ========================

interface VariantManagerProps {
  categoryId?: string;
  value?: {
    isVariant: boolean;
    variantAttributes: VariantAttribute[];
    variants: ProductVariant[];
  };
  onChange: (value: {
    isVariant: boolean;
    variantAttributes: VariantAttribute[];
    variants: ProductVariant[];
  }) => void;
}

export default function VariantManager({
  categoryId,
  value,
  onChange,
}: VariantManagerProps) {
  const [isVariant, setIsVariant] = useState(value?.isVariant || false);
  const [attributes, setAttributes] = useState<VariantAttribute[]>(
    value?.variantAttributes || [],
  );
  const [variants, setVariants] = useState<ProductVariant[]>(
    value?.variants || [],
  );
  const [expandedVariant, setExpandedVariant] = useState<string | null>(null);

  // Get category template
  const categoryKey = categoryId?.toLowerCase() || "default";
  const template =
    CATEGORY_TEMPLATES[categoryKey] || CATEGORY_TEMPLATES["default"];

  // Handle variant toggle
  const handleVariantToggle = useCallback(
    (enabled: boolean) => {
      setIsVariant(enabled);
      if (!enabled) {
        setAttributes([]);
        setVariants([]);
      }
      onChange({
        isVariant: enabled,
        variantAttributes: enabled ? attributes : [],
        variants: enabled ? variants : [],
      });
    },
    [attributes, variants, onChange],
  );

  // Add attribute from template
  const handleAddAttribute = useCallback(
    (attrName: string) => {
      const templateAttr = template.attributes.find(
        (a) => a.name === attrName,
      );
      if (!templateAttr) return;

      const newAttribute: VariantAttribute = {
        id: generateId(),
        name: attrName,
        icon: templateAttr.icon,
        options: templateAttr.defaultOptions.map((opt) => ({
          id: generateId(),
          value: opt,
        })),
      };

      const newAttributes = [...attributes, newAttribute];
      setAttributes(newAttributes);
      onChange({ isVariant, variantAttributes: newAttributes, variants });
    },
    [attributes, isVariant, variants, onChange, template],
  );

  // Remove attribute
  const handleRemoveAttribute = useCallback(
    (attrId: string) => {
      const newAttributes = attributes.filter((a) => a.id !== attrId);
      setAttributes(newAttributes);
      onChange({ isVariant, variantAttributes: newAttributes, variants });
    },
    [attributes, isVariant, variants, onChange],
  );

  // Add option to attribute
  const handleAddOption = useCallback(
    (attrId: string) => {
      const newAttributes = attributes.map((attr) => {
        if (attr.id !== attrId) return attr;
        return {
          ...attr,
          options: [
            ...attr.options,
            { id: generateId(), value: `Option ${attr.options.length + 1}` },
          ],
        };
      });
      setAttributes(newAttributes);
      onChange({ isVariant, variantAttributes: newAttributes, variants });
    },
    [attributes, isVariant, variants, onChange],
  );

  // Update option value
  const handleUpdateOption = useCallback(
    (attrId: string, optionId: string, newValue: string) => {
      const newAttributes = attributes.map((attr) => {
        if (attr.id !== attrId) return attr;
        return {
          ...attr,
          options: attr.options.map((opt) =>
            opt.id === optionId ? { ...opt, value: newValue } : opt,
          ),
        };
      });
      setAttributes(newAttributes);
      onChange({ isVariant, variantAttributes: newAttributes, variants });
    },
    [attributes, isVariant, variants, onChange],
  );

  // Remove option
  const handleRemoveOption = useCallback(
    (attrId: string, optionId: string) => {
      const newAttributes = attributes.map((attr) => {
        if (attr.id !== attrId) return attr;
        return {
          ...attr,
          options: attr.options.filter((opt) => opt.id !== optionId),
        };
      });
      setAttributes(newAttributes);
      onChange({ isVariant, variantAttributes: newAttributes, variants });
    },
    [attributes, isVariant, variants, onChange],
  );

  // Generate all variants (cartesian product)
  const handleGenerateVariants = useCallback(() => {
    if (attributes.length === 0) return;

    const optionArrays = attributes.map((attr) => attr.options);
    const combinations = cartesianProduct(optionArrays);

    const newVariants: ProductVariant[] = combinations.map((combo, index) => {
      const options: Record<string, string> = {};
      combo.forEach((opt, i) => {
        options[attributes[i].name] = opt.value;
      });

      // Generate SKU based on variant combination
      const skuSuffix = combo.map((c) => c.value.substring(0, 3).toUpperCase()).join("-");

      return {
        id: generateId(),
        sku: `SKU-${skuSuffix}-${String(index + 1).padStart(3, "0")}`,
        price: 0,
        comparePrice: undefined,
        trackInventory: true,
        allowBackorder: false,
        lowStockThreshold: 5,
        weight: undefined,
        dimensions: undefined,
        barcode: undefined,
        isActive: true,
        isDefault: index === 0,
        options,
      };
    });

    setVariants(newVariants);
    onChange({ isVariant, variantAttributes: attributes, variants: newVariants });
  }, [attributes, isVariant, onChange, variants]);

  // Update variant field
  const handleUpdateVariant = useCallback(
    (variantId: string, field: keyof ProductVariant, value: any) => {
      const newVariants = variants.map((v) => {
        if (v.id !== variantId) return v;
        return { ...v, [field]: value };
      });
      setVariants(newVariants);
      onChange({ isVariant, variantAttributes: attributes, variants: newVariants });
    },
    [attributes, isVariant, onChange, variants],
  );

  // Delete variant
  const handleDeleteVariant = useCallback(
    (variantId: string) => {
      const newVariants = variants.filter((v) => v.id !== variantId);
      setVariants(newVariants);
      onChange({ isVariant, variantAttributes: attributes, variants: newVariants });
    },
    [attributes, isVariant, onChange, variants],
  );

  // Duplicate variant
  const handleDuplicateVariant = useCallback(
    (variant: ProductVariant) => {
      const newVariant = {
        ...variant,
        id: generateId(),
        sku: `${variant.sku}-COPY`,
      };
      const newVariants = [...variants, newVariant];
      setVariants(newVariants);
      onChange({ isVariant, variantAttributes: attributes, variants: newVariants });
    },
    [attributes, isVariant, onChange, variants],
  );

  return (
    <div className="space-y-6">
      {/* Variant Toggle */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div>
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-orange-500" />
            Product Variants
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Add variants like size, color, material, etc.
          </p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={isVariant}
            onChange={(e) => handleVariantToggle(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
        </label>
      </div>

      <AnimatePresence>
        {isVariant && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Category Template Suggestions */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-orange-900">
                    Recommended for {template.category}
                  </h4>
                  <p className="text-sm text-orange-700 mt-1">
                    Add these variant options:{" "}
                    {template.recommendedAttributes.join(", ")}
                  </p>
                </div>
              </div>
            </div>

            {/* Attribute Selection */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">
                Select Variant Options
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {template.attributes
                  .filter(
                    (attr) =>
                      !attributes.find((a) => a.name === attr.name),
                  )
                  .map((attr) => {
                    const Icon = getIconComponent(attr.icon);
                    return (
                      <button
                        key={attr.name}
                        onClick={() => handleAddAttribute(attr.name)}
                        className="flex items-center gap-2 px-4 py-3 bg-white border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all text-sm font-medium text-gray-700 hover:text-orange-700"
                      >
                        <Icon className="w-4 h-4" />
                        {attr.name}
                      </button>
                    );
                  })}
              </div>
            </div>

            {/* Selected Attributes with Options */}
            {attributes.length > 0 && (
              <div className="space-y-4">
                {attributes.map((attr) => (
                  <div
                    key={attr.id}
                    className="bg-white border border-gray-200 rounded-lg overflow-hidden"
                  >
                    <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
                      <div className="flex items-center gap-2">
                        {(() => {
                          const Icon = getIconComponent(attr.icon || "");
                          return <Icon className="w-4 h-4 text-gray-500" />;
                        })()}
                        <span className="font-medium text-gray-900">
                          {attr.name}
                        </span>
                        <span className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">
                          {attr.options.length} options
                        </span>
                      </div>
                      <button
                        onClick={() => handleRemoveAttribute(attr.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="p-4">
                      <div className="space-y-2">
                        {attr.options.map((option) => (
                          <div
                            key={option.id}
                            className="flex items-center gap-2"
                          >
                            <input
                              type="text"
                              value={option.value}
                              onChange={(e) =>
                                handleUpdateOption(
                                  attr.id,
                                  option.id,
                                  e.target.value,
                                )
                              }
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                              placeholder="Option name"
                            />
                            <button
                              onClick={() =>
                                handleRemoveOption(attr.id, option.id)
                              }
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => handleAddOption(attr.id)}
                          className="flex items-center gap-1 text-sm text-orange-600 hover:text-orange-700 font-medium"
                        >
                          <Plus className="w-4 h-4" />
                          Add option
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Generate Variants Button */}
                <button
                  onClick={handleGenerateVariants}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all font-medium shadow-sm"
                >
                  <Sparkles className="w-5 h-5" />
                  Generate {variants.length > 0 ? `${variants.length} ` : ""}
                  Variant{variants.length !== 1 ? "s" : ""}
                </button>
              </div>
            )}

            {/* Generated Variants List */}
            {variants.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">
                    Variant Combinations ({variants.length})
                  </h4>
                  <button
                    onClick={() => setVariants([])}
                    className="text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    Clear All
                  </button>
                </div>

                <div className="space-y-2">
                  {variants.map((variant, index) => (
                    <div
                      key={variant.id}
                      className="bg-white border border-gray-200 rounded-lg overflow-hidden"
                    >
                      {/* Variant Header */}
                      <div
                        className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() =>
                          setExpandedVariant(
                            expandedVariant === variant.id ? null : variant.id,
                          )
                        }
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center text-sm font-medium text-orange-700">
                            {index + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              {Object.entries(variant.options).map(
                                ([key, val]) => (
                                  <span
                                    key={key}
                                    className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs font-medium"
                                  >
                                    {key}: {val}
                                  </span>
                                ),
                              )}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              SKU: {variant.sku}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-sm font-semibold text-gray-900">
                              ${variant.price.toFixed(2)}
                            </p>
                            <p className="text-xs text-gray-500">
                              {variant.stock} in stock
                            </p>
                          </div>
                          {expandedVariant === variant.id ? (
                            <ChevronUp className="w-5 h-5 text-gray-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </div>

                      {/* Variant Details (Expanded) */}
                      <AnimatePresence>
                        {expandedVariant === variant.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="px-4 pb-4 border-t border-gray-200 pt-4">
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Price *
                                  </label>
                                  <input
                                    type="number"
                                    value={variant.price}
                                    onChange={(e) =>
                                      handleUpdateVariant(
                                        variant.id,
                                        "price",
                                        parseFloat(e.target.value) || 0,
                                      )
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                    step="0.01"
                                    min="0"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Compare Price
                                  </label>
                                  <input
                                    type="number"
                                    value={variant.comparePrice || ""}
                                    onChange={(e) =>
                                      handleUpdateVariant(
                                        variant.id,
                                        "comparePrice",
                                        e.target.value
                                          ? parseFloat(e.target.value)
                                          : undefined,
                                      )
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                    step="0.01"
                                    min="0"
                                    placeholder="Optional"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Stock *
                                  </label>
                                  <input
                                    type="number"
                                    value={variant.stock}
                                    onChange={(e) =>
                                      handleUpdateVariant(
                                        variant.id,
                                        "stock",
                                        parseInt(e.target.value) || 0,
                                      )
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                    min="0"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">
                                    SKU *
                                  </label>
                                  <input
                                    type="text"
                                    value={variant.sku}
                                    onChange={(e) =>
                                      handleUpdateVariant(
                                        variant.id,
                                        "sku",
                                        e.target.value,
                                      )
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                  />
                                </div>
                              </div>

                              {/* Variant Actions */}
                              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                                <label className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    checked={variant.isActive}
                                    onChange={(e) =>
                                      handleUpdateVariant(
                                        variant.id,
                                        "isActive",
                                        e.target.checked,
                                      )
                                    }
                                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                                  />
                                  <span className="text-sm text-gray-700">
                                    Active
                                  </span>
                                </label>
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() =>
                                      handleDuplicateVariant(variant)
                                    }
                                    className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                                    title="Duplicate variant"
                                  >
                                    <Copy className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleDeleteVariant(variant.id)
                                    }
                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Delete variant"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

