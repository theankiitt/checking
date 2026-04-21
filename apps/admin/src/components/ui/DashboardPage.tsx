"use client";

import { type ReactNode } from "react";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { PageLoading } from "./LoadingSpinner";
import { PageHeader } from "./PageHeader";

interface DashboardPageProps {
  children: ReactNode;
  loading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
  title: string;
  description?: string;
  action?: ReactNode;
  header?: boolean;
}

export function DashboardPage({
  children,
  loading,
  error,
  onRetry,
  title,
  description,
  action,
  header = true,
}: DashboardPageProps) {
  const content = loading ? (
    <PageLoading />
  ) : error ? (
    <ErrorFallback error={error} onRetry={onRetry} />
  ) : (
    <div className="space-y-6">
      {header && (
        <PageHeader title={title} description={description} action={action} />
      )}
      {children}
    </div>
  );

  return (
    <ErrorBoundary>
      <DashboardLayoutWrapper>{content}</DashboardLayoutWrapper>
    </ErrorBoundary>
  );
}

function ErrorFallback({
  error,
  onRetry,
}: {
  error: Error;
  onRetry?: () => void;
}) {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <p className="text-red-600 mb-2">
          {error.message || "Failed to load data"}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
}

function DashboardLayoutWrapper({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
