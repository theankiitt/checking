import React from "react";
import { SiteSettings } from "../types";
import { CheckboxField } from "./FormFields";

interface NotificationSettingsProps {
  settings: SiteSettings;
  onBooleanChange: (field: keyof SiteSettings, value: boolean) => void;
}

export function NotificationSettings({
  settings,
  onBooleanChange,
}: NotificationSettingsProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold custom-font text-gray-900 mb-4">
        Notification Settings
      </h3>
      <div className="space-y-4">
        <CheckboxField
          label="Email Notifications"
          description="Receive notifications via email"
          checked={settings.emailNotifications}
          onChange={(v) => onBooleanChange("emailNotifications", v)}
        />
        <CheckboxField
          label="SMS Notifications"
          description="Receive notifications via SMS"
          checked={settings.smsNotifications}
          onChange={(v) => onBooleanChange("smsNotifications", v)}
        />
        <CheckboxField
          label="Push Notifications"
          description="Receive push notifications in browser"
          checked={settings.pushNotifications}
          onChange={(v) => onBooleanChange("pushNotifications", v)}
        />
      </div>
    </div>
  );
}
