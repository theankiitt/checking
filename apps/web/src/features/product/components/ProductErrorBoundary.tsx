"use client";

import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  title?: string;
}

interface State {
  hasError: boolean;
}

export class ProductErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[300px] flex items-center justify-center p-8 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="text-center">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {this.props.title || "Product Loading Error"}
            </h2>
            <p className="text-gray-600 mb-6">
              We couldn't load this product. Please try again.
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false });
                window.location.reload();
              }}
              className="px-6 py-3 bg-[#EB6426] text-white rounded-lg hover:bg-[#d65a1f] transition-colors font-semibold"
            >
              Reload
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ProductErrorBoundary;
