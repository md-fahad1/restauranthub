'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { NAV_ITEMS } from '@/lib/dashboard-nav';

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-60 shrink-0 flex-col bg-ink px-4 py-6 lg:flex">
      <div className="mb-8 flex items-center gap-2 px-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-ember font-display text-ink">
          R
        </div>
        <span className="font-display text-lg text-paper">RestaurantHub</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          // exact match for the overview page, prefix match for everything else
          // so /dashboard/orders/123 (a future detail page) still highlights "Orders"
          const active = item.href === '/dashboard' ? pathname === item.href : pathname?.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[14px] transition-colors',
                active ? 'bg-ember/15 text-ember' : 'text-paper/60 hover:bg-white/5 hover:text-paper',
              ].join(' ')}
            >
              <item.icon size={17} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <button className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[14px] text-paper/50 hover:bg-white/5 hover:text-paper">
        <LogOut size={17} />
        Log out
      </button>
    </aside>
  );
}
