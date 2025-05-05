import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Type for server action results
export type ActionResult<T> = {
  success: boolean;
  data?: T;
  error?: string;
}

// Helper function to return a successful result
export function success<T>(data: T): ActionResult<T> {
  return {
    success: true,
    data
  }
}

// Helper function to return a failure result
export function failure(error: unknown , clientError?: string): ActionResult<never> {
  const errorString = error instanceof Error ? error.message : error as string;
  console.log("error: ", errorString);
  return {
    success: false,
    error: clientError || errorString
  }
}
