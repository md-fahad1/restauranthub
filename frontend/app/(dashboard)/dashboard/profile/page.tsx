'use client';

import { useQuery } from '@apollo/client/react';
import { Mail, Phone, Calendar, Clock, ShieldCheck } from 'lucide-react';

import { GET_ME_QUERY, type MeData } from '@/lib/graphql/users';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';

export default function ProfilePage() {
  const { data, loading, error } = useQuery<MeData>(GET_ME_QUERY);

  if (loading) {
    return (
      <div className="p-10">
        <p>Loading profile...</p>
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

  const user = data?.me;

  if (!user) {
    return (
      <div className="p-10">
        <p className="text-gray-400">No profile data found.</p>
      </div>
    );
  }

  const initials = `${user.firstName[0] ?? ''}${user.lastName[0] ?? ''}`.toUpperCase();

  return (
    <>
      <PageHeader title="Profile" subtitle="Your account details" />

      <div className="animate-fade-up overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        {/* Header block */}
        <div className="flex items-center gap-4 border-b border-gray-100 px-6 py-6">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={`${user.firstName} ${user.lastName}`}
              className="h-16 w-16 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-ink/10 text-xl font-semibold text-ink">
              {initials}
            </div>
          )}

          <div>
            <p className="text-lg font-medium text-ink">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-sm text-gray-500">{user.email}</p>
            <div className="mt-1">
              <AdminStatusBadge
                status={
                  user.status === 'ACTIVE'
                    ? 'Active'
                    : user.status === 'SUSPENDED'
                    ? 'Suspended'
                    : 'Inactive'
                }
              />
            </div>
          </div>
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-1 gap-4 px-6 py-6 sm:grid-cols-2">
          <div className="flex items-center gap-3">
            <Mail size={16} className="text-gray-400" />
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-400">Email</p>
              <p className="text-sm text-ink">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Phone size={16} className="text-gray-400" />
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-400">Phone</p>
              <p className="text-sm text-ink">{user.phone ?? '—'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ShieldCheck size={16} className="text-gray-400" />
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-400">Email verified</p>
              <p className="text-sm text-ink">
                {user.emailVerifiedAt
                  ? new Date(user.emailVerifiedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : 'Not verified'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Clock size={16} className="text-gray-400" />
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-400">Last login</p>
              <p className="text-sm text-ink">
                {user.lastLoginAt
                  ? new Date(user.lastLoginAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : 'Never'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Calendar size={16} className="text-gray-400" />
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-400">Member since</p>
              <p className="text-sm text-ink">
                {new Date(user.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}