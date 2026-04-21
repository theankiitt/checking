"use client";

import { Component, type ReactNode, type ErrorInfo } from "react";
import { RefreshCw, AlertTriangle, Loader2 } from "lucide-react";

interface ErrorUIConfig {
  title?: string;
  message?: string;
  buttonText?: string;
  showErrorId?: boolean;
  containerClassName?: string;
}

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  errorUI?: ErrorUIConfig;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorId?: string;
  isRetrying: boolean;
}

const DEFAULT_ERROR_UI: Required<ErrorUIConfig> = {
  title: "Something went wrong",
  message: "An unexpected error occurred. Please try again.",
  buttonText: "Try Again",
  showErrorId: true,
  containerClassName:
    "bg-white p-6 rounded-lg shadow-sm border border-gray-200",
};

export class ErrorBoundary extends Component<Props, State> {
  private retryTimeoutId?: ReturnType<typeof setTimeout>;

  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, isRetrying: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorId: crypto.randomUUID(),
      isRetrying: false,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.props.onError?.(error, errorInfo);
  }

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
  }

  handleRetry = () => {
    this.setState({ isRetrying: true });

    this.retryTimeoutId = setTimeout(() => {
      this.setState({
        hasError: false,
        error: undefined,
        errorId: undefined,
        isRetrying: false,
      });
    }, 500);
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const errorUI = { ...DEFAULT_ERROR_UI, ...this.props.errorUI };

      return (
        <div
          role="alert"
          aria-live="assertive"
          className={errorUI.containerClassName}
        >
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {errorUI.title}
            </h3>

            <p className="text-gray-500 mb-4 text-sm">
              {this.state.error?.message || errorUI.message}
            </p>

            {errorUI.showErrorId && this.state.errorId && (
              <p className="text-xs text-gray-400 mb-4 font-mono">
                Error ID: {this.state.errorId.slice(0, 8)}
              </p>
            )}

            <button
              onClick={this.handleRetry}
              disabled={this.state.isRetrying}
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {this.state.isRetrying ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Retrying...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  {errorUI.buttonText}
                </>
              )}
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
