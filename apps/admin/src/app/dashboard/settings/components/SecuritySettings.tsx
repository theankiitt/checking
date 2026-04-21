import React from "react";
import { SiteSettings } from "../types";
import { InputField, SelectField, CheckboxField } from "./FormFields";
import { PASSWORD_POLICIES } from "../utils/constants";

interface SecuritySettingsProps {
  settings: SiteSettings;
  onChange: (field: keyof SiteSettings, value: any) => void;
  onBooleanChange: (field: keyof SiteSettings, value: boolean) => void;
}

export function SecuritySettings({
  settings,
  onChange,
  onBooleanChange,
}: SecuritySettingsProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold custom-font text-gray-900 mb-4">
        Security Settings
      </h3>
      <div className="space-y-4">
        <CheckboxField
          label="Two-Factor Authentication"
          description="Require 2FA for all admin users"
          checked={settings.twoFactorAuth}
          onChange={(v) => onBooleanChange("twoFactorAuth", v)}
        />
        <InputField
          label="Session Timeout (minutes)"
          type="number"
          value={settings.sessionTimeout}
          onChange={(v) => onChange("sessionTimeout", Number(v))}
          placeholder="30"
        />
        <SelectField
          label="Password Policy"
          value={settings.passwordPolicy}
          onChange={(v) => onChange("passwordPolicy", v)}
          options={PASSWORD_POLICIES.map((p) => p.value)}
        />
      </div>
    </div>
  );
}
