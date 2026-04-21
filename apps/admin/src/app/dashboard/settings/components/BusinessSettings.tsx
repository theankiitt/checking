import React from "react";
import { SiteSettings } from "../types";
import { SelectField } from "./FormFields";
import { TIMEZONES, LANGUAGES } from "../utils/constants";

interface BusinessSettingsProps {
  settings: SiteSettings;
  onChange: (field: keyof SiteSettings, value: any) => void;
}

export function BusinessSettings({
  settings,
  onChange,
}: BusinessSettingsProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold custom-font text-gray-900 mb-4">
        Business Settings
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SelectField
          label="Currency"
          value={settings.currency}
          onChange={(v) => onChange("currency", v)}
          options={["NPR", "USD", "EUR", "GBP"]}
        />
        <SelectField
          label="Timezone"
          value={settings.timezone}
          onChange={(v) => onChange("timezone", v)}
          options={TIMEZONES}
        />
        <SelectField
          label="Language"
          value={settings.language}
          onChange={(v) => onChange("language", v)}
          options={LANGUAGES.map((l) => l.value)}
        />
      </div>
    </div>
  );
}
