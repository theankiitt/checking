import React, { useState } from "react";
import { SiteSettings } from "../types";
import { InputField, CheckboxField, TextAreaField } from "./FormFields";

interface VariantSettingsProps {
  settings: SiteSettings;
  onChange: (field: keyof SiteSettings, value: any) => void;
  onBooleanChange: (field: keyof SiteSettings, value: boolean) => void;
}

export function VariantSettings({
  settings,
  onChange,
  onBooleanChange,
}: VariantSettingsProps) {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTheme, setSelectedTheme] = useState("");
  const [variantValues, setVariantValues] = useState<string[]>([]);
  const [newValue, setNewValue] = useState("");

  const categories = [
    { id: "cat1", name: "Electronics" },
    { id: "cat2", name: "Clothing" },
    { id: "cat3", name: "Home & Garden" },
    { id: "cat4", name: "Jewelry" },
    { id: "cat5", name: "Books" },
  ];

  const variantThemes = [
    { id: "color", name: "Color" },
    { id: "size", name: "Size" },
    { id: "dimension", name: "Dimension" },
    { id: "material", name: "Material" },
    { id: "package", name: "Package" },
    { id: "units", name: "Units" },
  ];

  const addVariantValue = () => {
    if (newValue.trim() && !variantValues.includes(newValue.trim())) {
      setVariantValues([...variantValues, newValue.trim()]);
      setNewValue("");
    }
  };

  const removeVariantValue = (index: number) => {
    setVariantValues(variantValues.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold custom-font text-gray-900 mb-4">
        Variant Management Settings
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="Default Variant Image Width"
          type="number"
          value={settings.defaultVariantImageWidth || 500}
          onChange={(v) => onChange("defaultVariantImageWidth", Number(v))}
          placeholder="500"
        />
        <InputField
          label="Default Variant Image Height"
          type="number"
          value={settings.defaultVariantImageHeight || 500}
          onChange={(v) => onChange("defaultVariantImageHeight", Number(v))}
          placeholder="500"
        />
      </div>

      <div className="space-y-4">
        <CheckboxField
          label="Enable Variant Auto-Generation"
          description="Automatically generate variants based on attributes"
          checked={settings.variantAutoGeneration || false}
          onChange={(v) => onBooleanChange("variantAutoGeneration", v)}
        />
        <CheckboxField
          label="Allow Variant Combinations"
          description="Allow creating combinations of multiple variant types"
          checked={settings.allowVariantCombinations || true}
          onChange={(v) => onBooleanChange("allowVariantCombinations", v)}
        />
        <CheckboxField
          label="Show Out of Stock Variants"
          description="Display variants that are out of stock"
          checked={settings.showOutOfStockVariants || false}
          onChange={(v) => onBooleanChange("showOutOfStockVariants", v)}
        />
        <CheckboxField
          label="Enable Variant Fallback"
          description="Use parent product image when variant image is missing"
          checked={settings.variantFallbackEnabled || true}
          onChange={(v) => onBooleanChange("variantFallbackEnabled", v)}
        />
      </div>

      <div>
        <TextAreaField
          label="Variant Attribute Types"
          value={
            settings.variantAttributeTypes ||
            "Color,Size,Material,Package,Units"
          }
          onChange={(v) => onChange("variantAttributeTypes", v)}
          rows={3}
          placeholder="Enter variant attribute types separated by commas"
        />
        <p className="text-sm text-gray-500 mt-1">
          Define the types of variant attributes available for products
        </p>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h4 className="text-md font-semibold custom-font text-gray-900 mb-4">
          Category-Specific Variant Configuration
        </h4>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium custom-font text-gray-700 mb-2">
              Select Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {selectedCategory && (
            <div>
              <label className="block text-sm font-medium custom-font text-gray-700 mb-2">
                Select Variant Theme
              </label>
              <select
                value={selectedTheme}
                onChange={(e) => setSelectedTheme(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a variant theme</option>
                {variantThemes.map((theme) => (
                  <option key={theme.id} value={theme.id}>
                    {theme.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {selectedCategory && selectedTheme && (
            <div>
              <label className="block text-sm font-medium custom-font text-gray-700 mb-2">
                Variant Values for{" "}
                {variantThemes.find((t) => t.id === selectedTheme)?.name}
              </label>

              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  placeholder={`Enter ${variantThemes.find((t) => t.id === selectedTheme)?.name} value`}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onKeyPress={(e) => e.key === "Enter" && addVariantValue()}
                />
                <button
                  type="button"
                  onClick={addVariantValue}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add
                </button>
              </div>

              {variantValues.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {variantValues.map((value, index) => (
                    <div
                      key={index}
                      className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                    >
                      {value}
                      <button
                        type="button"
                        onClick={() => removeVariantValue(index)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
