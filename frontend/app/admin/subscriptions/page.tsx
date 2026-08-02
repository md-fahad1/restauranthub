'use client';

import { useMemo, useState } from 'react';
import { CreditCard, RefreshCcw, AlertTriangle } from 'lucide-react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';

interface Subscription {
  id: string;
  restaurant: string;
  plan: 'Free' | 'Basic' | 'Professional' | 'Enterprise';
  amount: number;
  billingCycle: 'Monthly' | 'Yearly';
  startedAt: string;
  expiresAt: string; // ISO date
  cardLast4: string | null;
}

// Mock "today" pinned so the demo's day-count math stays stable across runs.
const TODAY = new Date('2026-08-02');

const SUBSCRIPTIONS: Subscription[] = [
  { id: '1', restaurant: 'Test Restaurant', plan: 'Professional', amount: 79, billingCycle: 'Monthly', startedAt: '2026-01-12', expiresAt: '2026-08-12', cardLast4: '4242' },
  { id: '2', restaurant: 'Coastal Kitchen', plan: 'Professional', amount: 790, billingCycle: 'Yearly', startedAt: '2026-07-01', expiresAt: '2027-07-01', cardLast4: '1881' },
  { id: '3', restaurant: 'Spice Route', plan: 'Basic', amount: 29, billingCycle: 'Monthly', startedAt: '2026-07-15', expiresAt: '2026-08-15', cardLast4: '3050' },
  { id: '4', restaurant: 'The Grillhouse', plan: 'Professional', amount: 79, billingCycle: 'Monthly', startedAt: '2026-05-20', expiresAt: '2026-08-04', cardLast4: '9911' },
  { id: '5', restaurant: 'Late Night Diner', plan: 'Basic', amount: 29, billingCycle: 'Monthly', startedAt: '2025-12-01', expiresAt: '2026-07-28', cardLast4: null },
  { id: '6', restaurant: 'Noodle Bar Co.', plan: 'Free', amount: 0, billingCycle: 'Monthly', startedAt: '2026-07-25', expiresAt: '2026-08-24', cardLast4: null },
];

function daysUntil(dateStr: string): number {
  const diff = new Date(dateStr).getTime() - TODAY.getTime();
  return Math.round(diff / (1000 * 60 * 60 * 24));
}

function statusFor(sub: Subscription): string {
  const days = daysUntil(sub.expiresAt);
  if (sub.plan === 'Free') return 'Active';
  if (days < 0) return 'Expired';
  if (days <= 7) return 'Expiring soon';
  return 'Active';
}

const FILTERS = ['All', 'Active', 'Expiring soon', 'Expired'] as const;

export default function AdminSubscriptionsPage() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('All');

  const rows = useMemo(
    () =>
      SUBSCRIPTIONS.map((s) => ({ ...s, status: statusFor(s), days: daysUntil(s.expiresAt) })).filter((s) =>
        filter === 'All' ? true : s.status === filter,
      ),
    [filter],
  );

  const mrr = SUBSCRIPTIONS.filter((s) => s.billingCycle === 'Monthly').reduce((sum, s) => sum + s.amount, 0);
  const expiringCount = SUBSCRIPTIONS.filter((s) => statusFor(s) === 'Expiring soon').length;
  const expiredCount = SUBSCRIPTIONS.filter((s) => statusFor(s) === 'Expired').length;

  return (
    <>
      <PageHeader title="Subscriptions" subtitle="Plan, billing, and expiry status for every restaurant." />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="animate-fade-up rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="font-display text-2xl text-ink">${mrr.toLocaleString()}</p>
          <p className="mt-1 text-sm text-gray-500">Monthly recurring revenue</p>
        </div>
        <div className="animate-fade-up rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="font-display text-2xl text-ember-deep">{expiringCount}</p>
          <p className="mt-1 text-sm text-gray-500">Expiring within 7 days</p>
        </div>
        <div className="animate-fade-up rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="font-display text-2xl text-red-600">{expiredCount}</p>
          <p className="mt-1 text-sm text-gray-500">Expired — action needed</p>
        </div>
      </div>

      <div className="mb-4 flex animate-fade-up gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={[
              'rounded-full border px-3.5 py-1.5 text-sm transition-colors',
              filter === f ? 'border-ink bg-ink text-paper' : 'border-gray-200 text-gray-500 hover:border-gray-300',
            ].join(' ')}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="animate-fade-up overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/60 text-xs uppercase tracking-wide text-gray-400">
              <th className="px-5 py-3 font-medium">Restaurant</th>
              <th className="px-5 py-3 font-medium">Plan</th>
              <th className="px-5 py-3 font-medium">Amount</th>
              <th className="px-5 py-3 font-medium">Payment method</th>
              <th className="px-5 py-3 font-medium">Expires</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((s) => (
              <tr key={s.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                <td className="px-5 py-3 text-ink">{s.restaurant}</td>
                <td className="px-5 py-3 text-gray-500">{s.plan}</td>
                <td className="px-5 py-3 text-gray-500">
                  {s.amount === 0 ? '—' : `$${s.amount}/${s.billingCycle === 'Monthly' ? 'mo' : 'yr'}`}
                </td>
                <td className="px-5 py-3 text-gray-500">
                  {s.cardLast4 ? (
                    <span className="inline-flex items-center gap-1.5">
                      <CreditCard size={13} className="text-gray-300" />
                      •••• {s.cardLast4}
                    </span>
                  ) : (
                    <span className="text-gray-300">No card on file</span>
                  )}
                </td>
                <td className="px-5 py-3">
                  <span className={s.days < 0 ? 'text-red-600' : s.days <= 7 ? 'text-ember-deep' : 'text-gray-500'}>
                    {new Date(s.expiresAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  {s.plan !== 'Free' && (
                    <p className="text-xs text-gray-400">
                      {s.days < 0 ? `${Math.abs(s.days)}d overdue` : `${s.days}d left`}
                    </p>
                  )}
                </td>
                <td className="px-5 py-3">
                  <AdminStatusBadge status={s.status} />
                </td>
                <td className="px-5 py-3">
                  {(s.status === 'Expiring soon' || s.status === 'Expired') && (
                    <button className="inline-flex items-center gap-1.5 rounded-lg bg-ink px-2.5 py-1.5 text-xs font-medium text-paper hover:bg-ink-soft">
                      <RefreshCcw size={13} />
                      Send reminder
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {expiredCount > 0 && (
        <div className="mt-4 flex animate-fade-up items-start gap-2 rounded-xl border border-red-100 bg-red-50/60 p-4 text-sm text-red-700">
          <AlertTriangle size={16} className="mt-0.5 shrink-0" />
          <p>
            {expiredCount} restaurant{expiredCount > 1 ? 's have' : ' has'} an expired subscription and should be
            reviewed for downgrade or suspension.
          </p>
        </div>
      )}
    </>
  );
}
