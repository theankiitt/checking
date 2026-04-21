"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { COLORS } from "../constants";
import { pluralize } from "../utils";

interface CartHeaderProps {
  itemCount: number;
}

export function CartHeader({ itemCount }: CartHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
        <p className="text-gray-600 mt-1">
          {itemCount} {pluralize(itemCount, "item")} in your cart
        </p>
      </div>

      <Link
        href="/"
        className="hidden sm:flex items-center gap-2 font-medium transition-colors"
        style={{ color: COLORS.primary }}
        onMouseEnter={(e) => (e.currentTarget.style.color = COLORS.primaryDark)}
        onMouseLeave={(e) => (e.currentTarget.style.color = COLORS.primary)}
      >
        <ArrowLeft className="w-4 h-4" />
        Continue Shopping
      </Link>
    </div>
  );
}
