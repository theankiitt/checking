"use client";

import { useState, useCallback } from "react";

export interface UseToggleOptions {
  initialValue?: boolean;
  onToggle?: (value: boolean) => void;
}

export function useToggle(options: UseToggleOptions = {}) {
  const { initialValue = false, onToggle } = options;
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue((prev) => {
      const newValue = !prev;
      onToggle?.(newValue);
      return newValue;
    });
  }, [onToggle]);

  const setTrue = useCallback(() => {
    setValue(true);
    onToggle?.(true);
  }, [onToggle]);

  const setFalse = useCallback(() => {
    setValue(false);
    onToggle?.(false);
  }, [onToggle]);

  return { value, toggle, setTrue, setFalse };
}
