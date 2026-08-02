'use client';

import { Users } from 'lucide-react';
import { PageHeader } from '@/components/dashboard/PageHeader';

interface DiningTable {
  id: string;
  number: string;
  capacity: number;
  status: 'Available' | 'Occupied' | 'Reserved' | 'Cleaning';
  occupiedSince?: string;
}

const TABLES: DiningTable[] = [
  { id: '1', number: '1', capacity: 2, status: 'Available' },
  { id: '2', number: '2', capacity: 2, status: 'Occupied', occupiedSince: '35m' },
  { id: '3', number: '3', capacity: 4, status: 'Cleaning' },
  { id: '4', number: '4', capacity: 4, status: 'Occupied', occupiedSince: '12m' },
  { id: '5', number: '5', capacity: 4, status: 'Reserved' },
  { id: '6', number: '6', capacity: 6, status: 'Occupied', occupiedSince: '48m' },
  { id: '7', number: '7', capacity: 2, status: 'Available' },
  { id: '8', number: '8', capacity: 2, status: 'Available' },
  { id: '9', number: '9', capacity: 4, status: 'Occupied', occupiedSince: '5m' },
  { id: '10', number: '10', capacity: 6, status: 'Reserved' },
  { id: '11', number: '11', capacity: 4, status: 'Available' },
  { id: '12', number: '12', capacity: 8, status: 'Cleaning' },
];

const STATUS_CARD: Record<DiningTable['status'], string> = {
  Available: 'border-teal/30 bg-teal/5',
  Occupied: 'border-ember/30 bg-ember/5',
  Reserved: 'border-indigo-200 bg-indigo-50/60',
  Cleaning: 'border-gray-200 bg-gray-50',
};

const STATUS_DOT: Record<DiningTable['status'], string> = {
  Available: 'bg-teal-deep',
  Occupied: 'bg-ember-deep',
  Reserved: 'bg-indigo-500',
  Cleaning: 'bg-gray-400',
};

export default function TablesPage() {
  const counts = TABLES.reduce<Record<string, number>>((acc, t) => {
    acc[t.status] = (acc[t.status] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <>
      <PageHeader title="Tables" subtitle="Main Branch floor — tap a table for order details (coming soon)." />

      <div className="mb-5 flex animate-fade-up flex-wrap gap-3">
        {(['Available', 'Occupied', 'Reserved', 'Cleaning'] as const).map((status) => (
          <div key={status} className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs">
            <span className={`h-2 w-2 rounded-full ${STATUS_DOT[status]}`} />
            <span className="text-gray-500">{status}</span>
            <span className="font-medium text-ink">{counts[status] ?? 0}</span>
          </div>
        ))}
      </div>

      <div className="grid animate-fade-up grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {TABLES.map((table) => (
          <button
            key={table.id}
            className={`flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-transform hover:-translate-y-0.5 hover:shadow-sm ${STATUS_CARD[table.status]}`}
          >
            <span className="font-display text-xl text-ink">T{table.number}</span>
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <Users size={12} />
              {table.capacity}
            </span>
            <span className="flex items-center gap-1.5 text-xs font-medium text-ink">
              <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[table.status]}`} />
              {table.status}
            </span>
            {table.occupiedSince && <span className="text-[11px] text-gray-400">{table.occupiedSince} seated</span>}
          </button>
        ))}
      </div>
    </>
  );
}
