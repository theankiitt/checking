"use client";

import RichTextEditor from "@/components/RichTextEditor";
import { ProductFormData } from "../../types/product";

interface DetailsTabProps {
  formData: ProductFormData;
  onChange: (field: keyof ProductFormData, value: unknown) => void;
}

export default function DetailsTab({ formData, onChange }: DetailsTabProps) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Full Description *
        </label>
        <RichTextEditor
          value={formData.description || ""}
          onChange={(value: string) => onChange("description", value)}
          placeholder="Enter detailed product description..."
        />
      </div>
    </div>
  );
}

