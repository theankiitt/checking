"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import {
  ChevronDown,
  UserCircle,
  Package,
  Heart,
  Scissors,
  LogOut,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useClickOutside } from "./hooks";

const USER_MENU_ITEMS = [
  { href: "/account", icon: UserCircle, label: "My Account" },
  { href: "/orders", icon: Package, label: "My Orders" },
  { href: "/wishlist", icon: Heart, label: "My Wishlist" },
  { href: "/customization", icon: Scissors, label: "Request Customization" },
];

interface UserMenuProps {
  user: {
    name?: string | null;
    email?: string | null;
  };
}

export function UserMenu({ user }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useClickOutside<HTMLDivElement>(() => setIsOpen(false));

  const initial =
    user.name?.charAt(0)?.toUpperCase() ||
    user.email?.charAt(0)?.toUpperCase() ||
    "U";
  const displayName = user.name?.split(" ")[0] || "Account";

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 text-white rounded-lg transition-colors hover:bg-orange-700"
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-controls="user-menu"
      >
        <div className="w-8 h-8 rounded-full bg-white text-[#EB6426] flex items-center justify-center font-bold">
          {initial}
        </div>
        <span className="text-sm font-bold hidden md:inline">
          {displayName}
        </span>
        <ChevronDown className="w-4 h-4" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="user-menu"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50"
            role="menu"
          >
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {user.name || "User"}
              </p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>

            {USER_MENU_ITEMS.map(({ href, icon: Icon, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                role="menuitem"
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}

            <div className="border-t border-gray-100 mt-1 pt-1">
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors w-full"
                role="menuitem"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
