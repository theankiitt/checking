"use client";

import { RefreshCw, AlertTriangle } from "lucide-react";
import { Button } from "./button";

interface ErrorFallbackProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorFallback({
  message = "Something went wrong",
  onRetry,
}: ErrorFallbackProps) {
  return (
    <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
        <AlertTriangle className="w-8 h-8 text-red-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{message}</h3>
      {onRetry && (
        <Button onClick={onRetry} variant="danger">
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      )}
    </div>
  );
}

interface PageErrorProps {
  error?: Error | string;
  onRetry?: () => void;
}

export function PageError({ error, onRetry }: PageErrorProps) {
  const message =
    typeof error === "string" ? error : error?.message || "Failed to load data";

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      <ErrorFallback message={message} onRetry={onRetry} />
    </div>
  );
}
