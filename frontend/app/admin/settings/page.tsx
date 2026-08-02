'use client';

import { PageHeader } from '@/components/dashboard/PageHeader';

const PLANS = [
  { name: 'Free', price: 0 },
  { name: 'Basic', price: 29 },
  { name: 'Professional', price: 79 },
  { name: 'Enterprise', price: null },
];

export default function AdminSettingsPage() {
  return (
    <>
      <PageHeader title="Platform Settings" subtitle="Pricing tiers and platform-wide configuration." />

      <div className="max-w-2xl animate-fade-up rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="mb-4 font-display text-base text-ink">Subscription plans</h2>
        <div className="flex flex-col gap-3">
          {PLANS.map((plan) => (
            <div key={plan.name} className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50/60 p-3">
              <span className="text-[14px] text-ink">{plan.name}</span>
              <span className="text-sm text-gray-500">{plan.price === null ? 'Custom pricing' : plan.price === 0 ? 'Free' : `$${plan.price}/mo`}</span>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-gray-400">
          Editing plan pricing here is not yet wired to billing — this is a display-only reference until Stripe (or
          equivalent) integration is built.
        </p>
      </div>
    </>
  );
}
