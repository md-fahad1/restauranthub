'use client';

import { useMemo, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import {
  Search,
  Plus,
  Building2,
  Eye,
  Pencil,
  Trash2,
  MapPin,
  Phone,
  X,
} from 'lucide-react';

import { PageHeader } from '@/components/dashboard/PageHeader';
import {
  GET_MY_RESTAURANT_QUERY,
  CREATE_BRANCH_MUTATION,
  UPDATE_BRANCH_MUTATION,
  DELETE_BRANCH_MUTATION,
  type Branch,
  type MyRestaurantData,
  type BranchFormValues,
} from '@/lib/graphql/branches';

const EMPTY_FORM: BranchFormValues = { name: '', address: '', city: '', phone: '', email: '' };

export default function BranchesPage() {
  const [search, setSearch] = useState('');
  const [modalMode, setModalMode] = useState<'add' | 'edit' | null>(null);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [form, setForm] = useState<BranchFormValues>(EMPTY_FORM);
  const [deleteTarget, setDeleteTarget] = useState<Branch | null>(null);

  const { data, loading, error } = useQuery<MyRestaurantData>(GET_MY_RESTAURANT_QUERY, {
    fetchPolicy: 'cache-and-network',
  });

  const restaurant = data?.myRestaurant;
  const restaurantId = restaurant?.id;
  const branches = restaurant?.branches ?? [];

  const refetch = { refetchQueries: [{ query: GET_MY_RESTAURANT_QUERY }] };

  const [createBranch, { loading: creating }] = useMutation(CREATE_BRANCH_MUTATION, refetch);
  const [updateBranch, { loading: updating }] = useMutation(UPDATE_BRANCH_MUTATION, refetch);
  const [deleteBranch, { loading: deleting }] = useMutation(DELETE_BRANCH_MUTATION, refetch);

  const filtered = useMemo(() => {
    const keyword = search.toLowerCase();
    return branches.filter(
      (b) =>
        b.name.toLowerCase().includes(keyword) ||
        b.city.toLowerCase().includes(keyword) ||
        b.address.toLowerCase().includes(keyword),
    );
  }, [branches, search]);

  function openAdd() {
    setForm(EMPTY_FORM);
    setEditingBranch(null);
    setModalMode('add');
  }

  function openEdit(branch: Branch) {
    setForm({
      name: branch.name,
      address: branch.address,
      city: branch.city,
      phone: branch.phone ?? '',
      email: branch.email ?? '',
    });
    setEditingBranch(branch);
    setModalMode('edit');
  }

  function closeModal() {
    setModalMode(null);
    setEditingBranch(null);
    setForm(EMPTY_FORM);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!restaurantId) return;

    const input = {
      name: form.name.trim(),
      address: form.address.trim(),
      city: form.city.trim(),
      phone: form.phone.trim() || undefined,
      email: form.email.trim() || undefined,
    };

    if (modalMode === 'edit' && editingBranch) {
      await updateBranch({ variables: { id: editingBranch.id, input } });
    } else {
      await createBranch({ variables: { input: { ...input, restaurantId } } });
    }

    closeModal();
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    await deleteBranch({ variables: { id: deleteTarget.id } });
    setDeleteTarget(null);
  }

  if (loading && !data) {
    return <div className="p-10 text-center text-gray-400">Loading...</div>;
  }

  // The resolver throws when no restaurant exists for this owner yet —
  // that's a real, different state from "restaurant exists but has zero
  // branches", so it gets its own message rather than reusing the table's
  // empty state.
  if (error || !restaurant) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 p-16 text-center">
        <Building2 className="text-gray-300" size={32} />
        <p className="text-sm font-medium text-ink">No restaurant found for this account yet.</p>
        <p className="text-sm text-gray-400">Create your restaurant first, then branches can be added here.</p>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="Branches"
        subtitle={`${branches.length} restaurant branches.`}
        action={
          <button
            onClick={openAdd}
            className="flex items-center gap-2 rounded-lg bg-ink px-4 py-2 text-sm text-paper transition hover:bg-ink-soft"
          >
            <Plus size={16} />
            Add Branch
          </button>
        }
      />

      {/* Stats */}
      <div className="mb-6 grid gap-5 md:grid-cols-2">
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Branches</p>
              <h2 className="mt-2 text-3xl font-bold text-ink">{branches.length}</h2>
            </div>
            <div className="rounded-xl bg-blue-100 p-3">
              <Building2 className="text-blue-600" size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Cities covered</p>
              <h2 className="mt-2 text-3xl font-bold text-ink">
                {new Set(branches.map((b) => b.city)).size}
              </h2>
            </div>
            <div className="rounded-xl bg-emerald-100 p-3">
              <MapPin className="text-emerald-600" size={22} />
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-5 flex items-center gap-2 rounded-lg border bg-white px-3 py-2 sm:w-96">
        <Search size={16} className="text-gray-400" />
        <input
          placeholder="Search branch..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full outline-none"
        />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
              <th className="px-6 py-4">Branch</th>
              <th className="px-6 py-4">City</th>
              <th className="px-6 py-4">Contact</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {branches.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-16">
                  <div className="flex flex-col items-center gap-3 text-center">
                    <Building2 className="text-gray-300" size={28} />
                    <p className="text-sm text-gray-500">You haven't added any branches yet.</p>
                    <button
                      onClick={openAdd}
                      className="flex items-center gap-2 rounded-lg bg-ink px-4 py-2 text-sm text-paper transition hover:bg-ink-soft"
                    >
                      <Plus size={16} />
                      Add your first branch
                    </button>
                  </div>
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-gray-400">
                  No branches match your search.
                </td>
              </tr>
            ) : (
              filtered.map((branch) => (
                <tr key={branch.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-5">
                    <div className="font-semibold text-ink">{branch.name}</div>
                    <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
                      <MapPin size={13} />
                      {branch.address}
                    </div>
                  </td>

                  <td className="px-6 py-5 text-gray-600">{branch.city}</td>

                  <td className="px-6 py-5">
                    {branch.phone && (
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Phone size={13} />
                        {branch.phone}
                      </div>
                    )}
                    {branch.email && <div className="mt-1 text-xs text-gray-400">{branch.email}</div>}
                    {!branch.phone && !branch.email && <span className="text-xs text-gray-300">—</span>}
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex justify-end gap-2">
                      <button className="rounded-lg border p-2 hover:bg-gray-100">
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => openEdit(branch)}
                        className="rounded-lg border p-2 hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(branch)}
                        className="rounded-lg border p-2 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit modal */}
      {modalMode && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-md rounded-xl border border-gray-100 bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <p className="text-sm font-semibold text-ink">
                {modalMode === 'edit' ? 'Edit Branch' : 'Add Branch'}
              </p>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3 px-5 py-4">
              <label className="flex flex-col gap-1">
                <span className="text-xs text-gray-500">Branch name</span>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none"
                  placeholder="e.g. Dhanmondi"
                />
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-xs text-gray-500">Address</span>
                <input
                  required
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none"
                  placeholder="e.g. 6 Third Street"
                />
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-xs text-gray-500">City</span>
                <input
                  required
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none"
                  placeholder="e.g. Dhaka"
                />
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="flex flex-col gap-1">
                  <span className="text-xs text-gray-500">Phone (optional)</span>
                  <input
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none"
                    placeholder="+8801..."
                  />
                </label>

                <label className="flex flex-col gap-1">
                  <span className="text-xs text-gray-500">Email (optional)</span>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none"
                    placeholder="branch@example.com"
                  />
                </label>
              </div>

              <div className="mt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating || updating}
                  className="rounded-lg bg-ink px-4 py-2 text-sm text-paper hover:bg-ink-soft disabled:opacity-50"
                >
                  {modalMode === 'edit'
                    ? updating
                      ? 'Saving...'
                      : 'Save changes'
                    : creating
                    ? 'Adding...'
                    : 'Add branch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteTarget && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-sm rounded-xl border border-gray-100 bg-white p-5 shadow-xl">
            <p className="text-sm font-semibold text-ink">Delete {deleteTarget.name}?</p>
            <p className="mt-1 text-sm text-gray-500">
              This will permanently remove this branch. This can't be undone.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="rounded-lg bg-red-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Delete branch'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}