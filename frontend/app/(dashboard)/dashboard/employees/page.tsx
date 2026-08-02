'use client';

import { Plus } from 'lucide-react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { StatusBadge } from '@/components/dashboard/StatusBadge';

interface Employee {
  id: string;
  name: string;
  role: string;
  branch: string;
  status: 'Active' | 'On Leave';
  hiredAt: string;
}

const EMPLOYEES: Employee[] = [
  { id: '1', name: 'Maria Santos', role: 'Manager', branch: 'Main Branch', status: 'Active', hiredAt: 'Jan 2024' },
  { id: '2', name: 'James Okafor', role: 'Cashier', branch: 'Main Branch', status: 'Active', hiredAt: 'Mar 2024' },
  { id: '3', name: 'Priya Nair', role: 'Waiter', branch: 'Main Branch', status: 'Active', hiredAt: 'Jun 2024' },
  { id: '4', name: 'Tomás Reyes', role: 'Kitchen Staff', branch: 'Main Branch', status: 'Active', hiredAt: 'Feb 2024' },
  { id: '5', name: 'Aisha Rahman', role: 'Kitchen Staff', branch: 'Main Branch', status: 'On Leave', hiredAt: 'Sep 2023' },
  { id: '6', name: 'Liam Chen', role: 'Waiter', branch: 'Main Branch', status: 'Active', hiredAt: 'Nov 2024' },
  { id: '7', name: 'Fatima Al-Sayed', role: 'Delivery Rider', branch: 'Main Branch', status: 'Active', hiredAt: 'Apr 2024' },
];

export default function EmployeesPage() {
  return (
    <>
      <PageHeader
        title="Employees"
        subtitle={`${EMPLOYEES.length} staff members at Main Branch.`}
        action={
          <button className="flex items-center gap-1.5 rounded-lg bg-ink px-3.5 py-2 text-sm text-paper hover:bg-ink-soft">
            <Plus size={15} />
            Add employee
          </button>
        }
      />

      <div className="animate-fade-up overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/60 text-xs uppercase tracking-wide text-gray-400">
              <th className="px-5 py-3 font-medium">Name</th>
              <th className="px-5 py-3 font-medium">Role</th>
              <th className="px-5 py-3 font-medium">Branch</th>
              <th className="px-5 py-3 font-medium">Hired</th>
              <th className="px-5 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {EMPLOYEES.map((emp) => (
              <tr key={emp.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ink/5 font-mono text-xs text-ink">
                      {emp.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </div>
                    <span className="text-ink">{emp.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-gray-500">{emp.role}</td>
                <td className="px-5 py-3 text-gray-500">{emp.branch}</td>
                <td className="px-5 py-3 text-gray-400">{emp.hiredAt}</td>
                <td className="px-5 py-3">
                  <StatusBadge status={emp.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
