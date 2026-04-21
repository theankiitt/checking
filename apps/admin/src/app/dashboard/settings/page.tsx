"use client";

import { useState, useCallback, lazy, Suspense } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  Save,
  Database,
  CreditCard,
  Shield,
  Bell,
  Package,
  Search,
  BarChart3,
  Mail,
} from "lucide-react";
import toast from "react-hot-toast";
import DashboardLayout from "@/components/DashboardLayout";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useSiteSettings } from "./hooks/useSiteSettings";
import { TABS } from "./utils/constants";
import { TabKey } from "./types";
import {
  GeneralSettings,
  ContactSettings,
  BusinessSettings,
  PaymentSettings,
  NotificationSettings,
  SecuritySettings,
  InventorySettings,
  VariantSettings,
  SeoSettings,
  SkeletonSettings,
} from "./components";

const AnalyticsSettings = lazy(() =>
  import("./components/AnalyticsSettings").then((mod) => ({
    default: mod.AnalyticsSettings,
  })),
);

const TAB_DESCRIPTIONS: Record<TabKey, string> = {
  general: "Configure basic site information and branding",
  contact: "Manage contact details and location information",
  business: "Set up business operations and regional settings",
  payment: "Configure payment methods and pricing",
  notifications: "Manage notification preferences",
  security: "Configure security settings and authentication",
  inventory: "Set up inventory management preferences",
  "variant-management": "Manage product variant settings and options",
  seo: "Optimize search engine visibility and metadata",
  analytics: "Configure analytics and conversion tracking",
};

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Settings,
  Mail,
  Database,
  CreditCard,
  Bell,
  Shield,
  Package,
  Search,
  BarChart3,
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("general");
  const {
    settings,
    isLoading,
    isSaving,
    isUploading,
    error,
    saveSettings,
    uploadMedia,
    refetch,
  } = useSiteSettings();

  const handleSave = useCallback(async () => {
    try {
      await saveSettings();
      toast.success("Settings saved successfully");
    } catch (err) {
      toast.error("Failed to save settings");
    }
  }, [saveSettings]);

  const handleLogoUpload = useCallback(
    async (file: File) => {
      await uploadMedia(file);
    },
    [uploadMedia],
  );

  const handleFaviconUpload = useCallback(
    async (file: File) => {
      await uploadMedia(file);
    },
    [uploadMedia],
  );

  const handleChange = useCallback((field: string, value: any) => {}, []);

  const handleCancel = useCallback(() => {
    refetch();
    toast.success("Changes discarded");
  }, [refetch]);

  const renderTabContent = () => {
    if (isLoading && !settings) {
      return <SkeletonSettings />;
    }

    const props = {
      settings,
      onChange: handleChange,
      onBooleanChange: handleChange,
    };

    switch (activeTab) {
      case "general":
        return (
          <GeneralSettings
            {...props}
            onLogoUpload={handleLogoUpload}
            onFaviconUpload={handleFaviconUpload}
            isUploading={isUploading}
          />
        );
      case "contact":
        return <ContactSettings {...props} />;
      case "business":
        return <BusinessSettings {...props} />;
      case "payment":
        return <PaymentSettings {...props} />;
      case "notifications":
        return <NotificationSettings {...props} />;
      case "security":
        return <SecuritySettings {...props} />;
      case "inventory":
        return <InventorySettings {...props} />;
      case "variant-management":
        return <VariantSettings {...props} />;
      case "seo":
        return <SeoSettings {...props} />;
      case "analytics":
        return (
          <ErrorBoundary>
            <Suspense fallback={<SkeletonSettings />}>
              <AnalyticsSettings {...props} />
            </Suspense>
          </ErrorBoundary>
        );
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          {isLoading && !settings ? (
            <>
              <div className="h-9 w-48 bg-gray-200 rounded animate-pulse mb-2" />
              <div className="h-5 w-80 bg-gray-200 rounded animate-pulse" />
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold custom-font text-gray-900 mb-2">
                Site Settings
              </h1>
              <p className="text-gray-600 custom-font">
                Manage your site settings, appearance, and configurations
              </p>
            </>
          )}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 custom-font">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              {isLoading && !settings ? (
                <div className="space-y-1">
                  {[...Array(11)].map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center space-x-3 px-3 py-3"
                    >
                      <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
                      <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                    </div>
                  ))}
                </div>
              ) : (
                <nav className="space-y-1">
                  {TABS.map((tab) => {
                    const Icon = ICON_MAP[tab.icon] || Settings;
                    return (
                      <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left transition-all duration-200 text-sm font-medium custom-font ${
                          activeTab === tab.key
                            ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600"
                            : "text-gray-700 hover:bg-gray-50 hover:text-gray-900 border-l-4 border-transparent"
                        }`}
                      >
                        <Icon className="w-5 h-5 flex-shrink-0" />
                        <span className="truncate">{tab.label}</span>
                      </button>
                    );
                  })}
                </nav>
              )}
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                {isLoading && !settings ? (
                  <>
                    <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-1" />
                    <div className="h-4 w-64 bg-gray-200 rounded animate-pulse" />
                  </>
                ) : (
                  <>
                    <h2 className="text-lg font-semibold custom-font text-gray-900">
                      {TABS.find((tab) => tab.key === activeTab)?.label ||
                        "Settings"}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      {TAB_DESCRIPTIONS[activeTab]}
                    </p>
                  </>
                )}
              </div>

              <div className="p-6">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderTabContent()}
                </motion.div>
              </div>

              <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex justify-end space-x-3">
                <button
                  onClick={handleCancel}
                  disabled={isSaving || (isLoading && !settings)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 custom-font font-medium disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving || (isLoading && !settings)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed custom-font font-medium flex items-center space-x-2"
                >
                  <Save
                    className={`w-4 h-4 ${isSaving ? "animate-spin" : ""}`}
                  />
                  <span>
                    {isSaving
                      ? "Saving..."
                      : isLoading && !settings
                        ? "Loading..."
                        : "Save Changes"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
