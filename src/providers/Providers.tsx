"use client";

import { SessionProvider } from "./SessionProvider";
import { QueryClientProvider } from "./QueryClientProvider";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <QueryClientProvider>
        <Toaster position="top-center" richColors closeButton />
        {children}
      </QueryClientProvider>
    </SessionProvider>
  );
}
