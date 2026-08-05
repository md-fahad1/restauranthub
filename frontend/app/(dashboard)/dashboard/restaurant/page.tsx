'use client';

import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Crown,
  Pencil,
} from 'lucide-react';

import { PageHeader } from '@/components/dashboard/PageHeader';

export default function RestaurantPage() {
  return (
    <>
      <PageHeader
        title="Restaurant"
        subtitle="Manage your restaurant information."
        action={
          <button className="flex items-center gap-2 rounded-lg bg-ink px-4 py-2 text-sm text-paper transition hover:bg-ink-soft">
            <Pencil size={16} />
            Edit Restaurant
          </button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Side */}
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">

            <div className="border-b border-gray-100 px-6 py-5">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-amber-100">
                  <Building2
                    size={30}
                    className="text-amber-600"
                  />
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-ink">
                    Coastal Kitchen
                  </h2>

                  <p className="text-sm text-gray-500">
                    Premium Restaurant Management
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-6 p-6 md:grid-cols-2">

              <div>
                <label className="text-xs uppercase tracking-wide text-gray-400">
                  Restaurant Name
                </label>

                <p className="mt-1 text-sm font-medium text-ink">
                  Coastal Kitchen
                </p>
              </div>

              <div>
                <label className="text-xs uppercase tracking-wide text-gray-400">
                  Email
                </label>

                <div className="mt-1 flex items-center gap-2 text-sm text-gray-700">
                  <Mail size={15} />
                  contact@coastalkitchen.com
                </div>
              </div>

              <div>
                <label className="text-xs uppercase tracking-wide text-gray-400">
                  Phone
                </label>

                <div className="mt-1 flex items-center gap-2 text-sm text-gray-700">
                  <Phone size={15} />
                  +8801712345678
                </div>
              </div>

              <div>
                <label className="text-xs uppercase tracking-wide text-gray-400">
                  Address
                </label>

                <div className="mt-1 flex items-center gap-2 text-sm text-gray-700">
                  <MapPin size={15} />
                  Dhanmondi, Dhaka
                </div>
              </div>

              <div>
                <label className="text-xs uppercase tracking-wide text-gray-400">
                  Created
                </label>

                <div className="mt-1 flex items-center gap-2 text-sm text-gray-700">
                  <Calendar size={15} />
                  20 July 2026
                </div>
              </div>

              <div>
                <label className="text-xs uppercase tracking-wide text-gray-400">
                  Owner
                </label>

                <p className="mt-1 text-sm font-medium text-ink">
                  Fahad Khan
                </p>
              </div>

            </div>
          </div>
        </div>

        {/* Right Side */}

        <div className="space-y-6">

          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">

            <div className="flex items-center gap-3">

              <div className="rounded-lg bg-yellow-100 p-3">
                <Crown
                  size={22}
                  className="text-yellow-600"
                />
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-gray-400">
                  Subscription
                </p>

                <h3 className="text-lg font-semibold text-ink">
                  Premium Plan
                </h3>
              </div>

            </div>

            <div className="mt-6 rounded-lg bg-green-50 px-4 py-3">

              <p className="text-sm font-medium text-green-700">
                Active
              </p>

              <p className="mt-1 text-xs text-green-600">
                Your subscription is active until
                <br />
                30 December 2026.
              </p>

            </div>

          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">

            <h3 className="mb-4 text-lg font-semibold text-ink">
              Quick Statistics
            </h3>

            <div className="space-y-4">

              <div className="flex justify-between">
                <span className="text-sm text-gray-500">
                  Branches
                </span>

                <span className="font-semibold">
                  3
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-gray-500">
                  Employees
                </span>

                <span className="font-semibold">
                  28
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-gray-500">
                  Tables
                </span>

                <span className="font-semibold">
                  45
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-gray-500">
                  Menu Items
                </span>

                <span className="font-semibold">
                  112
                </span>
              </div>

            </div>

          </div>

        </div>
      </div>
    </>
  );
}