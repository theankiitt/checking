"use client";

import { useState, useCallback } from "react";

const VALID_PROMO_CODES: Record<string, number> = {
  SAVE10: 10,
  SAVE20: 20,
  WELCOME: 15,
};

interface UsePromoCodeReturn {
  promoCode: string;
  discount: number;
  isApplied: boolean;
  isValidating: boolean;
  error: string | null;
  applyPromo: (code: string) => void;
  removePromo: () => void;
}

export function usePromoCode(): UsePromoCodeReturn {
  const [promoCode, setPromoCode] = useState("");
  const [isApplied, setIsApplied] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const applyPromo = useCallback((code: string) => {
    const normalizedCode = code.trim().toUpperCase();

    if (VALID_PROMO_CODES[normalizedCode]) {
      setPromoCode(normalizedCode);
      setIsApplied(true);
      setError(null);
    } else {
      setError("Invalid promo code");
      setIsApplied(false);
    }
  }, []);

  const removePromo = useCallback(() => {
    setPromoCode("");
    setIsApplied(false);
    setError(null);
  }, []);

  const discount = isApplied && promoCode ? VALID_PROMO_CODES[promoCode] : 0;

  return {
    promoCode,
    discount,
    isApplied,
    isValidating,
    error,
    applyPromo,
    removePromo,
  };
}
