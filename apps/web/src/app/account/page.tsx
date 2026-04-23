"use client";

import { useRouter } from "next/navigation";
import { User, Package, Heart, Settings } from "lucide-react";
import Link from "next/link";

export default function AccountPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Account</h1>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#EB6426] text-white flex items-center justify-center font-bold text-2xl">
              U
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">User</h2>
              <p className="text-gray-600">Welcome to your account</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/orders"
            className="bg-white rounded-lg shadow-sm p-6 flex items-center gap-4 hover:shadow-md transition-shadow"
          >
            <Package className="w-10 h-10 text-[#EB6426]" />
            <div>
              <h3 className="font-semibold text-gray-900">My Orders</h3>
              <p className="text-sm text-gray-600">
                Track, return, or buy again
              </p>
            </div>
          </Link>

          <Link
            href="/wishlist"
            className="bg-white rounded-lg shadow-sm p-6 flex items-center gap-4 hover:shadow-md transition-shadow"
          >
            <Heart className="w-10 h-10 text-[#EB6426]" />
            <div>
              <h3 className="font-semibold text-gray-900">My Wishlist</h3>
              <p className="text-sm text-gray-600">Your saved items</p>
            </div>
          </Link>

          <Link
            href="/account"
            className="bg-white rounded-lg shadow-sm p-6 flex items-center gap-4 hover:shadow-md transition-shadow"
          >
            <User className="w-10 h-10 text-[#EB6426]" />
            <div>
              <h3 className="font-semibold text-gray-900">Account Settings</h3>
              <p className="text-sm text-gray-600">Edit profile, password</p>
            </div>
          </Link>

          <Link
            href="/cart"
            className="bg-white rounded-lg shadow-sm p-6 flex items-center gap-4 hover:shadow-md transition-shadow"
          >
            <Settings className="w-10 h-10 text-[#EB6426]" />
            <div>
              <h3 className="font-semibold text-gray-900">Shopping Cart</h3>
              <p className="text-sm text-gray-600">View and manage cart</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
