"use client";

import { memo, useCallback } from "react";
import Image from "next/image";
import { Minus, Plus, Trash2, Truck } from "lucide-react";
import { COLORS } from "../constants";
import { formatPrice } from "../utils";
import type { CartItemProps } from "../types";

export const CartItem = memo(function CartItem({
  item,
  onUpdateQuantity,
  onRemove,
}: CartItemProps) {
  const handleDecrease = useCallback(() => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.id, item.quantity - 1);
    }
  }, [item.id, item.quantity, onUpdateQuantity]);

  const handleIncrease = useCallback(() => {
    onUpdateQuantity(item.id, item.quantity + 1);
  }, [item.id, item.quantity, onUpdateQuantity]);

  const handleRemove = useCallback(() => {
    onRemove(item.id);
  }, [item.id, onRemove]);

  const itemTotal = item.price * item.quantity;

  const getImageUrl = (url?: string) => {
    if (!url) return "/gharsamma-logo.png";
    if (url.startsWith("blob:")) return url;
    if (url.startsWith("http")) return url;
    if (url.startsWith("/uploads/")) {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4444";
      return `${baseUrl}${url}`;
    }
    if (url.startsWith("/")) {
      return url;
    }
    return `/uploads/${url}`;
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const deliveryDate = formatDate(item.deliveryDate);

  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 sm:p-6 bg-white border-b border-gray-100 last:border-b-0 transition-colors hover:bg-gray-50/50">
      <div className="w-full sm:w-28 h-28 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden relative">
        <Image
          src={getImageUrl(item.image)}
          alt={item.name}
          fill
          className="object-cover"
          sizes="112px"
          priority={false}
          onError={(e) => {
            e.currentTarget.src = "/product-placeholder.svg";
          }}
        />
      </div>

      <div className="flex-1 flex flex-col justify-between">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 line-clamp-2">
              {item.name}
            </h3>
            {item.variant && (
              <p className="text-sm text-gray-500 mt-1">{item.variant}</p>
            )}
            <p className="font-bold mt-2" style={{ color: COLORS.primary }}>
              {formatPrice(item.price)}
            </p>
          </div>

          <button
            onClick={handleRemove}
            className="text-gray-400 hover:text-red-500 p-2 transition-colors flex-shrink-0"
            aria-label={`Remove ${item.name} from cart`}
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-3">
            <button
              onClick={handleDecrease}
              disabled={item.quantity <= 1}
              className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:border-[#EB6426] hover:text-[#EB6426]"
              aria-label="Decrease quantity"
            >
              <Minus className="w-4 h-4" />
            </button>

            <span
              className="w-8 text-center font-semibold"
              aria-label={`Quantity: ${item.quantity}`}
            >
              {item.quantity}
            </span>

            <button
              onClick={handleIncrease}
              className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 transition-all hover:border-[#EB6426] hover:text-[#EB6426]"
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="text-right">
            <p className="font-bold text-gray-900">{formatPrice(itemTotal)}</p>
            {item.quantity > 1 && (
              <p className="text-xs text-gray-500">
                {formatPrice(item.price)} each
              </p>
            )}
          </div>
        </div>

        {deliveryDate && (
          <div className="mt-3 flex items-center gap-2 text-sm text-green-700 bg-green-50 px-3 py-2 rounded-lg">
            <Truck className="w-4 h-4 flex-shrink-0" />
            <span>
              Delivery by <span className="font-semibold">{deliveryDate}</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
});
