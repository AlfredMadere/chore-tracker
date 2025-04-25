"use client";

import SignIn from "@/components/sign-in";
import { Suspense } from "react";

// Loading fallback component
function SignInLoading() {
  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-10">
        <Suspense fallback={<SignInLoading />}>
          <SignIn />
        </Suspense>
      </div>
    </div>
  );
}
