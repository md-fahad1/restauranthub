'use client';

import { PageHeader } from '@/components/dashboard/PageHeader';
import { Plus } from 'lucide-react';

interface StockItem {
  id: string;
  name: string;
  category: string;
  current: number;
  max: number;
  unit: string;
  supplier: string;
}

const STOCK: StockItem[] = [
  { id: '1', name: 'Chicken Breast', category: 'Meat', current: 8, max: 50, unit: 'kg', supplier: 'Fresh Farms Co.' },
  { id: '2', name: 'Mozzarella', category: 'Dairy', current: 3, max: 20, unit: 'kg', supplier: 'Dairy Direct' },
  { id: '3', name: 'Tomatoes', category: 'Produce', current: 6, max: 30, unit: 'kg', supplier: 'Green Valley' },
  { id: '4', name: 'Olive Oil', category: 'Pantry', current: 18, max: 25, unit: 'L', supplier: 'Mediterra Imports' },
  { id: '5', name: 'Flour', category: 'Pantry', current: 42, max: 50, unit: 'kg', supplier: 'Mediterra Imports' },
  { id: '6', name: 'Lettuce', category: 'Produce', current: 4, max: 15, unit: 'kg', supplier: 'Green Valley' },
  { id: '7', name: 'Beef Mince', category: 'Meat', current: 22, max: 40, unit: 'kg', supplier: 'Fresh Farms Co.' },
  { id: '8', name: 'Parmesan', category: 'Dairy', current: 9, max: 12, unit: 'kg', supplier: 'Dairy Direct' },
];

function severity(current: number, max: number): { label: string; pct: number; barColor: string; textColor: string } {
  const pct = Math.round((current / max) * 100);
  if (pct <= 15) return { label: 'Critical', pct, barColor: 'bg-red-400', textColor: 'text-red-600' };
  if (pct <= 35) return { label: 'Low', pct, barColor: 'bg-ember', textColor: 'text-ember-deep' };
  return { label: 'In Stock', pct, barColor: 'bg-teal', textColor: 'text-teal-deep' };
}

export default function InventoryPage() {
  return (
    <>
      <PageHeader
        title="Inventory"
        subtitle={`${STOCK.length} tracked ingredients across ${new Set(STOCK.map((s) => s.category)).size} categories.`}
        action={
          <button className="flex items-center gap-1.5 rounded-lg bg-ink px-3.5 py-2 text-sm text-paper hover:bg-ink-soft">
            <Plus size={15} />
            Record delivery
          </button>
        }
      />

      <div className="animate-fade-up overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/60 text-xs uppercase tracking-wide text-gray-400">
              <th className="px-5 py-3 font-medium">Ingredient</th>
              <th className="px-5 py-3 font-medium">Category</th>
              <th className="px-5 py-3 font-medium">Supplier</th>
              <th className="px-5 py-3 font-medium">Stock level</th>
              <th className="px-5 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {STOCK.map((item) => {
              const s = severity(item.current, item.max);
              return (
                <tr key={item.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                  <td className="px-5 py-3 text-ink">{item.name}</td>
                  <td className="px-5 py-3 text-gray-500">{item.category}</td>
                  <td className="px-5 py-3 text-gray-500">{item.supplier}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-28 overflow-hidden rounded-full bg-gray-100">
                        <div className={`h-full rounded-full ${s.barColor}`} style={{ width: `${s.pct}%` }} />
                      </div>
                      <span className="whitespace-nowrap text-xs text-gray-400">
                        {item.current}/{item.max} {item.unit}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-medium ${s.textColor}`}>{s.label}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
