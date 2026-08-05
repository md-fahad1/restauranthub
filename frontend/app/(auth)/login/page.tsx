'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { useMutation } from '@apollo/client/react';

import { LOGIN_MUTATION, type AuthPayload } from '@/lib/graphql/auth';
import { useAuthStore } from '@/store/auth-store';
import { getPostAuthRedirect } from '@/lib/auth/get-post-auth-redirect';

import { TicketShell } from '@/components/auth/TicketShell';
import { StampToggle } from '@/components/auth/StampToggle';
import { Field } from '@/components/auth/Field';
//admin@restauranthub.dev	ChangeMe123!	SUPER_ADMIN
// owner@testrestaurant.dev	ChangeMe123!	OWNER

export default function LoginPage() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [formError, setFormError] = useState<string | null>(null);

  const [login, { loading }] =
    useMutation<{ login: AuthPayload }>(LOGIN_MUTATION);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    try {
      const { data } = await login({
        variables: {
          input: {
            email,
            password,
          },
        },
      });

      if (!data?.login) return;

      setSession(data.login);

      if (rememberMe) {
        localStorage.setItem('remember_email', email);
      } else {
        localStorage.removeItem('remember_email');
      }

      router.push(getPostAuthRedirect(data.login.user.roles));
    } catch (err) {
      setFormError(
        err instanceof Error
          ? err.message
          : 'Sign in failed. Please check your credentials.'
      );
    }
  }

  return (
    <TicketShell ticketNo="00842" station="Auth counter">
      <StampToggle active="login" />

      <h2 className="mb-1 font-display text-2xl text-ink">
        Welcome back
      </h2>

      <p className="mb-6 text-sm text-paper-muted">
        Sign in to continue managing your restaurant.
      </p>

      <form onSubmit={handleSubmit}>
        <Field
          label="Email"
          type="email"
          name="email"
          placeholder="you@restaurant.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium">
            Password
          </label>

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-sm border border-stone-300 bg-paper px-4 py-3 pr-12 outline-none transition focus:border-ember"
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-ink"
            >
              {showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>
        </div>

        <div className="mb-5 flex items-center justify-between">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-paper-muted">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 accent-black"
            />
            Remember me
          </label>

          <Link
            href="/forgot-password"
            className="text-sm font-medium text-ember-deep hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        {formError && (
          <div className="mb-4 rounded-sm border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {formError}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-sm bg-ink py-3 font-display text-paper transition hover:bg-ink-soft disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-paper-muted">
        Don't have an account?{' '}
        <Link
          href="/register"
          className="font-semibold text-ember-deep hover:underline"
        >
          Create one
        </Link>
      </p>
    </TicketShell>
  );
}