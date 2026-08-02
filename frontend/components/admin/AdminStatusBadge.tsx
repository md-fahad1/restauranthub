const STATUS_STYLES: Record<string, string> = {
  Active: 'bg-teal/15 text-teal-deep',
  Trial: 'bg-indigo-50 text-indigo-600',
  'Expiring soon': 'bg-ember/15 text-ember-deep',
  Expired: 'bg-red-50 text-red-600',
  Cancelled: 'bg-gray-200 text-gray-600',
  Suspended: 'bg-red-50 text-red-600',
  Inactive: 'bg-gray-200 text-gray-600',
};

export function AdminStatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
        STATUS_STYLES[status] ?? 'bg-gray-200 text-gray-600'
      }`}
    >
      {status}
    </span>
  );
}
