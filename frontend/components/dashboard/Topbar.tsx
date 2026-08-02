'use client';

import { Search, Bell, Store, ChevronDown } from 'lucide-react';

export function Topbar({ alertCount = 0 }: { alertCount?: number }) {
  return (
    <header className="flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4">
      <div className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-400 lg:w-80">
        <Search size={16} />
        <span>Search orders, menu, staff…</span>
      </div>

      <div className="flex items-center gap-4">
        <button className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-ink">
          <Store size={15} />
          Main Branch
          <ChevronDown size={14} className="text-gray-400" />
        </button>
        <button className="relative rounded-full p-2 hover:bg-gray-50">
          <Bell size={18} className="text-gray-500" />
          {alertCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-ember text-[10px] text-white">
              {alertCount}
            </span>
          )}
        </button>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-ink/10" />
          <span className="hidden text-sm text-ink sm:block">Owner</span>
        </div>
      </div>
    </header>
  );
}
