// hooks/use-auth.ts
import { create } from "zustand";

interface AuthState {
  isAuthenticated: boolean;
  user: any | null;
  setAuth: (user: any) => void;
  clearAuth: () => void;
  initializeAuth: () => void; // Added this
}

export const useAuth = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  setAuth: (user) => set({ isAuthenticated: true, user }),
  clearAuth: () => {
    localStorage.removeItem("token"); // Clear token from localStorage
    set({ isAuthenticated: false, user: null });
  },
  initializeAuth: () => {
    const token = localStorage.getItem("token");
    if (token) {
      // Example: Decode or validate the token here if needed
      set({ isAuthenticated: true, user: { token } });
    }
  },
}));
