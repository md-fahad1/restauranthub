'use client';

import { useMemo, useState } from 'react';
import {
  Search,
  Plus,
  Building2,
  Users,
  DollarSign,
  Store,
  Eye,
  Pencil,
  Trash2,
  MapPin,
  Phone,
} from 'lucide-react';

import { PageHeader } from '@/components/dashboard/PageHeader';

interface Branch {
  id: string;
  name: string;
  manager: string;
  phone: string;
  address: string;
  employees: number;
  tables: number;
  sales: number;
  status: 'Active' | 'Inactive';
}

const BRANCHES: Branch[] = [
  {
    id: '1',
    name: 'Main Branch',
    manager: 'John Smith',
    phone: '+8801711111111',
    address: 'Dhanmondi, Dhaka',
    employees: 18,
    tables: 32,
    sales: 2850,
    status: 'Active',
  },
  {
    id: '2',
    name: 'Banani Branch',
    manager: 'Sarah Khan',
    phone: '+8801722222222',
    address: 'Banani, Dhaka',
    employees: 14,
    tables: 26,
    sales: 1980,
    status: 'Active',
  },
  {
    id: '3',
    name: 'Uttara Branch',
    manager: 'Michael Lee',
    phone: '+8801733333333',
    address: 'Uttara, Dhaka',
    employees: 12,
    tables: 20,
    sales: 1540,
    status: 'Inactive',
  },
];

export default function BranchesPage() {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const keyword = search.toLowerCase();

    return BRANCHES.filter(
      (branch) =>
        branch.name.toLowerCase().includes(keyword) ||
        branch.manager.toLowerCase().includes(keyword) ||
        branch.address.toLowerCase().includes(keyword)
    );
  }, [search]);

  return (
    <>
      <PageHeader
        title="Branches"
        subtitle={`${BRANCHES.length} restaurant branches.`}
        action={
          <button className="flex items-center gap-2 rounded-lg bg-ink px-4 py-2 text-sm text-paper transition hover:bg-ink-soft">
            <Plus size={16} />
            Add Branch
          </button>
        }
      />

      {/* Statistics */}

      <div className="mb-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Branches</p>
              <h2 className="mt-2 text-3xl font-bold text-ink">
                {BRANCHES.length}
              </h2>
            </div>

            <div className="rounded-xl bg-blue-100 p-3">
              <Building2 className="text-blue-600" size={22}/>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Employees</p>
              <h2 className="mt-2 text-3xl font-bold text-ink">
                44
              </h2>
            </div>

            <div className="rounded-xl bg-green-100 p-3">
              <Users className="text-green-600" size={22}/>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Today's Sales</p>
              <h2 className="mt-2 text-3xl font-bold text-ink">
                $6,370
              </h2>
            </div>

            <div className="rounded-xl bg-yellow-100 p-3">
              <DollarSign className="text-yellow-600" size={22}/>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Branches</p>
              <h2 className="mt-2 text-3xl font-bold text-green-600">
                2
              </h2>
            </div>

            <div className="rounded-xl bg-emerald-100 p-3">
              <Store className="text-emerald-600" size={22}/>
            </div>
          </div>
        </div>

      </div>

      {/* Search */}

      <div className="mb-5 flex items-center gap-2 rounded-lg border bg-white px-3 py-2 sm:w-96">
        <Search size={16} className="text-gray-400"/>

        <input
          placeholder="Search branch..."
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
          className="w-full outline-none"
        />
      </div>

      {/* Table */}

      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">

        <table className="w-full text-left">

          <thead>

            <tr className="border-b bg-gray-50 text-xs uppercase tracking-wider text-gray-500">

              <th className="px-6 py-4">Branch</th>

              <th className="px-6 py-4">Manager</th>

              <th className="px-6 py-4">Employees</th>

              <th className="px-6 py-4">Tables</th>

              <th className="px-6 py-4">Today's Sales</th>

              <th className="px-6 py-4">Status</th>

              <th className="px-6 py-4 text-right">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {filtered.map((branch)=>(

              <tr
                key={branch.id}
                className="border-b hover:bg-gray-50"
              >

                <td className="px-6 py-5">

                  <div className="font-semibold text-ink">
                    {branch.name}
                  </div>

                  <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
                    <MapPin size={13}/>
                    {branch.address}
                  </div>

                  <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                    <Phone size={13}/>
                    {branch.phone}
                  </div>

                </td>

                <td className="px-6 py-5">
                  {branch.manager}
                </td>

                <td className="px-6 py-5">
                  {branch.employees}
                </td>

                <td className="px-6 py-5">
                  {branch.tables}
                </td>

                <td className="px-6 py-5 font-semibold text-green-600">
                  ${branch.sales}
                </td>

                <td className="px-6 py-5">

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      branch.status === 'Active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {branch.status}
                  </span>

                </td>

                <td className="px-6 py-5">

                  <div className="flex justify-end gap-2">

                    <button className="rounded-lg border p-2 hover:bg-gray-100">
                      <Eye size={16}/>
                    </button>

                    <button className="rounded-lg border p-2 hover:bg-blue-50 hover:text-blue-600">
                      <Pencil size={16}/>
                    </button>

                    <button className="rounded-lg border p-2 hover:bg-red-50 hover:text-red-600">
                      <Trash2 size={16}/>
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