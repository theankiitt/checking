"use client";

import Link from "next/link";
import { ShoppingCart, ArrowRight } from "lucide-react";
import { COLORS } from "../constants";
import Image from "next/image";
import { manrope } from "../../fonts";

export function EmptyCart() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <Image
          src="/icons/cart.png"
          alt="Cart"
          width={100}
          height={100}
          className="mx-auto mb-6"
        />

        <h1
          className={`text-3xl font-bold text-gray-900 mb-4 ${manrope.className}`}
        >
          Your cart is empty
        </h1>

        <p className="text-gray-600 mb-8">
          Looks like you haven&apos;t added any items to your cart yet. Start
          exploring our collection of authentic Nepali products.
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-white transition-colors"
          style={{
            backgroundColor: COLORS.primary,
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = COLORS.primaryDark)
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = COLORS.primary)
          }
        >
          Start Shopping
          
        </Link>
      </div>
    </div>
  );
}
