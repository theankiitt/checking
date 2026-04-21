"use client";

import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class CheckoutErrorBoundary extends Component<Props, State> {
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
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-md w-full text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Checkout Unavailable
            </h2>
            <p className="text-gray-600 mb-6">
              We're sorry, but there was an error loading the checkout. Please
              try again.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => {
                  this.setState({ hasError: false });
                  window.location.reload();
                }}
                className="px-6 py-3 bg-[#EB6426] text-white rounded-lg hover:bg-[#d65a1f] transition-colors font-semibold"
              >
                Try Again
              </button>
              <a
                href="/cart"
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
              >
                Return to Cart
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default CheckoutErrorBoundary;
