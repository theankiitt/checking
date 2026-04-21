import React from "react";
import { SiteSettings } from "../types";
import { InputField, CheckboxField, TextAreaField } from "./FormFields";
import { BarChart3, TrendingUp } from "lucide-react";

interface AnalyticsSettingsProps {
  settings: SiteSettings;
  onChange: (field: keyof SiteSettings, value: any) => void;
  onBooleanChange: (field: keyof SiteSettings, value: boolean) => void;
}

export function AnalyticsSettings({
  settings,
  onChange,
  onBooleanChange,
}: AnalyticsSettingsProps) {
  return (
    <div className="space-y-8">
      <h3 className="text-lg font-semibold custom-font text-gray-900 mb-6 flex items-center space-x-2">
        <BarChart3 className="w-5 h-5 text-blue-600" />
        <span>Analytics & Conversion Tracking</span>
      </h3>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-md font-medium custom-font text-gray-900 mb-4 flex items-center space-x-2">
          <TrendingUp className="w-4 h-4 text-green-600" />
          <span>Google Analytics</span>
        </h4>

        <div className="space-y-4">
          <CheckboxField
            label="Enable Google Analytics"
            checked={settings.googleAnalyticsEnabled}
            onChange={(v) => onBooleanChange("googleAnalyticsEnabled", v)}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Measurement ID (G-XXXXXXXXXX)"
              value={settings.googleAnalyticsMeasurementId}
              onChange={(v) => onChange("googleAnalyticsMeasurementId", v)}
              placeholder="G-XXXXXXXXXX"
            />
            <InputField
              label="Tracking ID (UA-XXXXXXXX-X)"
              value={settings.googleAnalyticsTrackingId}
              onChange={(v) => onChange("googleAnalyticsTrackingId", v)}
              placeholder="UA-XXXXXXXX-X"
            />
          </div>

          <CheckboxField
            label="Enable Enhanced Ecommerce"
            checked={settings.enhancedEcommerceEnabled}
            onChange={(v) => onBooleanChange("enhancedEcommerceEnabled", v)}
          />
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-md font-medium custom-font text-gray-900 mb-4 flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">G</span>
          </div>
          <span>Google Ads Conversion Tracking</span>
        </h4>

        <div className="space-y-4">
          <CheckboxField
            label="Enable Google Ads Conversion Tracking"
            checked={settings.googleAdsEnabled}
            onChange={(v) => onBooleanChange("googleAdsEnabled", v)}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Conversion ID"
              value={settings.googleAdsConversionId}
              onChange={(v) => onChange("googleAdsConversionId", v)}
              placeholder="123456789"
            />
            <InputField
              label="Conversion Label"
              value={settings.googleAdsConversionLabel}
              onChange={(v) => onChange("googleAdsConversionLabel", v)}
              placeholder="abcdefgHIjklmnOPQ"
            />
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-md font-medium custom-font text-gray-900 mb-4 flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-700 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">f</span>
          </div>
          <span>Meta (Facebook) Conversion API</span>
        </h4>

        <div className="space-y-4">
          <CheckboxField
            label="Enable Facebook Conversion API"
            checked={settings.facebookConversionApiEnabled}
            onChange={(v) => onBooleanChange("facebookConversionApiEnabled", v)}
          />

          <InputField
            label="Access Token"
            type="password"
            value={settings.facebookConversionApiToken}
            onChange={(v) => onChange("facebookConversionApiToken", v)}
            placeholder="EAACEdEose0cBA..."
          />

          <CheckboxField
            label="Enable Advanced Matching"
            checked={settings.facebookPixelAdvancedMatching}
            onChange={(v) =>
              onBooleanChange("facebookPixelAdvancedMatching", v)
            }
          />
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-md font-medium custom-font text-gray-900 mb-4">
          Custom Tracking Scripts
        </h4>
        <TextAreaField
          label="Additional Tracking Code"
          value={settings.customTrackingScripts}
          onChange={(v) => onChange("customTrackingScripts", v)}
          rows={6}
          placeholder="Add custom JavaScript tracking code here..."
        />
        <p className="text-sm text-gray-500 mt-2">
          This code will be inserted before the closing &lt;/body&gt; tag on all
          pages.
        </p>
      </div>
    </div>
  );
}
