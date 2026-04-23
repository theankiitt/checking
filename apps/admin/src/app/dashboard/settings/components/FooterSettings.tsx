"use client";

import { useState } from "react";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { SiteSettings } from "../../types";

interface FooterSettingsProps {
  settings: SiteSettings | null;
  onChange: (field: keyof SiteSettings, value: any) => void;
}

interface QuickLink {
  label: string;
  href: string;
}

interface SocialLink {
  name: string;
  href: string;
  icon: string;
}

export function FooterSettings({
  settings,
  onChange,
}: FooterSettingsProps) {
  const [newQuickLink, setNewQuickLink] = useState<{ label: string; href: string }>({ label: "", href: "" });
  const [newSocialLink, setNewSocialLink] = useState<{ name: string; href: string; icon: string }>({ name: "", href: "", icon: "facebook" });

  const quickLinks: QuickLink[] = settings?.footerQuickLinks || [];
  const socialLinks: SocialLink[] = settings?.socialLinks || [];

  const handleQuickLinkChange = (index: number, field: keyof QuickLink, value: string) => {
    const updated = [...quickLinks];
    updated[index] = { ...updated[index], [field]: value };
    onChange("footerQuickLinks", updated);
  };

  const removeQuickLink = (index: number) => {
    const updated = quickLinks.filter((_, i) => i !== index);
    onChange("footerQuickLinks", updated);
  };

  const addQuickLink = () => {
    if (newQuickLink.label && newQuickLink.href) {
      onChange("footerQuickLinks", [...quickLinks, { ...newQuickLink }]);
      setNewQuickLink({ label: "", href: "" });
    }
  };

  const handleSocialLinkChange = (index: number, field: keyof SocialLink, value: string) => {
    const updated = [...socialLinks];
    updated[index] = { ...updated[index], [field]: value };
    onChange("socialLinks", updated);
  };

  const removeSocialLink = (index: number) => {
    const updated = socialLinks.filter((_, i) => i !== index);
    onChange("socialLinks", updated);
  };

  const addSocialLink = () => {
    if (newSocialLink.name && newSocialLink.href) {
      onChange("socialLinks", [...socialLinks, { ...newSocialLink }]);
      setNewSocialLink({ name: "", href: "", icon: "facebook" });
    }
  };

  return (
    <div className="space-y-8">
      {/* Footer Description */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">
          Footer Description
        </h3>
        <textarea
          value={settings?.footerDescription || ""}
          onChange={(e) => onChange("footerDescription", e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter footer description..."
        />
        <p className="text-xs text-gray-500 mt-1">
          This text appears below your logo in the footer section.
        </p>
      </div>

      {/* Quick Links */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">
          Quick Links
        </h3>
        <div className="space-y-3">
          {quickLinks.map((link, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <GripVertical className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <div className="flex-1 grid grid-cols-2 gap-3">
                <input
                  type="text"
                  value={link.label}
                  onChange={(e) => handleQuickLinkChange(index, "label", e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Label"
                />
                <input
                  type="text"
                  value={link.href}
                  onChange={(e) => handleQuickLinkChange(index, "href", e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="URL (e.g., /products)"
                />
              </div>
              <button
                type="button"
                onClick={() => removeQuickLink(index)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-3 flex items-center gap-3 p-3 border-2 border-dashed border-gray-300 rounded-lg">
          <input
            type="text"
            value={newQuickLink.label}
            onChange={(e) => setNewQuickLink({ ...newQuickLink, label: e.target.value })}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Label"
          />
          <input
            type="text"
            value={newQuickLink.href}
            onChange={(e) => setNewQuickLink({ ...newQuickLink, href: e.target.value })}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="URL"
          />
          <button
            type="button"
            onClick={addQuickLink}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Social Links */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">
          Social Links
        </h3>
        <div className="space-y-3">
          {socialLinks.map((link, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <GripVertical className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <div className="flex-1 grid grid-cols-3 gap-3">
                <input
                  type="text"
                  value={link.name}
                  onChange={(e) => handleSocialLinkChange(index, "name", e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Name"
                />
                <input
                  type="text"
                  value={link.href}
                  onChange={(e) => handleSocialLinkChange(index, "href", e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="URL"
                />
                <select
                  value={link.icon}
                  onChange={(e) => handleSocialLinkChange(index, "icon", e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="facebook">Facebook</option>
                  <option value="instagram">Instagram</option>
                  <option value="tiktok">TikTok</option>
                </select>
              </div>
              <button
                type="button"
                onClick={() => removeSocialLink(index)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-3 flex items-center gap-3 p-3 border-2 border-dashed border-gray-300 rounded-lg">
          <input
            type="text"
            value={newSocialLink.name}
            onChange={(e) => setNewSocialLink({ ...newSocialLink, name: e.target.value })}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Name"
          />
          <input
            type="text"
            value={newSocialLink.href}
            onChange={(e) => setNewSocialLink({ ...newSocialLink, href: e.target.value })}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="URL"
          />
          <select
            value={newSocialLink.icon}
            onChange={(e) => setNewSocialLink({ ...newSocialLink, icon: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="facebook">Facebook</option>
            <option value="instagram">Instagram</option>
            <option value="tiktok">TikTok</option>
          </select>
          <button
            type="button"
            onClick={addSocialLink}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
