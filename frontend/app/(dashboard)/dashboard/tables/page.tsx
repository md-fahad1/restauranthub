'use client';

import { useState, useMemo, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { Users, Plus, Pencil, Trash2, X, Loader2 } from 'lucide-react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import {
  GET_TABLES_QUERY,
  CREATE_TABLE_MUTATION,
  UPDATE_TABLE_MUTATION,
  DELETE_TABLE_MUTATION,
  DiningTable,
  GetTablesData,
} from '@/lib/graphql/tables';
import { MY_RESTAURANT } from '@/lib/graphql/restaurant'; // adjust to the actual path where MY_RESTAURANT lives

interface Branch {
  id: string;
  name: string;
  city: string;
  address: string;
}

interface MyRestaurantData {
  myRestaurant: {
    id: string;
    name: string;
    branches: Branch[];
  };
}

type Status = DiningTable['status'];

const STATUS_LABEL: Record<Status, string> = {
  AVAILABLE: 'Available',
  OCCUPIED: 'Occupied',
  RESERVED: 'Reserved',
  CLEANING: 'Cleaning',
  OUT_OF_SERVICE: 'Out of Service',
};

const STATUS_CARD: Record<Status, string> = {
  AVAILABLE: 'border-teal/30 bg-teal/5',
  OCCUPIED: 'border-ember/30 bg-ember/5',
  RESERVED: 'border-indigo-200 bg-indigo-50/60',
  CLEANING: 'border-gray-200 bg-gray-50',
  OUT_OF_SERVICE: 'border-red-200 bg-red-50/60',
};

const STATUS_DOT: Record<Status, string> = {
  AVAILABLE: 'bg-teal-deep',
  OCCUPIED: 'bg-ember-deep',
  RESERVED: 'bg-indigo-500',
  CLEANING: 'bg-gray-400',
  OUT_OF_SERVICE: 'bg-red-500',
};

const STATUS_OPTIONS: Status[] = ['AVAILABLE', 'OCCUPIED', 'RESERVED', 'CLEANING', 'OUT_OF_SERVICE'];

interface FormState {
  tableNumber: string;
  name: string;
  capacity: string;
  location: string;
  status: Status;
}

const EMPTY_FORM: FormState = {
  tableNumber: '',
  name: '',
  capacity: '2',
  location: '',
  status: 'AVAILABLE',
};

export default function TablesPage() {
  // 1. Load the restaurant + its branches. restaurantId comes from here,
  // branchId comes from whichever branch is selected below.
  const {
    data: restaurantData,
    loading: restaurantLoading,
    error: restaurantError,
  } = useQuery<MyRestaurantData>(MY_RESTAURANT);

  const restaurantId = restaurantData?.myRestaurant?.id;
  const branches = restaurantData?.myRestaurant?.branches ?? [];

  const [selectedBranchId, setSelectedBranchId] = useState<string>('');

  // Default to the first branch once branches load
  useEffect(() => {
    if (!selectedBranchId && branches.length > 0) {
      setSelectedBranchId(branches[0].id);
    }
  }, [branches, selectedBranchId]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTable, setEditingTable] = useState<DiningTable | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [deleteTarget, setDeleteTarget] = useState<DiningTable | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    data: tablesData,
    loading: tablesLoading,
    error: tablesError,
    refetch,
  } = useQuery<GetTablesData>(GET_TABLES_QUERY, {
    variables: { restaurantId, branchId: selectedBranchId },
    skip: !restaurantId || !selectedBranchId,
  });

  const [createTable, { loading: creating }] = useMutation(CREATE_TABLE_MUTATION);
  const [updateTable, { loading: updating }] = useMutation(UPDATE_TABLE_MUTATION);
  const [deleteTable, { loading: deleting }] = useMutation(DELETE_TABLE_MUTATION);

  const tables = tablesData?.tables ?? [];

  const counts = useMemo(
    () =>
      tables.reduce((acc: Record<Status, number>, t: DiningTable) => {
        acc[t.status] = (acc[t.status] ?? 0) + 1;
        return acc;
      }, {} as Record<Status, number>),
    [tables]
  );

  function openCreateModal() {
    setEditingTable(null);
    setForm(EMPTY_FORM);
    setFormError(null);
    setModalOpen(true);
  }

  function openEditModal(table: DiningTable) {
    setEditingTable(table);
    setForm({
      tableNumber: table.tableNumber,
      name: table.name ?? '',
      capacity: String(table.capacity),
      location: table.location ?? '',
      status: table.status,
    });
    setFormError(null);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingTable(null);
    setFormError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    if (!restaurantId) {
      setFormError('Restaurant not loaded yet');
      return;
    }

    const capacityNum = Number(form.capacity);
    if (!form.tableNumber.trim()) {
      setFormError('Table number is required');
      return;
    }
    if (!capacityNum || capacityNum < 1) {
      setFormError('Capacity must be at least 1');
      return;
    }

    try {
      if (editingTable) {
        await updateTable({
          variables: {
            input: {
              restaurantId,
              tableId: editingTable.id,
              tableNumber: form.tableNumber,
              name: form.name || undefined,
              capacity: capacityNum,
              location: form.location || undefined,
              status: form.status,
            },
          },
        });
      } else {
        await createTable({
          variables: {
            input: {
              restaurantId,
              branchId: selectedBranchId,
              tableNumber: form.tableNumber,
              name: form.name || undefined,
              capacity: capacityNum,
              location: form.location || undefined,
            },
          },
        });
      }
      await refetch();
      closeModal();
    } catch (err: any) {
      setFormError(err?.message ?? 'Something went wrong');
    }
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget || !restaurantId) return;
    try {
      await deleteTable({
        variables: { restaurantId, tableId: deleteTarget.id },
      });
      await refetch();
      setDeleteTarget(null);
    } catch (err: any) {
      setFormError(err?.message ?? 'Failed to delete table');
      setDeleteTarget(null);
    }
  }

  // ---- Loading / error states for the restaurant itself ----
  if (restaurantLoading) {
    return (
      <div className="flex items-center gap-2 py-10 text-sm text-gray-400">
        <Loader2 size={16} className="animate-spin" />
        Loading restaurant…
      </div>
    );
  }

  if (restaurantError || !restaurantId) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        Failed to load restaurant: {restaurantError?.message ?? 'No restaurant found'}
      </div>
    );
  }

  return (
    <>
      <PageHeader title="Tables" subtitle="Tap a table to edit or remove it." />

      {/* Branch selector — only show if the restaurant has more than one branch */}
      {branches.length > 1 && (
        <div className="mb-4 flex items-center gap-2">
          <label className="text-xs font-medium text-gray-500">Branch</label>
          <select
            value={selectedBranchId}
            onChange={(e) => setSelectedBranchId(e.target.value)}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs outline-none focus:border-ink"
          >
            {branches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {branches.length === 0 && (
        <div className="mb-4 rounded-lg border border-dashed border-gray-200 p-4 text-sm text-gray-400">
          No branches found. Create a branch before adding tables.
        </div>
      )}

      <div className="mb-5 flex animate-fade-up flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-3">
          {(['AVAILABLE', 'OCCUPIED', 'RESERVED', 'CLEANING'] as const).map((status) => (
            <div
              key={status}
              className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs"
            >
              <span className={`h-2 w-2 rounded-full ${STATUS_DOT[status]}`} />
              <span className="text-gray-500">{STATUS_LABEL[status]}</span>
              <span className="font-medium text-ink">{counts[status] ?? 0}</span>
            </div>
          ))}
        </div>

        <button
          onClick={openCreateModal}
          disabled={!selectedBranchId}
          className="flex items-center gap-1.5 rounded-lg bg-ink px-3.5 py-2 text-xs font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          <Plus size={14} />
          Add Table
        </button>
      </div>

      {tablesLoading && (
        <div className="flex items-center gap-2 py-10 text-sm text-gray-400">
          <Loader2 size={16} className="animate-spin" />
          Loading tables…
        </div>
      )}

      {tablesError && !tablesLoading && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Failed to load tables: {tablesError.message}
        </div>
      )}

      {!tablesLoading && !tablesError && tables.length === 0 && selectedBranchId && (
        <div className="rounded-lg border border-dashed border-gray-200 p-10 text-center text-sm text-gray-400">
          No tables yet. Click "Add Table" to create one.
        </div>
      )}

      {!tablesLoading && !tablesError && tables.length > 0 && (
        <div className="grid animate-fade-up grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {tables.map((table: DiningTable) => (
            <div
              key={table.id}
              className={`group relative flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-transform hover:-translate-y-0.5 hover:shadow-sm ${STATUS_CARD[table.status]}`}
            >
              <div className="absolute right-2 top-2 hidden gap-1 group-hover:flex">
                <button
                  onClick={() => openEditModal(table)}
                  className="rounded-md bg-white/80 p-1 text-gray-500 hover:text-ink"
                  aria-label="Edit table"
                >
                  <Pencil size={12} />
                </button>
                <button
                  onClick={() => setDeleteTarget(table)}
                  className="rounded-md bg-white/80 p-1 text-gray-500 hover:text-red-600"
                  aria-label="Delete table"
                >
                  <Trash2 size={12} />
                </button>
              </div>

              <span className="font-display text-xl text-ink">T{table.tableNumber}</span>
              {table.name && <span className="text-[11px] text-gray-400">{table.name}</span>}
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <Users size={12} />
                {table.capacity}
              </span>
              <span className="flex items-center gap-1.5 text-xs font-medium text-ink">
                <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[table.status]}`} />
                {STATUS_LABEL[table.status]}
              </span>
              {table.location && <span className="text-[11px] text-gray-400">{table.location}</span>}
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg text-ink">
                {editingTable ? 'Edit Table' : 'Add Table'}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-ink">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500">Table Number</label>
                <input
                  value={form.tableNumber}
                  onChange={(e) => setForm((f) => ({ ...f, tableNumber: e.target.value }))}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-ink"
                  placeholder="e.g. 12"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500">Name (optional)</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-ink"
                  placeholder="e.g. Window booth"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-500">Capacity</label>
                  <input
                    type="number"
                    min={1}
                    value={form.capacity}
                    onChange={(e) => setForm((f) => ({ ...f, capacity: e.target.value }))}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-ink"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-500">Location (optional)</label>
                  <input
                    value={form.location}
                    onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-ink"
                    placeholder="e.g. Patio"
                  />
                </div>
              </div>

              {editingTable && (
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-500">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as Status }))}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-ink"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {STATUS_LABEL[s]}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {formError && <p className="text-xs text-red-600">{formError}</p>}

              <div className="mt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-lg border border-gray-200 px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating || updating}
                  className="flex items-center gap-1.5 rounded-lg bg-ink px-4 py-2 text-xs font-medium text-white hover:opacity-90 disabled:opacity-50"
                >
                  {(creating || updating) && <Loader2 size={12} className="animate-spin" />}
                  {editingTable ? 'Save Changes' : 'Create Table'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-lg">
            <h2 className="mb-2 font-display text-lg text-ink">Delete Table {deleteTarget.tableNumber}?</h2>
            <p className="mb-4 text-sm text-gray-500">
              This will remove the table from the floor plan. This action can't be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="rounded-lg border border-gray-200 px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-2 text-xs font-medium text-white hover:opacity-90 disabled:opacity-50"
              >
                {deleting && <Loader2 size={12} className="animate-spin" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}