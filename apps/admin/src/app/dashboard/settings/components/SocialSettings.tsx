"use client";

import { Facebook, Instagram, Video } from "lucide-react";
import { SiteSettings } from "../../types";

interface SocialSettingsProps {
  settings: SiteSettings | null;
  onChange: (field: keyof SiteSettings, value: unknown) => void;
}

export default function SocialSettings({
  settings,
  onChange,
}: SocialSettingsProps) {
  const facebookUrl = settings?.facebookUrl ?? "";
  const instagramUrl = settings?.instagramUrl ?? "";
  const tiktokUrl = settings?.tiktokUrl ?? "";

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Facebook */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <div className="flex items-center gap-2">
            <Facebook className="w-4 h-4 text-blue-600" />
            Facebook URL
          </div>
        </label>
        <input
          type="url"
          value={facebookUrl}
          onChange={(e) => onChange("facebookUrl", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="https://www.facebook.com/yourpage"
        />
        <p className="text-xs text-gray-500 mt-1">
          Enter your Facebook page URL
        </p>
      </div>

      {/* Instagram */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <div className="flex items-center gap-2">
            <Instagram className="w-4 h-4 text-pink-600" />
            Instagram URL
          </div>
        </label>
        <input
          type="url"
          value={instagramUrl}
          onChange={(e) => onChange("instagramUrl", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          placeholder="https://www.instagram.com/yourprofile"
        />
        <p className="text-xs text-gray-500 mt-1">
          Enter your Instagram profile URL
        </p>
      </div>

      {/* TikTok */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <div className="flex items-center gap-2">
            <Video className="w-4 h-4 text-gray-900" />
            TikTok URL
          </div>
        </label>
        <input
          type="url"
          value={tiktokUrl}
          onChange={(e) => onChange("tiktokUrl", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
          placeholder="https://www.tiktok.com/@yourprofile"
        />
        <p className="text-xs text-gray-500 mt-1">
          Enter your TikTok profile URL
        </p>
      </div>
    </div>
  );
}
