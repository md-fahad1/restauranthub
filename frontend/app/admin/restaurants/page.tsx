'use client';

import { useMemo, useState } from 'react';
import { Ban, CheckCircle2, ExternalLink } from 'lucide-react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';

interface Tenant {
  id: string;
  name: string;
  owner: string;
  ownerEmail: string;
  plan: 'Free' | 'Basic' | 'Professional' | 'Enterprise';
  branches: number;
  joined: string;
  status: 'Active' | 'Suspended';
}

const INITIAL_TENANTS: Tenant[] = [
  { id: '1', name: 'Test Restaurant', owner: 'Test Owner', ownerEmail: 'owner@testrestaurant.dev', plan: 'Professional', branches: 1, joined: 'Jan 2026', status: 'Active' },
  { id: '2', name: 'Coastal Kitchen', owner: 'Dana Reyes', ownerEmail: 'dana@coastalkitchen.dev', plan: 'Professional', branches: 2, joined: 'Jul 2026', status: 'Active' },
  { id: '3', name: 'Spice Route', owner: 'Ahmed Karim', ownerEmail: 'ahmed@spiceroute.dev', plan: 'Basic', branches: 1, joined: 'Jul 2026', status: 'Active' },
  { id: '4', name: 'The Grillhouse', owner: 'Sofia Marin', ownerEmail: 'sofia@grillhouse.dev', plan: 'Professional', branches: 3, joined: 'Jun 2026', status: 'Active' },
  { id: '5', name: 'Late Night Diner', owner: 'Marcus Webb', ownerEmail: 'marcus@latenightdiner.dev', plan: 'Basic', branches: 1, joined: 'Mar 2026', status: 'Suspended' },
  { id: '6', name: 'Noodle Bar Co.', owner: 'Kenji Watanabe', ownerEmail: 'kenji@noodlebar.dev', plan: 'Free', branches: 1, joined: 'Jul 2026', status: 'Active' },
];

const FILTERS = ['All', 'Active', 'Suspended'] as const;

export default function AdminRestaurantsPage() {
  const [tenants, setTenants] = useState(INITIAL_TENANTS);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('All');

  const filtered = useMemo(
    () => (filter === 'All' ? tenants : tenants.filter((t) => t.status === filter)),
    [tenants, filter],
  );

  function toggleSuspend(id: string) {
    setTenants((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: t.status === 'Active' ? 'Suspended' : 'Active' } : t)),
    );
  }

  return (
    <>
      <PageHeader title="Restaurants" subtitle={`${tenants.length} restaurants on the platform.`} />

      <div className="mb-4 flex animate-fade-up gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={[
              'rounded-full border px-3.5 py-1.5 text-sm transition-colors',
              filter === f ? 'border-ink bg-ink text-paper' : 'border-gray-200 text-gray-500 hover:border-gray-300',
            ].join(' ')}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="animate-fade-up overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/60 text-xs uppercase tracking-wide text-gray-400">
              <th className="px-5 py-3 font-medium">Restaurant</th>
              <th className="px-5 py-3 font-medium">Owner</th>
              <th className="px-5 py-3 font-medium">Plan</th>
              <th className="px-5 py-3 font-medium">Branches</th>
              <th className="px-5 py-3 font-medium">Joined</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t) => (
              <tr key={t.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                <td className="px-5 py-3">
                  <span className="inline-flex items-center gap-1.5 text-ink">
                    {t.name}
                    <ExternalLink size={12} className="text-gray-300" />
                  </span>
                </td>
                <td className="px-5 py-3">
                  <p className="text-gray-600">{t.owner}</p>
                  <p className="text-xs text-gray-400">{t.ownerEmail}</p>
                </td>
                <td className="px-5 py-3 text-gray-500">{t.plan}</td>
                <td className="px-5 py-3 text-gray-500">{t.branches}</td>
                <td className="px-5 py-3 text-gray-400">{t.joined}</td>
                <td className="px-5 py-3">
                  <AdminStatusBadge status={t.status} />
                </td>
                <td className="px-5 py-3">
                  <button
                    onClick={() => toggleSuspend(t.id)}
                    className={[
                      'inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors',
                      t.status === 'Active'
                        ? 'bg-red-50 text-red-600 hover:bg-red-100'
                        : 'bg-teal/15 text-teal-deep hover:bg-teal/25',
                    ].join(' ')}
                  >
                    {t.status === 'Active' ? (
                      <>
                        <Ban size={13} /> Suspend
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={13} /> Reactivate
                      </>
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
