"use client";

import { Toaster } from "react-hot-toast";
import StoreProvider from "@/store/StoreProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import QueryProvider from "@/components/QueryProvider";
import { TOAST_CONFIG } from "./config";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <AuthProvider>
        <QueryProvider>
          {children}
          <Toaster toastOptions={TOAST_CONFIG} />
        </QueryProvider>
      </AuthProvider>
    </StoreProvider>
  );
}
