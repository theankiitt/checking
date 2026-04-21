"use client";

import { ProductFormData } from "../../types/product";

interface SettingsTabProps {
  formData: ProductFormData;
  onChange: (field: keyof ProductFormData, value: unknown) => void;
}

export default function SettingsTab({ formData, onChange }: SettingsTabProps) {
  const settings = [
    { field: "isSales" as const, label: "Sales" },
    { field: "isNewSeller" as const, label: "New Seller" },
    { field: "isFestivalOffer" as const, label: "Festival Offer" },
    { field: "isFeatured" as const, label: "Featured" },
  ];

  return (
    <div className="space-y-6">
      <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Product Settings
        </h3>
        <div className="space-y-4">
          {settings.map(({ field, label }) => (
            <div key={field} className="flex items-center">
              <input
                type="checkbox"
                id={field}
                checked={formData[field] || false}
                onChange={(e) => onChange(field, e.target.checked)}
                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
              />
              <label
                htmlFor={field}
                className="ml-2 block text-sm text-gray-900"
              >
                {label}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

