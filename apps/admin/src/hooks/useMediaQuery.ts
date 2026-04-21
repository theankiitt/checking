"use client";

import { useState, useEffect, useCallback } from "react";
import { BREAKPOINTS } from "@/lib/utils";

interface UseMediaQueryReturn {
  isDesktop: boolean;
  isMobile: boolean;
  isTablet: boolean;
}

export function useMediaQuery(): UseMediaQueryReturn {
  const [state, setState] = useState<UseMediaQueryReturn>({
    isDesktop: false,
    isMobile: false,
    isTablet: false,
  });

  const handleChange = useCallback(() => {
    if (typeof window === "undefined") return;

    const width = window.innerWidth;
    setState({
      isDesktop: width >= BREAKPOINTS.DESKTOP,
      isMobile: width < BREAKPOINTS.MOBILE,
      isTablet: width >= BREAKPOINTS.MOBILE && width < BREAKPOINTS.DESKTOP,
    });
  }, []);

  useEffect(() => {
    handleChange();
    window.addEventListener("resize", handleChange, { passive: true });
    return () => window.removeEventListener("resize", handleChange);
  }, [handleChange]);

  return state;
}
