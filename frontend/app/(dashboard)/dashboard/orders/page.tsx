'use client';

import { useMemo, useState } from 'react';
import { Clock, UtensilsCrossed, ShoppingBag, Bike } from 'lucide-react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { StatusBadge } from '@/components/dashboard/StatusBadge';

const TYPE_ICON = { 'Dine-in': UtensilsCrossed, Takeaway: ShoppingBag, Delivery: Bike } as const;

const MOCK_ORDERS = [
  { id: '#1042', table: 'Table 4', type: 'Dine-in', items: 3, total: 38.5, status: 'Preparing', time: '2m ago' },
  { id: '#1041', table: '—', type: 'Takeaway', items: 1, total: 14.0, status: 'Ready', time: '6m ago' },
  { id: '#1040', table: 'Table 9', type: 'Dine-in', items: 5, total: 62.2, status: 'Served', time: '11m ago' },
  { id: '#1039', table: '—', type: 'Delivery', items: 2, total: 27.75, status: 'Preparing', time: '14m ago' },
  { id: '#1038', table: 'Table 2', type: 'Dine-in', items: 2, total: 19.9, status: 'Served', time: '22m ago' },
  { id: '#1037', table: '—', type: 'Delivery', items: 4, total: 45.3, status: 'Pending', time: '24m ago' },
  { id: '#1036', table: 'Table 6', type: 'Dine-in', items: 6, total: 71.4, status: 'Served', time: '31m ago' },
  { id: '#1035', table: '—', type: 'Takeaway', items: 1, total: 9.5, status: 'Cancelled', time: '40m ago' },
] as const;

const FILTERS = ['All', 'Pending', 'Preparing', 'Ready', 'Served', 'Cancelled'] as const;

export default function OrdersPage() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('All');

  const filtered = useMemo(
    () => (filter === 'All' ? MOCK_ORDERS : MOCK_ORDERS.filter((o) => o.status === filter)),
    [filter],
  );

  return (
    <>
      <PageHeader title="Orders" subtitle="Every order across dine-in, takeaway, and delivery." />

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
              <th className="px-5 py-3 font-medium">Order</th>
              <th className="px-5 py-3 font-medium">Type</th>
              <th className="px-5 py-3 font-medium">Table</th>
              <th className="px-5 py-3 font-medium">Items</th>
              <th className="px-5 py-3 font-medium">Total</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Time</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((order) => {
              const Icon = TYPE_ICON[order.type];
              return (
                <tr key={order.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                  <td className="px-5 py-3 font-mono text-[13px] text-ink">{order.id}</td>
                  <td className="px-5 py-3">
                    <span className="inline-flex items-center gap-1.5 text-gray-600">
                      <Icon size={14} />
                      {order.type}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-500">{order.table}</td>
                  <td className="px-5 py-3 text-gray-500">{order.items}</td>
                  <td className="px-5 py-3 text-ink">${order.total.toFixed(2)}</td>
                  <td className="px-5 py-3">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-5 py-3 text-gray-400">
                    <span className="inline-flex items-center gap-1">
                      <Clock size={12} />
                      {order.time}
                    </span>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-gray-400">
                  No orders match this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
