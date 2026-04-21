"use client";

import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import { CartItem, OrderSummary, EmptyCart, CartHeader } from "./components";
import { useCartCalculations, usePromoCode } from "./hooks";
import { manrope } from "../fonts";

export default function CartPage() {
  const {
    cartItems,
    cartItemCount,
    cartTotal,
    updateQuantity,
    removeFromCart,
  } = useCart();
  const { discount, applyPromo, removePromo, promoCode } = usePromoCode();
  const calculations = useCartCalculations({ subtotal: cartTotal, discount });

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

        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
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

            <div className="mt-6 flex items-center justify-between sm:hidden">
              <Link
                href="/"
                className="flex items-center gap-2 hover:opacity-80 font-medium"
                style={{ color: "var(--color-primary, #EB6426)" }}
              >
                Continue Shopping
              </Link>
              <span className="text-sm text-gray-500">
                Shipping calculated at checkout
              </span>
            </div>
          </div>

          <div className="mt-8 lg:mt-0 lg:col-span-5">
            <div className="sticky top-8">
              <OrderSummary
                subtotal={calculations.subtotal}
                total={calculations.total}
                discount={calculations.discount}
                itemCount={cartItemCount}
                promoCode={promoCode}
                onApplyPromo={applyPromo}
                onRemovePromo={removePromo}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
