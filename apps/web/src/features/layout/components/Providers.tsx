"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { LocationProvider } from "@/contexts/LocationContext";
import { CartProvider } from "@/contexts/CartContext";
import { useState, useMemo } from "react";

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      }),
    [],
  );

  const composedProviders = useMemo(
    () =>
      composeProviders([
        LocationProvider,
        CartProvider,
      ]),
    [],
  );

  const ComposedProviders = composedProviders;

  return (
    <ComposedProviders>
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#ffffff",
              color: "#111111",
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: "#10B981",
                secondary: "#ffffff",
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: "#EF4444",
                secondary: "#ffffff",
              },
            },
          }}
        />
      </QueryClientProvider>
    </ComposedProviders>
  );
}

function composeProviders(
  providers: Array<React.ComponentType<{ children: React.ReactNode }>>,
): React.ComponentType<{ children: React.ReactNode }> {
  return ({ children }) => {
    return providers.reduceRight((child, Provider) => {
      return <Provider>{child}</Provider>;
    }, children);
  };
}
