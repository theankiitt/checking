import React from "react";
import { SiteSettings } from "../types";
import { ImageUploader } from "./ImageUploader";

interface GeneralSettingsProps {
  settings: SiteSettings;
  onChange: (field: keyof SiteSettings, value: any) => void;
  onLogoUpload: (file: File) => Promise<void>;
  onFaviconUpload: (file: File) => Promise<void>;
  isUploading: boolean;
}

export function GeneralSettings({
  settings,
  onChange,
  onLogoUpload,
  onFaviconUpload,
  isUploading,
}: GeneralSettingsProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold custom-font text-gray-900 mb-4">
        General Settings
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ImageUploader
          label="Site Logo"
          currentImage={settings.siteLogo}
          onUpload={onLogoUpload}
          isUploading={isUploading}
          aspectRatio="aspect-square"
        />

        <ImageUploader
          label="Favicon"
          currentImage={settings.siteFavicon}
          onUpload={onFaviconUpload}
          isUploading={isUploading}
          aspectRatio="aspect-square"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium custom-font text-gray-700 mb-2">
            Site Name
          </label>
          <input
            type="text"
            value={settings.siteName}
            onChange={(e) => onChange("siteName", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
          />
        </div>
        <div>
          <label className="block text-sm font-medium custom-font text-gray-700 mb-2">
            Site URL
          </label>
          <input
            type="url"
            value={settings.siteUrl}
            onChange={(e) => onChange("siteUrl", e.target.value)}
            placeholder="https://example.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium custom-font text-gray-700 mb-2">
          Site Description
        </label>
        <textarea
          value={settings.siteDescription}
          onChange={(e) => onChange("siteDescription", e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>
  );
}
