'use client';

import { useMemo, useState } from 'react';
import {
  Search,
  Plus,
  Mail,
  Phone,
  Eye,
} from 'lucide-react';

import { PageHeader } from '@/components/dashboard/PageHeader';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  orders: number;
  totalSpent: number;
  lastVisit: string;
}

const CUSTOMERS: Customer[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@example.com',
    phone: '+8801711111111',
    orders: 14,
    totalSpent: 520,
    lastVisit: 'Today',
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    phone: '+8801722222222',
    orders: 9,
    totalSpent: 310,
    lastVisit: 'Yesterday',
  },
  {
    id: '3',
    name: 'Michael Brown',
    email: 'michael@example.com',
    phone: '+8801733333333',
    orders: 27,
    totalSpent: 1240,
    lastVisit: '2 days ago',
  },
  {
    id: '4',
    name: 'Emily Davis',
    email: 'emily@example.com',
    phone: '+8801744444444',
    orders: 5,
    totalSpent: 180,
    lastVisit: 'Last Week',
  },
  {
    id: '5',
    name: 'David Wilson',
    email: 'david@example.com',
    phone: '+8801755555555',
    orders: 31,
    totalSpent: 2450,
    lastVisit: 'Today',
  },
];

export default function CustomersPage() {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const keyword = search.toLowerCase();

    return CUSTOMERS.filter(
      (customer) =>
        customer.name.toLowerCase().includes(keyword) ||
        customer.email.toLowerCase().includes(keyword) ||
        customer.phone.includes(keyword),
    );
  }, [search]);

  return (
    <>
      <PageHeader
        title="Customers"
        subtitle={`${CUSTOMERS.length} registered customers.`}
        action={
          <button className="flex items-center gap-2 rounded-lg bg-ink px-4 py-2 text-sm text-paper transition hover:bg-ink-soft">
            <Plus size={16} />
            Add Customer
          </button>
        }
      />

      {/* Statistics */}

      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total Customers</p>
          <h2 className="mt-2 text-3xl font-bold text-ink">
            {CUSTOMERS.length}
          </h2>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Today's Visits</p>
          <h2 className="mt-2 text-3xl font-bold text-green-600">
            24
          </h2>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">VIP Customers</p>
          <h2 className="mt-2 text-3xl font-bold text-yellow-600">
            12
          </h2>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Average Spend</p>
          <h2 className="mt-2 text-3xl font-bold text-blue-600">
            $84
          </h2>
        </div>
      </div>

      {/* Search */}

      <div className="mb-5 flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 sm:w-96">
        <Search
          size={16}
          className="text-gray-400"
        />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search customer..."
          className="w-full text-sm outline-none"
        />
      </div>

      {/* Table */}

      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b bg-gray-50 text-xs uppercase tracking-wide text-gray-400">
              <th className="px-5 py-3">Customer</th>
              <th className="px-5 py-3">Phone</th>
              <th className="px-5 py-3">Orders</th>
              <th className="px-5 py-3">Total Spent</th>
              <th className="px-5 py-3">Last Visit</th>
              <th className="px-5 py-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((customer) => (
              <tr
                key={customer.id}
                className="border-b last:border-0 hover:bg-gray-50"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ink/5 font-semibold text-ink">
                      {customer.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </div>

                    <div>
                      <p className="font-medium text-ink">
                        {customer.name}
                      </p>

                      <div className="mt-1 flex items-center gap-1 text-xs text-gray-400">
                        <Mail size={12} />
                        {customer.email}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="px-5 py-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone size={14} />
                    {customer.phone}
                  </div>
                </td>

                <td className="px-5 py-4 font-medium">
                  {customer.orders}
                </td>

                <td className="px-5 py-4 font-semibold text-green-600">
                  ${customer.totalSpent}
                </td>

                <td className="px-5 py-4 text-gray-500">
                  {customer.lastVisit}
                </td>

                <td className="px-5 py-4">
                  <button className="rounded-lg bg-ink/5 p-2 transition hover:bg-ink hover:text-white">
                    <Eye size={16} />
                  </button>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="py-12 text-center text-gray-400"
                >
                  No customers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}