// Simple user storage utility using localStorage
// This is a simplified approach without proper authentication
import { User } from "@/generated/prisma";

// Define a simplified user type for storage
export type StoredUser = {
  id: string;
  email: string;
  name?: string | null;
};

const USER_STORAGE_KEY = 'chore-tracker-user';

export function saveUserToStorage(user: StoredUser): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  }
}

export function getUserFromStorage(): StoredUser | null {
  if (typeof window !== 'undefined') {
    const userJson = localStorage.getItem(USER_STORAGE_KEY);
    if (userJson) {
      try {
        return JSON.parse(userJson);
      } catch (e) {
        console.error('Error parsing user from storage:', e);
      }
    }
  }
  return null;
}

export function clearUserFromStorage(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(USER_STORAGE_KEY);
  }
}
