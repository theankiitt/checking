import { useEffect, useRef } from "react";

export function useClickOutside<T extends HTMLElement>(
  callback: (event: MouseEvent) => void,
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback(event);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [callback]);

  return ref;
}
