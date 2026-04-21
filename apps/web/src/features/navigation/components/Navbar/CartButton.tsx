"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { manrope } from "@/app/fonts";

export function CartButton() {
  const { cartItemCount, cartTotal } = useCart();

  const formattedTotal = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(cartTotal);

  return (
    <Link
      href="/cart"
      className="flex items-center gap-3 p-2 text-white rounded-lg transition-colors"
    >
      <div className="relative">
        <ShoppingCart className="w-6 h-6" />
        {cartItemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {cartItemCount}
          </span>
        )}
      </div>
      <div className="flex flex-col items-start">
        <span className={`text-sm lg:text-base font-bold leading-none ${manrope.className}`}>
          Cart
        </span>
      </div>
    </Link>
  );
}
