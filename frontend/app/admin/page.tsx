'use client';

import { useEffect, useState } from 'react';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Store, DollarSign, AlertCircle, UserPlus, TrendingUp, TrendingDown } from 'lucide-react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';

// Mock — replace with real platform-wide queries once built (restaurant
// count, subscription aggregation, signup timeline). SUPER_ADMIN-only
// resolvers, distinct from the tenant-scoped queries the owner dashboard uses.
const KPIS = [
  { label: 'Total Restaurants', value: 128, delta: 6.4, icon: Store },
  { label: 'MRR', value: 9840, prefix: '$', delta: 11.2, icon: DollarSign },
  { label: 'Expiring in 7 days', value: 9, delta: 0, icon: AlertCircle, neutral: true },
  { label: 'New Signups (30d)', value: 22, delta: 18.0, icon: UserPlus },
];

const SIGNUP_TREND = [
  { month: 'Feb', signups: 6 },
  { month: 'Mar', signups: 9 },
  { month: 'Apr', signups: 8 },
  { month: 'May', signups: 14 },
  { month: 'Jun', signups: 17 },
  { month: 'Jul', signups: 22 },
];

const RECENT_SIGNUPS = [
  { name: 'Coastal Kitchen', owner: 'Dana Reyes', plan: 'Professional', joined: '2 days ago', status: 'Trial' },
  { name: 'Spice Route', owner: 'Ahmed Karim', plan: 'Basic', joined: '4 days ago', status: 'Active' },
  { name: 'The Grillhouse', owner: 'Sofia Marin', plan: 'Professional', joined: '6 days ago', status: 'Active' },
  { name: 'Noodle Bar Co.', owner: 'Kenji Watanabe', plan: 'Free', joined: '1 week ago', status: 'Trial' },
];

function useCountUp(target: number, durationMs = 900) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let frame: number;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / durationMs, 1);
      setValue(target * (1 - Math.pow(1 - progress, 3)));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, durationMs]);
  return value;
}

function KpiCard({
  label,
  value,
  prefix,
  delta,
  icon: Icon,
  neutral,
  delay,
}: {
  label: string;
  value: number;
  prefix?: string;
  delta: number;
  icon: React.ElementType;
  neutral?: boolean;
  delay: number;
}) {
  const animated = useCountUp(value);
  const isUp = delta >= 0;

  return (
    <div className="animate-fade-up rounded-xl border border-gray-100 bg-white p-5 shadow-sm" style={{ animationDelay: `${delay}ms` }}>
      <div className="flex items-start justify-between">
        <div className="rounded-lg bg-ink/5 p-2.5">
          <Icon size={18} className="text-ink" />
        </div>
        {!neutral && (
          <span
            className={[
              'flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
              isUp ? 'bg-teal/15 text-teal-deep' : 'bg-red-50 text-red-600',
            ].join(' ')}
          >
            {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(delta)}%
          </span>
        )}
      </div>
      <p className="mt-4 font-display text-2xl text-ink">
        {prefix ?? ''}
        {Math.round(animated).toLocaleString()}
      </p>
      <p className="mt-1 text-sm text-gray-500">{label}</p>
    </div>
  );
}

export default function AdminOverviewPage() {
  return (
    <>
      <PageHeader title="Platform Overview" subtitle="Every restaurant on RestaurantHub, at a glance." />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {KPIS.map((kpi, i) => (
          <KpiCard key={kpi.label} {...kpi} delay={i * 80} />
        ))}
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="animate-fade-up rounded-xl border border-gray-100 bg-white p-5 shadow-sm xl:col-span-2">
          <h2 className="mb-4 font-display text-base text-ink">Signups — last 6 months</h2>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={SIGNUP_TREND}>
              <defs>
                <linearGradient id="signupFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2FA4A9" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#2FA4A9" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0EDE4" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} width={28} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="signups"
                stroke="#1F7A7E"
                strokeWidth={2.5}
                fill="url(#signupFill)"
                animationDuration={900}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="animate-fade-up rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <h2 className="mb-4 font-display text-base text-ink">Recent signups</h2>
          <div className="flex flex-col gap-3">
            {RECENT_SIGNUPS.map((r) => (
              <div key={r.name} className="flex items-center justify-between">
                <div>
                  <p className="text-[13px] text-ink">{r.name}</p>
                  <p className="text-xs text-gray-400">
                    {r.owner} · {r.joined}
                  </p>
                </div>
                <AdminStatusBadge status={r.status} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
