"use client";

import React, { createContext, useContext, useState } from "react";
import { clsx } from "clsx";

interface TabsContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

export const useTabs = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("useTabs must be used within a TabsProvider");
  }
  return context;
};

export interface TabsProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  defaultValue,
  value,
  onValueChange,
  children,
  className,
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue || "");
  const activeTab = value ?? internalValue;

  const setActiveTab = (tab: string) => {
    if (value === undefined) {
      setInternalValue(tab);
    }
    onValueChange?.(tab);
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
};

export interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

export const TabsList: React.FC<TabsListProps> = ({ children, className }) => {
  return (
    <div
      className={clsx(
        "inline-flex items-center justify-center gap-2",
        "border-b border-gray-200 dark:border-gray-700",
        className,
      )}
    >
      {children}
    </div>
  );
};

export interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export const TabsTrigger: React.FC<TabsTriggerProps> = ({
  value,
  children,
  className,
  disabled,
}) => {
  const { activeTab, setActiveTab } = useTabs();

  return (
    <button
      onClick={() => setActiveTab(value)}
      disabled={disabled}
      className={clsx(
        "px-4 py-2 text-sm font-medium",
        "border-b-2 -mb-[1px] transition-colors",
        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        activeTab === value
          ? "border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500"
          : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300",
        "dark:text-gray-400 dark:hover:text-gray-200",
        className,
      )}
    >
      {children}
    </button>
  );
};

export interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export const TabsContent: React.FC<TabsContentProps> = ({
  value,
  children,
  className,
}) => {
  const { activeTab } = useTabs();

  if (activeTab !== value) return null;

  return (
    <div
      className={clsx(
        "mt-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
        className,
      )}
    >
      {children}
    </div>
  );
};
