'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@apollo/client/react';
import { LOGIN_MUTATION, type AuthPayload } from '@/lib/graphql/auth';
import { useAuthStore } from '@/store/auth-store';
import {getPostAuthRedirect} from '@/lib/auth/get-post-auth-redirect';
import { TicketShell } from '@/components/auth/TicketShell';
import { StampToggle } from '@/components/auth/StampToggle';
import { Field } from '@/components/auth/Field';

export default function LoginPage() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const [login, { loading }] = useMutation<{ login: AuthPayload }>(LOGIN_MUTATION);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    try {
      const { data } = await login({ variables: { input: { email, password } } });
      if (data?.login) {
        setSession(data.login);
        router.push(getPostAuthRedirect(data.login.user.roles));
      }
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Sign in failed. Check your details and try again.');
    }
  }

  return (
    <TicketShell ticketNo="00842" station="Auth counter">
      <StampToggle active="login" />

      <h2 className="mb-1 font-display text-2xl text-ink">Welcome back</h2>
      <p className="mb-6 text-sm text-paper-muted">Sign in to get back to your counter.</p>

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
        <Field
          label="Password"
          type="password"
          name="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {formError && (
          <p className="mb-4 rounded-sm border border-red-200 bg-red-50 px-3 py-2 font-mono text-[12px] text-red-700">
            {formError}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-sm bg-ink py-3 font-display text-[15px] tracking-wide text-paper transition-colors hover:bg-ink-soft disabled:opacity-50"
        >
          {loading ? 'Checking ticket…' : 'Sign in'}
        </button>
      </form>

      <p className="mt-5 text-center text-[13px] text-paper-muted">
        New to RestaurantHub?{' '}
        <a href="/register" className="font-medium text-ember-deep">
          Print a new ticket
        </a>
      </p>
    </TicketShell>
  );
}