"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { ProductFormData } from "../../types/product";

interface SEOTabProps {
  formData: ProductFormData;
  onChange: (field: keyof ProductFormData, value: unknown) => void;
}

export default function SEOTab({ formData, onChange }: SEOTabProps) {
  const [newKeyword, setNewKeyword] = useState("");

  const handleAddKeyword = () => {
    if (newKeyword.trim()) {
      const currentKeywords = formData.seoKeywords || [];
      onChange("seoKeywords", [...currentKeywords, newKeyword.trim()]);
      setNewKeyword("");
    }
  };

  const handleRemoveKeyword = (keywordToRemove: string) => {
    const currentKeywords = formData.seoKeywords || [];
    onChange(
      "seoKeywords",
      currentKeywords.filter((kw: string) => kw !== keywordToRemove),
    );
  };

  return (
    <div className="space-y-6">
      <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic SEO</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SEO Title
            </label>
            <input
              type="text"
              value={formData.seoTitle || ""}
              onChange={(e) => onChange("seoTitle", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black"
              placeholder="Enter SEO title (50-60 characters recommended)"
              maxLength={60}
            />
            <p className="text-xs text-gray-500 mt-1">
              {(formData.seoTitle || "").length}/60 characters
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SEO Description
            </label>
            <textarea
              value={formData.seoDescription || ""}
              onChange={(e) => onChange("seoDescription", e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black"
              placeholder="Enter SEO description (150-160 characters recommended)"
              maxLength={160}
            />
            <p className="text-xs text-gray-500 mt-1">
              {(formData.seoDescription || "").length}/160 characters
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SEO Keywords
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {(formData.seoKeywords || []).map(
                (keyword: string, index: number) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800"
                  >
                    {keyword}
                    <button
                      type="button"
                      onClick={() => handleRemoveKeyword(keyword)}
                      className="ml-2 text-purple-600 hover:text-purple-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ),
              )}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddKeyword();
                  }
                }}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black"
                placeholder="Enter keyword"
              />
              <button
                type="button"
                onClick={handleAddKeyword}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL Slug
            </label>
            <input
              type="text"
              value={formData.slug || ""}
              onChange={(e) => onChange("slug", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black"
              placeholder="product-url-slug"
            />
            <p className="text-xs text-gray-500 mt-1">
              This will be used in the product URL: /products/
              {formData.slug || "slug"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

