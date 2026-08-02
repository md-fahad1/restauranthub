const STATUS_STYLES: Record<string, string> = {
  // order lifecycle
  Pending: 'bg-gray-200 text-gray-600',
  Preparing: 'bg-ember/15 text-ember-deep',
  Ready: 'bg-teal/15 text-teal-deep',
  Served: 'bg-ink/10 text-ink',
  Completed: 'bg-ink/10 text-ink',
  Cancelled: 'bg-red-50 text-red-600',
  // table status
  Available: 'bg-teal/15 text-teal-deep',
  Occupied: 'bg-ember/15 text-ember-deep',
  Reserved: 'bg-indigo-50 text-indigo-600',
  Cleaning: 'bg-gray-200 text-gray-600',
  // employee / stock status
  Active: 'bg-teal/15 text-teal-deep',
  'On Leave': 'bg-gray-200 text-gray-600',
  Low: 'bg-ember/15 text-ember-deep',
  Critical: 'bg-red-50 text-red-600',
  'In Stock': 'bg-teal/15 text-teal-deep',
};

export function StatusBadge({ status }: { status: string }) {
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
