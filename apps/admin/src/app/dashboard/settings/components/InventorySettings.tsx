import React from "react";
import { SiteSettings } from "../types";
import { InputField, CheckboxField } from "./FormFields";

interface InventorySettingsProps {
  settings: SiteSettings;
  onChange: (field: keyof SiteSettings, value: any) => void;
  onBooleanChange: (field: keyof SiteSettings, value: boolean) => void;
}

export function InventorySettings({
  settings,
  onChange,
  onBooleanChange,
}: InventorySettingsProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold custom-font text-gray-900 mb-4">
        Inventory Settings
      </h3>
      <div className="space-y-4">
        <InputField
          label="Low Stock Threshold"
          type="number"
          value={settings.lowStockThreshold}
          onChange={(v) => onChange("lowStockThreshold", Number(v))}
          placeholder="5"
        />
        <CheckboxField
          label="Auto Reorder"
          description="Automatically create purchase orders when stock is low"
          checked={settings.autoReorder}
          onChange={(v) => onBooleanChange("autoReorder", v)}
        />
        <CheckboxField
          label="Track Inventory"
          description="Enable inventory tracking for all products"
          checked={settings.trackInventory}
          onChange={(v) => onBooleanChange("trackInventory", v)}
        />
      </div>
    </div>
  );
}
