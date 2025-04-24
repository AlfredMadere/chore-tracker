"use server";

import { signIn } from "@/auth";

export async function signInWithGoogle(callbackUrl?: string) {
  return signIn("google", { redirectTo: callbackUrl || "/" });
}
