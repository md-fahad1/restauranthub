'use client';

import { useMemo, useState } from 'react';
import { Search, Ban, CheckCircle2 } from 'lucide-react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';

interface PlatformUser {
  id: string;
  name: string;
  email: string;
  role: string;
  restaurant: string;
  status: 'Active' | 'Suspended';
}

const INITIAL_USERS: PlatformUser[] = [
  { id: '1', name: 'Test Owner', email: 'owner@testrestaurant.dev', role: 'OWNER', restaurant: 'Test Restaurant', status: 'Active' },
  { id: '2', name: 'Super Admin', email: 'admin@restauranthub.dev', role: 'SUPER_ADMIN', restaurant: '—', status: 'Active' },
  { id: '3', name: 'Dana Reyes', email: 'dana@coastalkitchen.dev', role: 'OWNER', restaurant: 'Coastal Kitchen', status: 'Active' },
  { id: '4', name: 'Maria Santos', email: 'maria@testrestaurant.dev', role: 'MANAGER', restaurant: 'Test Restaurant', status: 'Active' },
  { id: '5', name: 'Marcus Webb', email: 'marcus@latenightdiner.dev', role: 'OWNER', restaurant: 'Late Night Diner', status: 'Suspended' },
  { id: '6', name: 'Kenji Watanabe', email: 'kenji@noodlebar.dev', role: 'OWNER', restaurant: 'Noodle Bar Co.', status: 'Active' },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.restaurant.toLowerCase().includes(q));
  }, [users, query]);

  function toggleSuspend(id: string) {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' } : u)));
  }

  return (
    <>
      <PageHeader title="Users" subtitle={`${users.length} accounts across the platform.`} />

      <div className="mb-4 flex animate-fade-up items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 sm:w-96">
        <Search size={16} className="text-gray-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, email, or restaurant…"
          className="w-full text-sm text-ink outline-none placeholder:text-gray-400"
        />
      </div>

      <div className="animate-fade-up overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/60 text-xs uppercase tracking-wide text-gray-400">
              <th className="px-5 py-3 font-medium">Name</th>
              <th className="px-5 py-3 font-medium">Email</th>
              <th className="px-5 py-3 font-medium">Role</th>
              <th className="px-5 py-3 font-medium">Restaurant</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                <td className="px-5 py-3 text-ink">{u.name}</td>
                <td className="px-5 py-3 text-gray-500">{u.email}</td>
                <td className="px-5 py-3">
                  <span className="rounded-md bg-ink/5 px-1.5 py-0.5 font-mono text-[11px] text-ink">{u.role}</span>
                </td>
                <td className="px-5 py-3 text-gray-500">{u.restaurant}</td>
                <td className="px-5 py-3">
                  <AdminStatusBadge status={u.status} />
                </td>
                <td className="px-5 py-3">
                  {u.role !== 'SUPER_ADMIN' && (
                    <button
                      onClick={() => toggleSuspend(u.id)}
                      className={[
                        'inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors',
                        u.status === 'Active'
                          ? 'bg-red-50 text-red-600 hover:bg-red-100'
                          : 'bg-teal/15 text-teal-deep hover:bg-teal/25',
                      ].join(' ')}
                    >
                      {u.status === 'Active' ? (
                        <>
                          <Ban size={13} /> Suspend
                        </>
                      ) : (
                        <>
                          <CheckCircle2 size={13} /> Reactivate
                        </>
                      )}
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-gray-400">
                  No users match "{query}".
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
