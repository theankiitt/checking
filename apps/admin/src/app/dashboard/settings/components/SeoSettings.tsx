import React from "react";
import { SiteSettings } from "../types";
import { InputField, TextAreaField } from "./FormFields";

interface SeoSettingsProps {
  settings: SiteSettings;
  onChange: (field: keyof SiteSettings, value: any) => void;
}

export function SeoSettings({ settings, onChange }: SeoSettingsProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold custom-font text-gray-900 mb-4">
        SEO Settings
      </h3>
      <div className="space-y-6">
        <InputField
          label="SEO Title"
          value={settings.seoTitle}
          onChange={(v) => onChange("seoTitle", v)}
          placeholder="Page Title | Site Name"
        />
        <TextAreaField
          label="SEO Description"
          value={settings.seoDescription}
          onChange={(v) => onChange("seoDescription", v)}
          rows={3}
          placeholder="Meta description for search engines"
        />
        <InputField
          label="SEO Keywords"
          value={settings.seoKeywords}
          onChange={(v) => onChange("seoKeywords", v)}
          placeholder="keyword1, keyword2, keyword3"
        />
      </div>
    </div>
  );
}
