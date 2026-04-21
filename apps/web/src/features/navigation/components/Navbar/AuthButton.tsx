"use client";

import { bricolage } from "@/app/fonts";
import { useAuth } from "@/contexts/AuthContext";
import { User } from "lucide-react";

export function AuthButton() {
  const { openAuthModal } = useAuth();

  return (
    <button
      onClick={openAuthModal}
      className="flex items-center gap-2 p-2 text-white rounded-lg"
    >
      <User className="w-6 h-6" />
      <span className={`text-sm lg:text-base font-bold ${bricolage.className}`}>Sign in</span>
    </button>
  );
}
