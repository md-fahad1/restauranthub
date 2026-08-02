'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';

interface ProtectedRouteProps {
  children: React.ReactNode;
  /**
   * Restrict to specific roles, e.g. ['SUPER_ADMIN']. Omit to allow any
   * authenticated user through.
   */
  requiredRoles?: string[];
}

/**
 * Wrap any page/layout that needs a logged-in session. Usage:
 *
 *   export default function Layout({ children }) {
 *     return <ProtectedRoute requiredRoles={['SUPER_ADMIN']}>{children}</ProtectedRoute>;
 *   }
 *
 * NOTE: this is a client-side check only — it hides content and redirects
 * in the browser, but does NOT stop the page's JS bundle from loading or
 * stop a determined user from hitting your GraphQL API directly. The real
 * security boundary is (and must remain) the backend's GqlAuthGuard /
 * RolesGuard / TenantGuard. This component is about UX — don't let
 * logged-out users see a flash of admin UI — not about access control.
 */
export function ProtectedRoute({ children, requiredRoles }: ProtectedRouteProps) {
  const router = useRouter();
  const { accessToken, user, hasHydrated } = useAuthStore();

  useEffect(() => {
    if (!hasHydrated) return; // wait for the persisted store to load from localStorage first

    if (!accessToken || !user) {
      router.replace('/login');
      return;
    }

    if (requiredRoles && !requiredRoles.some((role) => user.roles.includes(role))) {
      router.replace('/dashboard'); // logged in, just not allowed here
    }
  }, [hasHydrated, accessToken, user, requiredRoles, router]);

  // While we don't yet know if there's a session, or we know there isn't
  // one, render nothing rather than a flash of protected content.
  if (!hasHydrated || !accessToken || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-sm text-gray-400">Loading…</p>
      </div>
    );
  }

  if (requiredRoles && !requiredRoles.some((role) => user.roles.includes(role))) {
    return null; // redirect is already in flight from the effect above
  }

  return <>{children}</>;
}