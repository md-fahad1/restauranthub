'use client';

import { useMemo, useState } from 'react';
import { Plus, UtensilsCrossed } from 'lucide-react';
import { PageHeader } from '@/components/dashboard/PageHeader';

interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  available: boolean;
}

const INITIAL_ITEMS: MenuItem[] = [
  { id: '1', name: 'Margherita Pizza', category: 'Pizza', price: 12.5, available: true },
  { id: '2', name: 'Pepperoni Pizza', category: 'Pizza', price: 14.0, available: true },
  { id: '3', name: 'Grilled Chicken Burger', category: 'Burgers', price: 11.0, available: true },
  { id: '4', name: 'Classic Cheeseburger', category: 'Burgers', price: 9.5, available: false },
  { id: '5', name: 'Caesar Salad', category: 'Salads', price: 8.0, available: true },
  { id: '6', name: 'Greek Salad', category: 'Salads', price: 8.5, available: true },
  { id: '7', name: 'Beef Lasagna', category: 'Mains', price: 15.5, available: true },
  { id: '8', name: 'Grilled Salmon', category: 'Mains', price: 18.0, available: false },
  { id: '9', name: 'Garlic Bread', category: 'Sides', price: 4.5, available: true },
  { id: '10', name: 'Sweet Potato Fries', category: 'Sides', price: 5.0, available: true },
];

const CATEGORIES = ['All', ...Array.from(new Set(INITIAL_ITEMS.map((i) => i.category)))];

export default function MenuPage() {
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [category, setCategory] = useState('All');

  const filtered = useMemo(
    () => (category === 'All' ? items : items.filter((i) => i.category === category)),
    [items, category],
  );

  function toggleAvailability(id: string) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, available: !i.available } : i)));
  }

  return (
    <>
      <PageHeader
        title="Menu"
        subtitle={`${items.length} items across ${CATEGORIES.length - 1} categories.`}
        action={
          <button className="flex items-center gap-1.5 rounded-lg bg-ink px-3.5 py-2 text-sm text-paper hover:bg-ink-soft">
            <Plus size={15} />
            Add item
          </button>
        }
      />

      <div className="mb-4 flex animate-fade-up flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={[
              'rounded-full border px-3.5 py-1.5 text-sm transition-colors',
              category === cat ? 'border-ink bg-ink text-paper' : 'border-gray-200 text-gray-500 hover:border-gray-300',
            ].join(' ')}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid animate-fade-up grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="mb-3 flex h-28 items-center justify-center rounded-lg bg-gray-50">
              <UtensilsCrossed size={28} className="text-gray-300" />
            </div>
            <div className="mb-2 flex items-start justify-between gap-2">
              <div>
                <p className="text-[14px] font-medium text-ink">{item.name}</p>
                <p className="text-xs text-gray-400">{item.category}</p>
              </div>
              <p className="whitespace-nowrap font-display text-[15px] text-ink">${item.price.toFixed(2)}</p>
            </div>
            <button
              onClick={() => toggleAvailability(item.id)}
              className={[
                'mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-medium transition-colors',
                item.available
                  ? 'bg-teal/15 text-teal-deep hover:bg-teal/25'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200',
              ].join(' ')}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${item.available ? 'bg-teal-deep' : 'bg-gray-400'}`} />
              {item.available ? 'Available' : '86\'d — out of stock'}
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
