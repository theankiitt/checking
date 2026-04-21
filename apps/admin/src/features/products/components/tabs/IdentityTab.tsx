"use client";

import { ProductFormData } from "../../types/product";

interface IdentityTabProps {
  formData: ProductFormData;
  categories: Array<{
    id: string;
    name: string;
    slug: string;
    children?: Array<{ id: string; name: string; slug: string; children?: Array<{ id: string; name: string; slug: string }> }>;
    _count?: { products: number };
  }>;
  onChange: (field: keyof ProductFormData, value: unknown) => void;
}

export default function IdentityTab({
  formData,
  categories,
  onChange,
}: IdentityTabProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Name *
          </label>
          <input
            type="text"
            required
            value={formData.name || ""}
            onChange={(e) => onChange("name", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black"
            placeholder="Enter product name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Code
          </label>
          <input
            type="text"
            value={formData.productCode || ""}
            onChange={(e) => onChange("productCode", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black"
            placeholder="Enter product code"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <select
            value={formData.categoryId || ""}
            onChange={(e) => {
              onChange("categoryId", e.target.value);
              onChange("subCategoryId", "");
              onChange("subSubCategoryId", "");
            }}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black"
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <optgroup key={category.id} label={category.name}>
                <option value={category.id}>
                  {category.name}{" "}
                  {category._count && `(${category._count.products} products)`}
                </option>
                {category.children?.map((subcategory) => (
                  <option key={subcategory.id} value={subcategory.id}>
                    └─ {subcategory.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sub-Category
          </label>
          <select
            value={formData.subCategoryId || ""}
            onChange={(e) => {
              onChange("subCategoryId", e.target.value);
              onChange("subSubCategoryId", "");
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black"
          >
            <option value="">Select Sub-Category</option>
            {formData.categoryId &&
              categories
                .find((cat) => cat.id === formData.categoryId)
                ?.children?.map((subcategory) => (
                  <option key={subcategory.id} value={subcategory.id}>
                    {subcategory.name}
                  </option>
                ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sub-Sub-Category
          </label>
          <select
            value={formData.subSubCategoryId || ""}
            onChange={(e) => onChange("subSubCategoryId", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black"
          >
            <option value="">Select Sub-Sub-Category</option>
            {formData.subCategoryId &&
              categories
                .find((cat) => cat.id === formData.categoryId)
                ?.children?.find((sub) => sub.id === formData.subCategoryId)
                ?.children?.map((subSub) => (
                  <option key={subSub.id} value={subSub.id}>
                    {subSub.name}
                  </option>
                ))}
          </select>
        </div>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="isVariant"
          checked={formData.isVariant || false}
          onChange={(e) => onChange("isVariant", e.target.checked)}
          className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
        />
        <label htmlFor="isVariant" className="ml-2 block text-sm text-gray-900">
          This product has variants
        </label>
      </div>
    </div>
  );
}

