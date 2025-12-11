
import { User } from "../types";

// ----------------------------------------------------------------------
// MOCK AUTH SERVICE
// When ready for production, replace these functions with Firebase calls.
// ----------------------------------------------------------------------

const DELAY_MS = 800; // Simulate network latency

export const loginUser = async (email: string, password: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simple mock validation
      if (password.length < 6) {
        reject(new Error("Password must be at least 6 characters"));
        return;
      }

      // In a real app, you'd check against a DB.
      // Here we just simulate a successful login for any valid email.
      const mockUser: User = {
        id: "user_" + Math.random().toString(36).substr(2, 9),
        email: email,
        name: email.split('@')[0], // Generate name from email
        avatar: `https://ui-avatars.com/api/?name=${email}&background=0D9488&color=fff`
      };

      // Store in local storage to persist session across refreshes (Development only)
      localStorage.setItem('lumina_user', JSON.stringify(mockUser));
      
      resolve(mockUser);
    }, DELAY_MS);
  });
};

export const registerUser = async (name: string, email: string, password: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!email.includes('@')) {
        reject(new Error("Invalid email address"));
        return;
      }

      const newUser: User = {
        id: "user_" + Math.random().toString(36).substr(2, 9),
        email,
        name,
        avatar: `https://ui-avatars.com/api/?name=${name}&background=0D9488&color=fff`
      };

      localStorage.setItem('lumina_user', JSON.stringify(newUser));
      resolve(newUser);
    }, DELAY_MS);
  });
};

export const logoutUser = async (): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      localStorage.removeItem('lumina_user');
      resolve();
    }, 400);
  });
};

export const getCurrentUser = async (): Promise<User | null> => {
  // Check local storage for existing session
  const stored = localStorage.getItem('lumina_user');
  if (stored) return JSON.parse(stored);
  return null;
};
