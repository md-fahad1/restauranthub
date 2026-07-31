'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@apollo/client/react';
import { REGISTER_MUTATION, type AuthPayload } from '@/lib/graphql/auth';
import { useAuthStore } from '@/store/auth-store';
import { TicketShell } from '@/components/auth/TicketShell';
import { StampToggle } from '@/components/auth/StampToggle';
import { Field } from '@/components/auth/Field';

// Mirrors the backend's RegisterInput validation (register.input.ts) so the
// user gets instant feedback instead of waiting on a round trip for
// something we already know the rule for.
const PASSWORD_RULE = /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;

export default function RegisterPage() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);

  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);

  const [register, { loading }] = useMutation<{ register: AuthPayload }>(REGISTER_MUTATION);

  function update(key: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [key]: e.target.value }));
  }

  function validate(): boolean {
    const errors: Record<string, string> = {};
    if (form.password.length < 8) {
      errors.password = 'At least 8 characters.';
    } else if (!PASSWORD_RULE.test(form.password)) {
      errors.password = 'Add an uppercase letter and a number or symbol.';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    if (!validate()) return;

    try {
      const { data } = await register({ variables: { input: form } });
      if (data?.register) {
        setSession(data.register);
        router.push('/dashboard');
      }
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Could not create your account. Try again.');
    }
  }

  return (
    <TicketShell ticketNo="00843" station="Auth counter">
      <StampToggle active="register" />

      <h2 className="mb-1 font-display text-2xl text-ink">Print a new ticket</h2>
      <p className="mb-6 text-sm text-paper-muted">Create your account to start running the counter.</p>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-3">
          <Field label="First name" name="firstName" value={form.firstName} onChange={update('firstName')} required />
          <Field label="Last name" name="lastName" value={form.lastName} onChange={update('lastName')} required />
        </div>
        <Field
          label="Email"
          type="email"
          name="email"
          placeholder="you@restaurant.com"
          value={form.email}
          onChange={update('email')}
          required
        />
        <Field
          label="Password"
          type="password"
          name="password"
          placeholder="••••••••"
          value={form.password}
          onChange={update('password')}
          error={fieldErrors.password}
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
          className="w-full rounded-sm bg-ember py-3 font-display text-[15px] tracking-wide text-ink transition-colors hover:bg-ember-deep disabled:opacity-50"
        >
          {loading ? 'Printing ticket…' : 'Create account'}
        </button>
      </form>

      <p className="mt-5 text-center text-[13px] text-paper-muted">
        Already have a counter?{' '}
        <a href="/login" className="font-medium text-ember-deep">
          Sign in
        </a>
      </p>
    </TicketShell>
  );
}
