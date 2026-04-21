import React from "react";
import { SiteSettings } from "../types";
import { InputField } from "./FormFields";

interface PaymentSettingsProps {
  settings: SiteSettings;
  onChange: (field: keyof SiteSettings, value: any) => void;
}

export function PaymentSettings({ settings, onChange }: PaymentSettingsProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold custom-font text-gray-900 mb-4">
        Payment Settings
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="Tax Rate (%)"
          type="number"
          value={settings.taxRate}
          onChange={(v) => onChange("taxRate", Number(v))}
          placeholder="13"
        />
        <InputField
          label="Shipping Cost"
          type="number"
          value={settings.shippingCost}
          onChange={(v) => onChange("shippingCost", Number(v))}
          placeholder="100"
        />
      </div>
    </div>
  );
}
