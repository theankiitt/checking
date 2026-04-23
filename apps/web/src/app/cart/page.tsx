"use client";

import { useCart } from "@/contexts/CartContext";
import { CartItem, EmptyCart, CartHeader } from "./components";
import { manrope } from "../fonts";
import Link from "next/link";

export default function CartPage() {
  const {
    cartItems,
    cartItemCount,
    updateQuantity,
    removeFromCart,
  } = useCart();

  if (cartItemCount === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <EmptyCart />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-50 ${manrope.className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CartHeader itemCount={cartItemCount} />

        <div className="max-w-3xl mx-auto lg:max-w-4xl">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">Cart Items</h2>
                <Link
                  href="/"
                  className="sm:hidden text-sm hover:opacity-80 font-medium"
                  style={{ color: "var(--color-primary, #EB6426)" }}
                >
                  Add more items
                </Link>
              </div>
            </div>

            <div role="list" aria-label="Shopping cart items">
              {cartItems.map((item) => (
                <div key={item.id} role="listitem">
                  <CartItem
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeFromCart}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
              <div className="text-sm text-amber-800">
                <p className="font-semibold mb-1">Order Requirements</p>
                <p>Minimum order quantity: 5 kg. Final order confirmation will be done after our sales team has a conversation with you.</p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <Link
              href="/checkout"
              className="w-full bg-[#EB6426] text-white py-4 rounded-xl font-semibold hover:bg-[#d55a21] transition-all text-center block shadow-md hover:shadow-lg"
            >
              Proceed to Inquiry
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
