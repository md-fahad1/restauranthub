'use client';

import Link from 'next/link';

interface StampToggleProps {
  active: 'login' | 'register';
}

export function StampToggle({ active }: StampToggleProps) {
  return (
    <div className="mb-6 flex gap-2">
      <Link
        href="/login"
        className={[
          'flex-1 rounded-sm border-2 py-2 text-center font-display text-sm tracking-wide transition-all',
          active === 'login'
            ? 'animate-stamp-down -rotate-1 border-ink text-ink'
            : 'border-transparent text-paper-muted hover:text-ink',
        ].join(' ')}
      >
        Sign in
      </Link>
      <Link
        href="/register"
        className={[
          'flex-1 rounded-sm border-2 py-2 text-center font-display text-sm tracking-wide transition-all',
          active === 'register'
            ? 'animate-stamp-down -rotate-1 border-ember text-ember-deep'
            : 'border-transparent text-paper-muted hover:text-ink',
        ].join(' ')}
      >
        New ticket
      </Link>
    </div>
  );
}
