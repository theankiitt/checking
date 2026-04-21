"use client";

import Navbar from "./Navbar";
import { usePathname } from "next/navigation";

export default function ConditionalHeader() {
  const pathname = usePathname();

  if (pathname?.startsWith("/help") || pathname?.startsWith("/login")) {
    return null;
  }

  return <Navbar />;
}
