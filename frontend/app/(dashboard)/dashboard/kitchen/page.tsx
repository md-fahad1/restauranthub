'use client';

import { useState } from 'react';
import { Clock, ChevronRight, Flame } from 'lucide-react';
import { PageHeader } from '@/components/dashboard/PageHeader';

interface KitchenOrder {
  id: string;
  table: string;
  items: { name: string; qty: number }[];
  status: 'Pending' | 'Preparing' | 'Ready';
  elapsedMin: number;
}

const INITIAL_ORDERS: KitchenOrder[] = [
  {
    id: '#1037',
    table: 'Delivery',
    items: [{ name: 'Beef Lasagna', qty: 2 }, { name: 'Garlic Bread', qty: 1 }],
    status: 'Pending',
    elapsedMin: 1,
  },
  {
    id: '#1042',
    table: 'Table 4',
    items: [{ name: 'Margherita Pizza', qty: 1 }, { name: 'Caesar Salad', qty: 2 }],
    status: 'Preparing',
    elapsedMin: 6,
  },
  {
    id: '#1039',
    table: 'Delivery',
    items: [{ name: 'Grilled Chicken Burger', qty: 2 }],
    status: 'Preparing',
    elapsedMin: 12,
  },
  {
    id: '#1041',
    table: 'Takeaway',
    items: [{ name: 'Caesar Salad', qty: 1 }],
    status: 'Ready',
    elapsedMin: 3,
  },
];

const COLUMNS: { status: KitchenOrder['status']; label: string; hint: string }[] = [
  { status: 'Pending', label: 'New', hint: 'Not started yet' },
  { status: 'Preparing', label: 'Preparing', hint: 'On the line' },
  { status: 'Ready', label: 'Ready', hint: 'Awaiting pickup' },
];

const NEXT_STATUS: Record<KitchenOrder['status'], KitchenOrder['status'] | null> = {
  Pending: 'Preparing',
  Preparing: 'Ready',
  Ready: null,
};

export default function KitchenPage() {
  const [orders, setOrders] = useState(INITIAL_ORDERS);

  function bump(id: string) {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== id) return o;
        const next = NEXT_STATUS[o.status];
        return next ? { ...o, status: next } : o;
      }),
    );
  }

  return (
    <>
      <PageHeader title="Kitchen" subtitle="Live prep board — tap an order to bump it to the next stage." />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {COLUMNS.map((col) => {
          const columnOrders = orders.filter((o) => o.status === col.status);
          return (
            <div key={col.status} className="animate-fade-up rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h2 className="font-display text-base text-ink">{col.label}</h2>
                  <p className="text-xs text-gray-400">{col.hint}</p>
                </div>
                <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-ink/5 px-1.5 text-xs font-medium text-ink">
                  {columnOrders.length}
                </span>
              </div>

              <div className="flex flex-col gap-3">
                {columnOrders.map((order) => (
                  <button
                    key={order.id}
                    onClick={() => bump(order.id)}
                    disabled={!NEXT_STATUS[order.status]}
                    className="w-full rounded-lg border border-gray-100 bg-gray-50/60 p-3 text-left transition-colors hover:border-ember/40 hover:bg-white disabled:cursor-default disabled:hover:border-gray-100 disabled:hover:bg-gray-50/60"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-mono text-[13px] text-ink">{order.id}</span>
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        {order.elapsedMin >= 10 ? (
                          <Flame size={12} className="text-red-500" />
                        ) : (
                          <Clock size={12} />
                        )}
                        {order.elapsedMin}m
                      </span>
                    </div>
                    <p className="mb-2 text-xs font-medium text-gray-500">{order.table}</p>
                    <ul className="mb-2 space-y-0.5">
                      {order.items.map((item) => (
                        <li key={item.name} className="text-[13px] text-ink">
                          <span className="text-gray-400">{item.qty}×</span> {item.name}
                        </li>
                      ))}
                    </ul>
                    {NEXT_STATUS[order.status] && (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-ember-deep">
                        Bump to {NEXT_STATUS[order.status]}
                        <ChevronRight size={12} />
                      </span>
                    )}
                  </button>
                ))}
                {columnOrders.length === 0 && (
                  <p className="rounded-lg border border-dashed border-gray-200 py-6 text-center text-xs text-gray-400">
                    Nothing here
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
