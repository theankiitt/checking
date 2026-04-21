import { useState } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import { Category, NavColumn, FormData, LinkSource } from "../types";
import { CategoryPicker } from "./CategoryPicker";
import { UrlInput } from "./UrlInput";
import { MegaMenuEditor } from "./MegaMenuEditor";

interface NavigationItemFormProps {
  isOpen: boolean;
  editingItem: {
    id: string;
    label: string;
    href: string;
    type: "link" | "dropdown";
    columns?: NavColumn[];
  } | null;
  formData: FormData;
  categories: Category[];
  onFormDataChange: (data: Partial<FormData>) => void;
  onSave: () => void;
  onClose: () => void;
}

export function NavigationItemForm({
  isOpen,
  editingItem,
  formData,
  categories,
  onFormDataChange,
  onSave,
  onClose,
}: NavigationItemFormProps) {
  if (!isOpen) return null;

  const handleSave = () => {
    let href = formData.customUrl;
    let label = formData.label;

    if (formData.linkSource === "category") {
      const cat = categories.find((c) => c.id === formData.selectedCategory);
      if (cat) {
        href = `/products/${cat.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
        if (!label) label = cat.name;
      }
    }

    if (!label) {
      toast.error("Label is required");
      return;
    }

    onSave();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-black">
            {editingItem ? "Edit Item" : "New Item"}
          </h2>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-black" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Item Type
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  checked={formData.type === "link"}
                  onChange={() => onFormDataChange({ type: "link" })}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-black">Simple Link</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  checked={formData.type === "dropdown"}
                  onChange={() => onFormDataChange({ type: "dropdown" })}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-black">Mega Menu (Dropdown)</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Main Link Source
            </label>
            <div className="flex gap-4 p-1 bg-gray-100 rounded-lg inline-flex">
              <button
                onClick={() => onFormDataChange({ linkSource: "category" })}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  formData.linkSource === "category"
                    ? "bg-white shadow text-black"
                    : "text-black hover:text-gray-600"
                }`}
              >
                Category
              </button>
              <button
                onClick={() => onFormDataChange({ linkSource: "custom" })}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  formData.linkSource === "custom"
                    ? "bg-white shadow text-black"
                    : "text-black hover:text-gray-600"
                }`}
              >
                Custom URL
              </button>
            </div>
          </div>

          {formData.linkSource === "category" ? (
            <CategoryPicker
              value={formData.selectedCategory}
              onChange={(id, label) =>
                onFormDataChange({
                  selectedCategory: id,
                  label: formData.label || label,
                })
              }
              categories={categories}
            />
          ) : (
            <UrlInput
              value={formData.customUrl}
              onChange={(v) => onFormDataChange({ customUrl: v })}
            />
          )}

          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Label
            </label>
            <input
              type="text"
              value={formData.label}
              onChange={(e) => onFormDataChange({ label: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Menu Label"
            />
          </div>

          {formData.type === "dropdown" && (
            <MegaMenuEditor
              columns={formData.columns}
              onChange={(cols) => onFormDataChange({ columns: cols })}
              categories={categories}
            />
          )}

          <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 text-black font-medium hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700"
            >
              {editingItem ? "Save Changes" : "Create Item"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
