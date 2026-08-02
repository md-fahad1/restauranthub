'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut, ShieldCheck } from 'lucide-react';
import { ADMIN_NAV_ITEMS } from '@/lib/admin-nav';

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-60 shrink-0 flex-col bg-[#0B1220] px-4 py-6 lg:flex">
      <div className="mb-1 flex items-center gap-2 px-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-teal text-white">
          <ShieldCheck size={16} />
        </div>
        <span className="font-display text-lg text-paper">RestaurantHub</span>
      </div>
      <p className="mb-7 px-2 font-mono text-[10px] uppercase tracking-widest text-teal">Platform Admin</p>

      <nav className="flex flex-1 flex-col gap-1">
        {ADMIN_NAV_ITEMS.map((item) => {
          const active = item.href === '/admin' ? pathname === item.href : pathname?.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[14px] transition-colors',
                active ? 'bg-teal/15 text-teal' : 'text-paper/60 hover:bg-white/5 hover:text-paper',
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
