"use client";

import { useState, useCallback } from "react";
import { useMediaQuery } from "./useMediaQuery";

interface UseSidebarReturn {
  isOpen: boolean;
  isDesktop: boolean;
  isMobile: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;
}

export function useSidebar(): UseSidebarReturn {
  const { isDesktop, isMobile } = useMediaQuery();
  const [isOpen, setIsOpen] = useState(false);

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  return {
    isOpen: isDesktop ? true : isOpen,
    isDesktop,
    isMobile,
    toggle,
    open,
    close,
  };
}
