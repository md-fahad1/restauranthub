'use client';

import {
  Download,
  DollarSign,
  ShoppingBag,
  Users,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

import { PageHeader } from '@/components/dashboard/PageHeader';

const TOP_ITEMS = [
  {
    name: 'Classic Burger',
    sold: 245,
    revenue: '$3,675',
  },
  {
    name: 'Chicken Pizza',
    sold: 211,
    revenue: '$4,220',
  },
  {
    name: 'French Fries',
    sold: 198,
    revenue: '$1,584',
  },
  {
    name: 'Cold Coffee',
    sold: 182,
    revenue: '$1,820',
  },
];

const BRANCHES = [
  {
    name: 'Main Branch',
    orders: 1452,
    revenue: '$18,400',
  },
  {
    name: 'Downtown',
    orders: 1128,
    revenue: '$14,900',
  },
  {
    name: 'Airport',
    orders: 804,
    revenue: '$10,700',
  },
];

export default function ReportsPage() {
  return (
    <>
      <PageHeader
        title="Reports & Analytics"
        subtitle="Monitor business performance, sales and restaurant growth."
        action={
          <button className="flex items-center gap-2 rounded-lg bg-ink px-4 py-2 text-sm text-paper transition hover:bg-ink-soft">
            <Download size={16} />
            Export Report
          </button>
        }
      />

      {/* KPI Cards */}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">
              Total Revenue
            </span>

            <div className="rounded-lg bg-green-100 p-2 text-green-600">
              <DollarSign size={20} />
            </div>
          </div>

          <h2 className="mt-4 text-3xl font-bold text-ink">
            $48,950
          </h2>

          <div className="mt-2 flex items-center gap-1 text-sm text-green-600">
            <ArrowUpRight size={15} />
            +18.4% this month
          </div>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">
              Total Orders
            </span>

            <div className="rounded-lg bg-blue-100 p-2 text-blue-600">
              <ShoppingBag size={20} />
            </div>
          </div>

          <h2 className="mt-4 text-3xl font-bold text-ink">
            4,326
          </h2>

          <div className="mt-2 flex items-center gap-1 text-sm text-green-600">
            <ArrowUpRight size={15} />
            +9.2%
          </div>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">
              Customers
            </span>

            <div className="rounded-lg bg-orange-100 p-2 text-orange-600">
              <Users size={20} />
            </div>
          </div>

          <h2 className="mt-4 text-3xl font-bold text-ink">
            1,284
          </h2>

          <div className="mt-2 flex items-center gap-1 text-sm text-green-600">
            <ArrowUpRight size={15} />
            +12.8%
          </div>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">
              Avg Order Value
            </span>

            <div className="rounded-lg bg-purple-100 p-2 text-purple-600">
              <TrendingUp size={20} />
            </div>
          </div>

          <h2 className="mt-4 text-3xl font-bold text-ink">
            $28.50
          </h2>

          <div className="mt-2 flex items-center gap-1 text-sm text-red-500">
            <ArrowDownRight size={15} />
            -2.3%
          </div>
        </div>

      </div>

      {/* Tables */}

      <div className="mt-6 grid gap-6 xl:grid-cols-2">

        {/* Top Selling */}

        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">

          <div className="border-b border-gray-100 px-6 py-4">
            <h2 className="font-semibold text-ink">
              Top Selling Menu
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Best performing menu items this month
            </p>
          </div>

          <table className="w-full text-left text-sm">

            <thead>

              <tr className="border-b bg-gray-50 text-gray-500">

                <th className="px-6 py-3 font-medium">
                  Item
                </th>

                <th className="px-6 py-3 font-medium">
                  Sold
                </th>

                <th className="px-6 py-3 font-medium">
                  Revenue
                </th>

              </tr>

            </thead>

            <tbody>

              {TOP_ITEMS.map((item) => (
                <tr
                  key={item.name}
                  className="border-b last:border-0 hover:bg-gray-50"
                >
                  <td className="px-6 py-4 font-medium text-ink">
                    {item.name}
                  </td>

                  <td className="px-6 py-4 text-gray-500">
                    {item.sold}
                  </td>

                  <td className="px-6 py-4 font-semibold text-green-600">
                    {item.revenue}
                  </td>
                </tr>
              ))}

            </tbody>

          </table>

        </div>

        {/* Branch Performance */}

        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">

          <div className="border-b border-gray-100 px-6 py-4">
            <h2 className="font-semibold text-ink">
              Branch Performance
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Revenue generated by each branch
            </p>
          </div>

          <table className="w-full text-left text-sm">

            <thead>

              <tr className="border-b bg-gray-50 text-gray-500">

                <th className="px-6 py-3 font-medium">
                  Branch
                </th>

                <th className="px-6 py-3 font-medium">
                  Orders
                </th>

                <th className="px-6 py-3 font-medium">
                  Revenue
                </th>

              </tr>

            </thead>

            <tbody>

              {BRANCHES.map((branch) => (
                <tr
                  key={branch.name}
                  className="border-b last:border-0 hover:bg-gray-50"
                >
                  <td className="px-6 py-4 font-medium text-ink">
                    {branch.name}
                  </td>

                  <td className="px-6 py-4 text-gray-500">
                    {branch.orders}
                  </td>

                  <td className="px-6 py-4 font-semibold text-green-600">
                    {branch.revenue}
                  </td>
                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>

      {/* Coming Soon */}

      <div className="mt-6 rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
        <h3 className="text-xl font-semibold text-ink">
          Sales Analytics Chart
        </h3>

        <p className="mt-2 text-gray-500">
          Integrate Recharts or ApexCharts to display daily, weekly and monthly
          sales reports.
        </p>
      </div>
    </>
  );
}