"use client";

import { useMemo } from "react";
import type { CartCalculations } from "../types";

interface UseCartCalculationsProps {
  subtotal: number;
  discount: number;
}

export function useCartCalculations({
  subtotal,
  discount,
}: UseCartCalculationsProps): CartCalculations {
  return useMemo(() => {
    const total = subtotal - discount;

    return {
      subtotal,
      discount,
      total: Math.max(0, total),
    };
  }, [subtotal, discount]);
}
