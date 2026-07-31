import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthUser } from '@/lib/graphql/auth';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: AuthUser | null;
  setSession: (payload: { accessToken: string; refreshToken: string; user: AuthUser }) => void;
  clearSession: () => void;
}

/**
 * NOTE ON SECURITY: this persists tokens to localStorage for local
 * development convenience. localStorage is readable by any JS on the page,
 * so it's vulnerable to XSS token theft. Before shipping to real users,
 * swap this for httpOnly cookies set by the backend (which means moving
 * token issuance to a server-side route instead of reading the response
 * directly in the browser). Flagging this now so it's a deliberate choice,
 * not an oversight.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      setSession: ({ accessToken, refreshToken, user }) => set({ accessToken, refreshToken, user }),
      clearSession: () => set({ accessToken: null, refreshToken: null, user: null }),
    }),
    { name: 'restauranthub-auth' },
  ),
);
