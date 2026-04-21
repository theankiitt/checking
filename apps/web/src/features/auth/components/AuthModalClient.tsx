"use client";

import AuthModal from "./AuthModal";
import { useState, useEffect } from "react";

export default function AuthModalClient() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleOpenAuthModal = () => setIsOpen(true);
    window.addEventListener("openAuthModal", handleOpenAuthModal);
    return () =>
      window.removeEventListener("openAuthModal", handleOpenAuthModal);
  }, []);

  return <AuthModal isOpen={isOpen} onClose={() => setIsOpen(false)} />;
}
