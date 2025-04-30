"use client";

import { SessionProvider } from "./SessionProvider";
import { QueryClientProvider } from "./QueryClientProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <QueryClientProvider>
        {children}
      </QueryClientProvider>
    </SessionProvider>
  );
}
