'use client';

import { Plus, Pencil, Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/dashboard/PageHeader';

interface Category {
  id: string;
  name: string;
  items: number;
  status: 'Active' | 'Hidden';
  createdAt: string;
}

const CATEGORIES: Category[] = [
  {
    id: '1',
    name: 'Burgers',
    items: 12,
    status: 'Active',
    createdAt: '15 Jan 2025',
  },
  {
    id: '2',
    name: 'Pizza',
    items: 18,
    status: 'Active',
    createdAt: '18 Jan 2025',
  },
  {
    id: '3',
    name: 'Drinks',
    items: 25,
    status: 'Active',
    createdAt: '20 Jan 2025',
  },
  {
    id: '4',
    name: 'Desserts',
    items: 10,
    status: 'Hidden',
    createdAt: '22 Jan 2025',
  },
  {
    id: '5',
    name: 'Sea Food',
    items: 9,
    status: 'Active',
    createdAt: '25 Jan 2025',
  },
];

export default function CategoriesPage() {
  return (
    <>
      <PageHeader
        title="Categories"
        subtitle={`${CATEGORIES.length} categories available in your restaurant.`}
        action={
          <button className="flex items-center gap-2 rounded-lg bg-ink px-4 py-2 text-sm font-medium text-paper transition hover:bg-ink-soft">
            <Plus size={16} />
            Add Category
          </button>
        }
      />

      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm animate-fade-up">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/70 text-xs uppercase tracking-wider text-gray-500">
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Menu Items</th>
              <th className="px-6 py-4">Created</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {CATEGORIES.map((category) => (
              <tr
                key={category.id}
                className="border-b border-gray-100 transition hover:bg-gray-50"
              >
                <td className="px-6 py-4">
                  <div className="font-medium text-ink">
                    {category.name}
                  </div>
                </td>

                <td className="px-6 py-4 text-gray-600">
                  {category.items} Items
                </td>

                <td className="px-6 py-4 text-gray-500">
                  {category.createdAt}
                </td>

                <td className="px-6 py-4">
                  {category.status === 'Active' ? (
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                      Active
                    </span>
                  ) : (
                    <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                      Hidden
                    </span>
                  )}
                </td>

                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2">
                    <button className="rounded-lg border p-2 text-gray-500 transition hover:bg-gray-100 hover:text-blue-600">
                      <Pencil size={16} />
                    </button>

                    <button className="rounded-lg border p-2 text-gray-500 transition hover:bg-red-50 hover:text-red-600">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}