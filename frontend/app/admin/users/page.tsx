'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@apollo/client/react';
import { Search } from 'lucide-react';

import { GET_USERS } from '@/lib/graphql/users';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: string;
}

interface UsersData {
  users: User[];
}

export default function AdminUsersPage() {
  const [query, setQuery] = useState('');

  const { data, loading, error } = useQuery<UsersData>(GET_USERS);

  const users = data?.users ?? [];

  const filtered = useMemo(() => {
    const q = query.toLowerCase();

    return users.filter(
      (u) =>
        u.firstName.toLowerCase().includes(q) ||
        u.lastName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q),
    );
  }, [users, query]);

  if (loading) {
    return (
      <div className="p-10">
        <p>Loading users...</p>
      </div>
    );
  }

  if (error) {
    console.log(error);

    return (
      <pre className="p-5">
        {JSON.stringify(error, null, 2)}
      </pre>
    );
  }

  return (
    <>
      <PageHeader title="Users" subtitle={`${users.length} registered users`} />

      <div className="mb-4 flex animate-fade-up items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 sm:w-96">
        <Search size={16} className="text-gray-400" />

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search users..."
          className="w-full outline-none"
        />
      </div>

      <div className="animate-fade-up overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/60 text-xs uppercase tracking-wide text-gray-400">
              <th className="px-5 py-3 font-medium">Name</th>
              <th className="px-5 py-3 font-medium">Email</th>
              <th className="px-5 py-3 font-medium">Status</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((user) => (
              <tr key={user.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                <td className="px-5 py-3 text-ink">
                  {user.firstName} {user.lastName}
                </td>

                <td className="px-5 py-3 text-gray-500">{user.email}</td>

                <td className="px-5 py-3">
                  <AdminStatusBadge
                    status={
                      user.status === 'ACTIVE'
                        ? 'Active'
                        : user.status === 'SUSPENDED'
                        ? 'Suspended'
                        : 'Inactive'
                    }
                  />
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={3} className="px-5 py-8 text-center text-gray-400">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}