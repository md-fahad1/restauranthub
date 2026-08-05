'use client';

import { useQuery } from '@apollo/client/react';
import { ExternalLink } from 'lucide-react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { GET_ADMIN_RESTAURANTS_QUERY, type AdminRestaurant, type GetAdminRestaurantsData } from '@/lib/graphql/restaurant';

export default function AdminRestaurantsPage() {
  const { data, loading, error } = useQuery<GetAdminRestaurantsData>(GET_ADMIN_RESTAURANTS_QUERY, {
    fetchPolicy: 'cache-and-network',
  });

  const restaurants: AdminRestaurant[] = data?.restaurants ?? [];

  if (error) {
    return (
      <>
        <PageHeader title="Restaurants" subtitle="Failed to load restaurants." />
        <p className="text-sm text-red-500">{error.message}</p>
      </>
    );
  }

  return (
    <>
      <PageHeader title="Restaurants" subtitle={`${restaurants.length} restaurants on the platform.`} />

      <div className="animate-fade-up overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/60 text-xs uppercase tracking-wide text-gray-400">
              <th className="px-5 py-3 font-medium">Restaurant</th>
              <th className="px-5 py-3 font-medium">Owner</th>
              <th className="px-5 py-3 font-medium">Branches</th>
              <th className="px-5 py-3 font-medium">Currency</th>
              <th className="px-5 py-3 font-medium">Joined</th>
            </tr>
          </thead>
          <tbody>
            {loading && !data ? (
              <tr>
                <td colSpan={5} className="px-5 py-6 text-center text-gray-400">
                  Loading restaurants…
                </td>
              </tr>
            ) : restaurants.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-6 text-center text-gray-400">
                  No restaurants yet.
                </td>
              </tr>
            ) : (
              restaurants.map((t) => (
                <tr key={t.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                  <td className="px-5 py-3">
                    <span className="inline-flex items-center gap-1.5 text-ink">
                      {t.name}
                      <ExternalLink size={12} className="text-gray-300" />
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <p className="text-gray-600">
                      {t.owner.firstName} {t.owner.lastName}
                    </p>
                    <p className="text-xs text-gray-400">{t.owner.email}</p>
                  </td>
                  <td className="px-5 py-3 text-gray-500">{t.branchCount}</td>
                  <td className="px-5 py-3 text-gray-500">{t.currency}</td>
                  <td className="px-5 py-3 text-gray-400">
                    {new Date(t.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}