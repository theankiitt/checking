"use client";

import { memo, useState, useCallback } from "react";
import Link from "next/link";
import { ShieldCheck, Tag, ChevronRight, X, Check, Truck } from "lucide-react";
import { COLORS, CART_CONSTANTS } from "../constants";
import { formatPrice } from "../utils";
import type { OrderSummaryProps } from "../types";

export const OrderSummary = memo(function OrderSummary({
  subtotal,
  total,
  discount,
  itemCount,
  promoCode,
  onApplyPromo,
  onRemovePromo,
}: OrderSummaryProps) {
  const [inputCode, setInputCode] = useState(promoCode || "");
  const [showSuccess, setShowSuccess] = useState(false);

  const handleApply = useCallback(() => {
    if (inputCode.trim() && onApplyPromo) {
      onApplyPromo(inputCode);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    }
  }, [inputCode, onApplyPromo]);

  const handleRemove = useCallback(() => {
    setInputCode("");
    onRemovePromo?.();
  }, [onRemovePromo]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">
              Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})
            </span>
            <span className="font-medium">{formatPrice(subtotal)}</span>
          </div>

          {discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount ({promoCode})</span>
              <span className="font-medium">-{formatPrice(discount)}</span>
            </div>
          )}

          <div className="flex justify-between">
            <span className="text-gray-600">Shipping</span>
            <span className="font-medium text-green-600">FREE</span>
          </div>

          <div className="border-t border-gray-200 pt-3 mt-3">
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span style={{ color: COLORS.primary }}>
                {formatPrice(total)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 border-b border-gray-100 bg-gray-50">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Promo code"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value.toUpperCase())}
              disabled={!!promoCode}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EB6426] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
              aria-label="Enter promo code"
            />
          </div>

          {promoCode ? (
            <button
              onClick={handleRemove}
              className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              Remove
            </button>
          ) : (
            <button
              onClick={handleApply}
              disabled={!inputCode.trim()}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
            >
              Apply
            </button>
          )}
        </div>

        {showSuccess && (
          <div className="flex items-center gap-2 text-xs text-green-600 mt-2">
            <Check className="w-3 h-3" />
            Promo code applied successfully!
          </div>
        )}
      </div>

      <div className="p-6 space-y-3">
        <Link
          href="/checkout"
          className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-lg font-bold text-white transition-colors"
          style={{ backgroundColor: COLORS.primary }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = COLORS.primaryDark)
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = COLORS.primary)
          }
        >
          Proceed to Checkout
          <ChevronRight className="w-5 h-5" />
        </Link>

        <Link
          href="/"
          className="w-full block text-center py-4 px-6 rounded-lg font-medium border border-gray-300 hover:bg-gray-50 transition-colors text-sm text-gray-700"
        >
          Continue Shopping
        </Link>
      </div>

      <div className="px-6 pb-6">
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <Truck className="w-5 h-5" style={{ color: COLORS.primary }} />
            <span>Free shipping on all orders</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <ShieldCheck
              className="w-5 h-5"
              style={{ color: COLORS.primary }}
            />
            <span>Secure checkout guaranteed</span>
          </div>
        </div>
      </div>
    </div>
  );
});
