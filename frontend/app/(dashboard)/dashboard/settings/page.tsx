'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/dashboard/PageHeader';

function Field({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="mb-1.5 block text-[13px] font-medium text-gray-500">{label}</label>
      <input
        {...props}
        className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-[14px] text-ink outline-none transition-colors focus:border-ember"
      />
    </div>
  );
}

const TABS = ['Restaurant Profile', 'Branches', 'Notifications'] as const;

export default function SettingsPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]>('Restaurant Profile');
  const [saved, setSaved] = useState(false);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <>
      <PageHeader title="Settings" subtitle="Manage your restaurant profile and preferences." />

      <div className="mb-5 flex animate-fade-up gap-2 border-b border-gray-200">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={[
              'border-b-2 px-1 pb-3 text-sm transition-colors',
              tab === t ? 'border-ember text-ink' : 'border-transparent text-gray-400 hover:text-gray-600',
            ].join(' ')}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'Restaurant Profile' && (
        <form
          onSubmit={handleSave}
          className="max-w-2xl animate-fade-up rounded-xl border border-gray-100 bg-white p-6 shadow-sm"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Restaurant name" defaultValue="Test Restaurant" />
            <Field label="Contact email" type="email" defaultValue="hello@testrestaurant.dev" />
            <Field label="Phone" defaultValue="+880 1234 567890" />
            <Field label="Currency" defaultValue="BDT" />
            <Field label="Timezone" defaultValue="Asia/Dhaka" />
            <Field label="Website" placeholder="https://" />
          </div>

          <div className="mt-6 flex items-center gap-3">
            <button type="submit" className="rounded-lg bg-ink px-4 py-2.5 text-sm text-paper hover:bg-ink-soft">
              Save changes
            </button>
            {saved && <span className="text-sm text-teal-deep">Saved.</span>}
          </div>
        </form>
      )}

      {tab === 'Branches' && (
        <div className="max-w-2xl animate-fade-up rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50/60 p-4">
            <div>
              <p className="text-[14px] text-ink">Main Branch</p>
              <p className="text-xs text-gray-400">123 Example Street, Dhaka</p>
            </div>
            <span className="rounded-full bg-teal/15 px-2 py-0.5 text-xs font-medium text-teal-deep">Active</span>
          </div>
          <button className="mt-4 text-sm font-medium text-ember-deep">+ Add another branch</button>
        </div>
      )}

      {tab === 'Notifications' && (
        <div className="max-w-2xl animate-fade-up rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          {['New order alerts', 'Low stock warnings', 'Daily revenue summary'].map((label) => (
            <label key={label} className="flex items-center justify-between border-b border-gray-50 py-3 last:border-0">
              <span className="text-[14px] text-ink">{label}</span>
              <input type="checkbox" defaultChecked className="h-4 w-4 accent-ember" />
            </label>
          ))}
        </div>
      )}
    </>
  );
}
