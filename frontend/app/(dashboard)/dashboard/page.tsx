'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { TrendingUp, TrendingDown, ClipboardList, UtensilsCrossed, Store, Clock, AlertTriangle } from 'lucide-react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { StatusBadge } from '@/components/dashboard/StatusBadge';

// Mock data — replace with real GraphQL queries once Phase 2/3 resolvers exist.
// Shapes are final; swapping is mechanical.
const MOCK_KPIS = [
  { label: "Today's Revenue", value: 1284.5, prefix: '$', delta: 8.2, icon: TrendingUp },
  { label: 'Orders Today', value: 96, prefix: '', delta: 12.4, icon: ClipboardList },
  { label: 'Table Occupancy', value: 74, prefix: '', suffix: '%', delta: -3.1, icon: UtensilsCrossed },
  { label: 'Avg. Order Value', value: 13.38, prefix: '$', delta: 4.6, icon: Store },
];

const MOCK_REVENUE_TREND = [
  { day: 'Mon', revenue: 890 },
  { day: 'Tue', revenue: 1040 },
  { day: 'Wed', revenue: 960 },
  { day: 'Thu', revenue: 1180 },
  { day: 'Fri', revenue: 1510 },
  { day: 'Sat', revenue: 1780 },
  { day: 'Sun', revenue: 1284 },
];

const MOCK_ORDERS_BY_HOUR = [
  { hour: '11a', orders: 4 },
  { hour: '12p', orders: 18 },
  { hour: '1p', orders: 22 },
  { hour: '2p', orders: 9 },
  { hour: '3p', orders: 5 },
  { hour: '4p', orders: 6 },
  { hour: '5p', orders: 11 },
  { hour: '6p', orders: 19 },
  { hour: '7p', orders: 24 },
  { hour: '8p', orders: 16 },
];

const MOCK_ORDER_STATUS = [
  { name: 'Preparing', value: 12, color: '#F2994A' },
  { name: 'Ready', value: 5, color: '#2FA4A9' },
  { name: 'Served', value: 34, color: '#10182A' },
  { name: 'Pending', value: 3, color: '#C9C2AC' },
];

const MOCK_LOW_STOCK = [
  { name: 'Chicken Breast', current: 8, max: 50, unit: 'kg' },
  { name: 'Mozzarella', current: 3, max: 20, unit: 'kg' },
  { name: 'Tomatoes', current: 6, max: 30, unit: 'kg' },
];

const MOCK_RECENT_ORDERS = [
  { id: '#1042', table: 'Table 4', total: 38.5, status: 'Preparing', time: '2m ago' },
  { id: '#1041', table: 'Takeaway', total: 14.0, status: 'Ready', time: '6m ago' },
  { id: '#1040', table: 'Table 9', total: 62.2, status: 'Served', time: '11m ago' },
  { id: '#1039', table: 'Delivery', total: 27.75, status: 'Preparing', time: '14m ago' },
  { id: '#1038', table: 'Table 2', total: 19.9, status: 'Served', time: '22m ago' },
];

const MOCK_TOP_ITEMS = [
  { name: 'Margherita Pizza', sold: 42 },
  { name: 'Grilled Chicken Burger', sold: 37 },
  { name: 'Caesar Salad', sold: 29 },
  { name: 'Beef Lasagna', sold: 24 },
];

function useCountUp(target: number, durationMs = 900) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let frame: number;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(target * eased);
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
  prefix = '',
  suffix = '',
  delta,
  icon: Icon,
  delay,
}: {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  delta: number;
  icon: React.ElementType;
  delay: number;
}) {
  const animated = useCountUp(value);
  const isUp = delta >= 0;
  const decimals = value % 1 !== 0 ? 2 : 0;

  return (
    <div
      className="animate-fade-up rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div className="rounded-lg bg-ink/5 p-2.5">
          <Icon size={18} className="text-ink" />
        </div>
        <span
          className={[
            'flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
            isUp ? 'bg-teal/15 text-teal-deep' : 'bg-red-50 text-red-600',
          ].join(' ')}
        >
          {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {Math.abs(delta)}%
        </span>
      </div>
      <p className="mt-4 font-display text-2xl text-ink">
        {prefix}
        {animated.toFixed(decimals)}
        {suffix}
      </p>
      <p className="mt-1 text-sm text-gray-500">{label}</p>
    </div>
  );
}

export default function DashboardOverviewPage() {
  const totalActive = useMemo(
    () => MOCK_ORDER_STATUS.filter((s) => s.name !== 'Served').reduce((sum, s) => sum + s.value, 0),
    [],
  );

  return (
    <>
      <PageHeader title="Good afternoon, Owner" subtitle={`Main Branch · ${totalActive} orders active right now`} />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {MOCK_KPIS.map((kpi, i) => (
          <KpiCard key={kpi.label} {...kpi} delay={i * 80} />
        ))}
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="animate-fade-up rounded-xl border border-gray-100 bg-white p-5 shadow-sm xl:col-span-2">
          <h2 className="mb-4 font-display text-base text-ink">Revenue — last 7 days</h2>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={MOCK_REVENUE_TREND}>
              <defs>
                <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F2994A" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#F2994A" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0EDE4" />
              <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} width={36} />
              <Tooltip formatter={(v: number) => [`$${v}`, 'Revenue']} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#D9722E"
                strokeWidth={2.5}
                fill="url(#revenueFill)"
                animationDuration={900}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="animate-fade-up rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <h2 className="mb-4 font-display text-base text-ink">Live order status</h2>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={MOCK_ORDER_STATUS}
                dataKey="value"
                innerRadius={48}
                outerRadius={70}
                paddingAngle={3}
                animationDuration={900}
              >
                {MOCK_ORDER_STATUS.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1.5">
            {MOCK_ORDER_STATUS.map((s) => (
              <div key={s.name} className="flex items-center gap-1.5 text-xs text-gray-500">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
                {s.name} · {s.value}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="animate-fade-up rounded-xl border border-gray-100 bg-white p-5 shadow-sm xl:col-span-2">
          <h2 className="mb-4 font-display text-base text-ink">Orders by hour — today</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={MOCK_ORDERS_BY_HOUR}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0EDE4" />
              <XAxis dataKey="hour" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} width={28} />
              <Tooltip />
              <Bar dataKey="orders" fill="#10182A" radius={[4, 4, 0, 0]} animationDuration={900} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="animate-fade-up rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <AlertTriangle size={16} className="text-ember-deep" />
            <h2 className="font-display text-base text-ink">Low stock</h2>
          </div>
          <div className="flex flex-col gap-3">
            {MOCK_LOW_STOCK.map((item) => {
              const pct = Math.round((item.current / item.max) * 100);
              return (
                <div key={item.name}>
                  <div className="mb-1 flex justify-between text-[13px]">
                    <span className="text-ink">{item.name}</span>
                    <span className="text-gray-400">
                      {item.current}/{item.max} {item.unit}
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                    <div
                      className={pct < 20 ? 'h-full rounded-full bg-red-400' : 'h-full rounded-full bg-ember'}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="animate-fade-up rounded-xl border border-gray-100 bg-white p-5 shadow-sm xl:col-span-2">
          <h2 className="mb-4 font-display text-base text-ink">Recent orders</h2>
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs uppercase tracking-wide text-gray-400">
                <th className="pb-2 font-medium">Order</th>
                <th className="pb-2 font-medium">Table</th>
                <th className="pb-2 font-medium">Total</th>
                <th className="pb-2 font-medium">Status</th>
                <th className="pb-2 font-medium">Time</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_RECENT_ORDERS.map((order) => (
                <tr key={order.id} className="border-b border-gray-50 last:border-0">
                  <td className="py-2.5 font-mono text-[13px] text-ink">{order.id}</td>
                  <td className="py-2.5 text-gray-500">{order.table}</td>
                  <td className="py-2.5 text-ink">${order.total.toFixed(2)}</td>
                  <td className="py-2.5">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="py-2.5 text-gray-400">
                    <span className="inline-flex items-center gap-1">
                      <Clock size={12} />
                      {order.time}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="animate-fade-up rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <h2 className="mb-4 font-display text-base text-ink">Top sellers today</h2>
          <div className="flex flex-col gap-4">
            {MOCK_TOP_ITEMS.map((item, i) => (
              <div key={item.name} className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-ink/5 font-mono text-xs text-ink">
                  {i + 1}
                </span>
                <div className="flex-1">
                  <p className="text-[13px] text-ink">{item.name}</p>
                  <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-teal"
                      style={{ width: `${(item.sold / MOCK_TOP_ITEMS[0].sold) * 100}%` }}
                    />
                  </div>
                </div>
                <span className="text-xs text-gray-400">{item.sold} sold</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
