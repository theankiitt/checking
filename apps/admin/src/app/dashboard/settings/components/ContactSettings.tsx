import React from "react";
import { SiteSettings } from "../types";
import { InputField } from "./FormFields";

interface ContactSettingsProps {
  settings: SiteSettings;
  onChange: (field: keyof SiteSettings, value: any) => void;
}

export function ContactSettings({ settings, onChange }: ContactSettingsProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold custom-font text-gray-900 mb-4">
        Contact Information
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="Email"
          type="email"
          value={settings.email}
          onChange={(v) => onChange("email", v)}
          placeholder="contact@example.com"
        />
        <InputField
          label="Phone"
          type="tel"
          value={settings.phone}
          onChange={(v) => onChange("phone", v)}
          placeholder="+977-98XXXXXXXX"
        />
        <InputField
          label="Address"
          value={settings.address}
          onChange={(v) => onChange("address", v)}
          placeholder="123 Main Street"
        />
        <InputField
          label="City"
          value={settings.city}
          onChange={(v) => onChange("city", v)}
          placeholder="Kathmandu"
        />
        <InputField
          label="Country"
          value={settings.country}
          onChange={(v) => onChange("country", v)}
          placeholder="Nepal"
        />
      </div>
    </div>
  );
}
