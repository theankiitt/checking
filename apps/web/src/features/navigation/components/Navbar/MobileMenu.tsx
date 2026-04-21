"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  ChevronRight,
  ChevronLeft,
  User,
  ShoppingCart,
} from "lucide-react";
import SearchBar from "../SearchBar";
import { NavItem, SiteSettings } from "./types";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navigationItems: NavItem[];
  siteSettings: SiteSettings;
}

export function MobileMenu({
  isOpen,
  onClose,
  navigationItems,
  siteSettings,
}: MobileMenuProps) {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { openAuthModal } = useAuth();
  const { cartItemCount } = useCart();

  const handleClose = () => {
    onClose();
    setActiveDropdown(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleClose}
          />
          <motion.div
            className="fixed left-0 top-0 bottom-0 w-full max-w-sm bg-gradient-to-b from-white to-gray-50 shadow-2xl z-50 overflow-y-auto"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            <div className="sticky top-0 bg-gradient-to-r from-[#EB6426] to-[#4a1f18]">
              <div className="px-4 py-3 flex items-center justify-between border-b border-white/20">
                <Link
                  href="/"
                  className="flex items-center flex-shrink-0"
                  onClick={handleClose}
                >
                  {siteSettings.siteLogo && (
                    <img
                      src={siteSettings.siteLogo}
                      alt={siteSettings.siteName}
                      className="h-10 w-auto object-contain"
                    />
                  )}
                  <img
                    src="/main.png"
                    alt="GharSamma Logo"
                    className="h-8 w-28 object-contain"
                  />
                </Link>
                <div className="flex items-center gap-2">
                  <Link
                    href="/cart"
                    onClick={handleClose}
                    className="relative p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    {cartItemCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-yellow-400 text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {cartItemCount}
                      </span>
                    )}
                  </Link>
                  <button
                    onClick={() => {
                      handleClose();
                      openAuthModal();
                    }}
                    className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <User className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="px-4 py-3 flex items-center justify-between">
                <h2 className="text-white text-lg font-bold">
                  {activeDropdown
                    ? navigationItems.find((item) => item.id === activeDropdown)
                        ?.label
                    : "Menu"}
                </h2>
                <div className="flex items-center gap-2">
                  {activeDropdown && (
                    <button
                      onClick={() => setActiveDropdown(null)}
                      className="text-white hover:bg-[#F0F2F5]/20 p-2 rounded-lg transition-colors"
                    >
                      <ChevronRight className="w-6 h-6 rotate-180" />
                    </button>
                  )}
                  <button
                    onClick={handleClose}
                    className="text-white hover:bg-[#F0F2F5]/20 p-2 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {!activeDropdown ? (
                <motion.nav
                  key="main-menu"
                  className="flex flex-col font-extrabold text-black font-inter"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {navigationItems.map((item) => (
                    <div key={item.id} className="border-b border-gray-100">
                      {item.type === "dropdown" ? (
                        <button
                          onClick={() => setActiveDropdown(item.id)}
                          className="block py-3 px-6 hover:bg-gray-50 text-sm w-full text-left flex items-center justify-between"
                        >
                          <span>{item.label}</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      ) : (
                        <Link
                          href={item.href}
                          onClick={handleClose}
                          className="block py-3 px-6 hover:bg-gray-50 text-sm"
                        >
                          {item.label}
                        </Link>
                      )}
                    </div>
                  ))}
                </motion.nav>
              ) : (
                <motion.nav
                  key="dropdown-menu"
                  className="flex flex-col"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="bg-gray-100 px-4 py-2 flex items-center">
                    <button
                      onClick={() => setActiveDropdown(null)}
                      className="flex items-center text-sm font-bold text-gray-700"
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" /> Back
                    </button>
                  </div>
                  {navigationItems
                    .filter((i) => i.id === activeDropdown)
                    .map((item) => (
                      <div key={item.id}>
                        {item.columns?.map((column, idx) => (
                          <div
                            key={idx}
                            className="px-4 py-3 border-b border-gray-200"
                          >
                            <div className="font-semibold text-gray-800 text-lg mb-1">
                              {column.title}
                            </div>
                            {column.groups?.map((group, grpIdx) => (
                              <div key={grpIdx} className="mb-3">
                                <div className="text-gray-600 text-sm mb-2 font-medium">
                                  {group.title}
                                </div>
                                <div className="space-y-2">
                                  {group.items.map((subItem, subIdx) => (
                                    <Link
                                      key={subIdx}
                                      href={subItem.href}
                                      onClick={handleClose}
                                      className="block py-2 px-4 bg-gray-50 hover:bg-blue-50 text-gray-800 rounded-lg"
                                    >
                                      {subItem.label}
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            ))}
                            {column.items && column.items.length > 0 && (
                              <div className="space-y-2">
                                {column.items.map((subItem, subIdx) => (
                                  <Link
                                    key={subIdx}
                                    href={subItem.href}
                                    onClick={handleClose}
                                    className="block py-2 px-4 bg-gray-50 hover:bg-blue-50 text-gray-800 rounded-lg"
                                  >
                                    {subItem.label}
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ))}
                </motion.nav>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
