"use client";

import Link from "next/link";
import {
  ChevronDown,
  UserCircle,
  Package,
  Heart,
  Scissors,
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

export function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useClickOutside<HTMLDivElement>(() => setIsOpen(false));

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
          U
        </div>
        <span className="text-sm font-bold hidden md:inline">
          Account
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
