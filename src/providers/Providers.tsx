"use client";

import { SessionProvider } from "./SessionProvider";
import { QueryClientProvider } from "./QueryClientProvider";
import { Toaster } from "sonner";
import { Analytics } from '@vercel/analytics/next';


export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <QueryClientProvider>
        <Toaster position="top-center" richColors closeButton />
        {children}
        <Analytics />
      </QueryClientProvider>
    </SessionProvider>
  );
}
