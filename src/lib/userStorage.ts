// Simple user storage utility using localStorage
// This is a simplified approach without proper authentication

type User = {
  id: number;
  email: string;
  name?: string;
};

const USER_STORAGE_KEY = 'chore-tracker-user';

export function saveUserToStorage(user: User): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  }
}

export function getUserFromStorage(): User | null {
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
