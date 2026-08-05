'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApolloClient } from '@apollo/client/react';
import {
  Search,
  Bell,
  Store,
  ChevronDown,
  User,
  Settings,
  LogOut,
} from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';

export function Topbar({ alertCount = 0 }: { alertCount?: number }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const apolloClient = useApolloClient();

  const storeUser = useAuthStore((s) => s.user);
  const clearSession = useAuthStore((s) => s.clearSession);

  const user = {
    name: storeUser ? `${storeUser.firstName} ${storeUser.lastName}` : 'Owner',
    email: storeUser?.email ?? 'owner@example.com',
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const initials = user.name
    .split(' ')
    .map((item) => item[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  async function handleLogout() {
    clearSession();

    // Drops any cached query results (e.g. `me`, `restaurants`) tied to
    // the session that just ended, so a different user logging in next
    // doesn't briefly see the previous user's cached data.
    await apolloClient.clearStore();

    router.push('/login');
  }

  return (
    <header className="flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4">
      {/* Search */}
      <div className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-400 lg:w-80">
        <Search size={16} />
        <span>Search orders, menu, staff…</span>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        {/* Branch */}
        <button className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-ink transition hover:bg-gray-50">
          <Store size={15} />
          Main Branch
          <ChevronDown size={14} className="text-gray-400" />
        </button>

        {/* Notification */}
        <button className="relative rounded-full p-2 transition hover:bg-gray-50">
          <Bell size={18} className="text-gray-500" />

          {alertCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
              {alertCount}
            </span>
          )}
        </button>

        {/* Profile */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 rounded-lg px-2 py-1 transition hover:bg-gray-50"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ink/10 font-semibold text-ink">
              {initials}
            </div>

            <span className="hidden text-sm font-medium text-ink sm:block">
              {user.name}
            </span>

            <ChevronDown
              size={14}
              className={`text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Dropdown */}
          {open && (
            <div className="absolute right-0 mt-2 w-60 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
              {/* User Info */}
              <div className="border-b border-gray-100 px-4 py-4">
                <p className="font-medium text-gray-900">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>

              {/* Menu */}
              <div className="py-2">
                <Link
                  href="/dashboard/profile"
                  className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 transition hover:bg-gray-50"
                >
                  <User size={17} />
                  Profile
                </Link>

                <Link
                  href="/dashboard/settings"
                  className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 transition hover:bg-gray-50"
                >
                  <Settings size={17} />
                  Settings
                </Link>

                <div className="my-2 border-t border-gray-100" />

                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 px-4 py-3 text-sm text-red-600 transition hover:bg-red-50"
                >
                  <LogOut size={17} />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}