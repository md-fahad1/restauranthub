import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthUser } from '@/lib/graphql/auth';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: AuthUser | null;
  hasHydrated: boolean;
  setSession: (payload: { accessToken: string; refreshToken: string; user: AuthUser }) => void;
  clearSession: () => void;
  setHasHydrated: (value: boolean) => void;
}

/**
 * NOTE ON SECURITY: this persists tokens to localStorage for local
 * development convenience. localStorage is readable by any JS on the page,
 * so it's vulnerable to XSS token theft. Before shipping to real users,
 * swap this for httpOnly cookies set by the backend.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      hasHydrated: false,
      setSession: ({ accessToken, refreshToken, user }) => set({ accessToken, refreshToken, user }),
      clearSession: () => set({ accessToken: null, refreshToken: null, user: null }),
      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: 'restauranthub-auth',
      // Runs once localStorage has actually been read into the store.
      // ProtectedRoute waits on this flag so it never redirects a real
      // logged-in user to /login just because the check ran before
      // localStorage finished loading.
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
