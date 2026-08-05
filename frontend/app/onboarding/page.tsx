'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@apollo/client/react';
import { CREATE_RESTAURANT_MUTATION, type CreateRestaurantPayload } from '@/lib/graphql/restaurant';
import { useAuthStore } from '@/store/auth-store';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

function OnboardingForm() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);
  const userName = useAuthStore((s) => s.user?.firstName);

  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [error, setError] = useState<string | null>(null);

  const [createRestaurant, { loading }] = useMutation<{ createRestaurant: CreateRestaurantPayload }>(
    CREATE_RESTAURANT_MUTATION,
  );

  function update(key: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [key]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    try {
      const { data } = await createRestaurant({
        variables: {
          input: {
            name: form.name,
            email: form.email || undefined,
            phone: form.phone || undefined,
          },
        },
      });

      if (data?.createRestaurant) {
        // The payload's accessToken/refreshToken/user shape matches
        // AuthPayload exactly (see auth-payload.type.ts on the backend),
        // so setSession accepts it directly — the new OWNER role and
        // reissued tokens are now live without a re-login.
        setSession(data.createRestaurant);
        router.push('/dashboard');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create your restaurant. Try again.');
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-6">
      <div className="w-full max-w-md rounded-xl border border-white/10 bg-ink-soft p-8">
        <p className="mb-1 font-mono text-[11px] uppercase tracking-widest text-ember">
          {userName ? `Welcome, ${userName}` : 'Welcome'}
        </p>
        <h1 className="mb-2 font-display text-2xl text-paper">Let's set up your restaurant</h1>
        <p className="mb-6 text-sm text-paper/60">
          This creates your first restaurant and makes you its owner — you can add branches, menu, and staff after.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-widest text-paper/50">
              Restaurant name
            </label>
            <input
              required
              value={form.name}
              onChange={update('name')}
              placeholder="e.g. Coastal Kitchen"
              className="w-full rounded-sm border border-white/10 bg-white/5 px-3 py-2.5 text-[15px] text-paper outline-none placeholder:text-paper/30 focus:border-ember"
            />
          </div>

          <div className="mb-4 grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-widest text-paper/50">
                Contact email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={update('email')}
                placeholder="optional"
                className="w-full rounded-sm border border-white/10 bg-white/5 px-3 py-2.5 text-[15px] text-paper outline-none placeholder:text-paper/30 focus:border-ember"
              />
            </div>
            <div>
              <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-widest text-paper/50">
                Phone
              </label>
              <input
                value={form.phone}
                onChange={update('phone')}
                placeholder="optional"
                className="w-full rounded-sm border border-white/10 bg-white/5 px-3 py-2.5 text-[15px] text-paper outline-none placeholder:text-paper/30 focus:border-ember"
              />
            </div>
          </div>

          {error && (
            <p className="mb-4 rounded-sm border border-red-400/30 bg-red-500/10 px-3 py-2 font-mono text-[12px] text-red-300">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !form.name}
            className="w-full rounded-sm bg-ember py-3 font-display text-[15px] tracking-wide text-ink transition-colors hover:bg-ember-deep disabled:opacity-50"
          >
            {loading ? 'Setting up…' : 'Create my restaurant'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  // Any authenticated user can reach this — no role restriction, since
  // the whole point is a CUSTOMER-only user is about to become an OWNER.
  return (
    <ProtectedRoute>
      <OnboardingForm />
    </ProtectedRoute>
  );
}
