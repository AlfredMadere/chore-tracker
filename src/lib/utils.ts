import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export function success<T>(data: T): ActionResult<T> {
  return { success: true, data };
}

export function failure<T = never>(error: unknown, fallbackMessage?: string): ActionResult<T> {
  if (typeof error === "string") {
    return { success: false, error };
  }
  if (error instanceof Error) {
    return { success: false, error: error.message };
  }
  return { success: false, error: fallbackMessage ?? "An unknown error occurred" };
}
