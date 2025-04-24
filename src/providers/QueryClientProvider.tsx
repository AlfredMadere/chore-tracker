"use client";

import { QueryClient, QueryClientProvider as ReactQueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

export function QueryClientProvider({ children }: { children: React.ReactNode }) {
  // Create a new QueryClient instance for each session
  // This prevents sharing client state between users and requests
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        // Default query options
        staleTime: 60 * 1000, // 1 minute
        refetchOnWindowFocus: true,
        retry: 1,
      },
    },
  }));

  return (
    <ReactQueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </ReactQueryClientProvider>
  );
}
