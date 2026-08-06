'use client';

import { useMemo, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { Plus, Pencil, Trash2, X, Copy, Check } from 'lucide-react';

import { PageHeader } from '@/components/dashboard/PageHeader';
import { StatusBadge } from '@/components/dashboard/StatusBadge';
import { GET_MY_RESTAURANT_QUERY, type MyRestaurantData } from '@/lib/graphql/branches';
import {
  GET_EMPLOYEES_QUERY,
  CREATE_EMPLOYEE_MUTATION,
  UPDATE_EMPLOYEE_MUTATION,
  REMOVE_EMPLOYEE_MUTATION,
  type Employee,
  type EmployeesData,
  type CreateEmployeeData,
  type EmployeeFormValues,
  type EmployeeEditValues,
  type EmployeeStatus,
} from '@/lib/graphql/employees';

const EMPTY_ADD_FORM: EmployeeFormValues = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  branchId: '',
  designation: '',
  salary: '',
  hiredAt: '',
};

const STATUS_LABEL: Record<EmployeeStatus, string> = {
  ACTIVE: 'Active',
  ON_LEAVE: 'On Leave',
  RESIGNED: 'Resigned',
  TERMINATED: 'Terminated',
};

const STATUS_OPTIONS: EmployeeStatus[] = ['ACTIVE', 'ON_LEAVE', 'RESIGNED', 'TERMINATED'];

export default function EmployeesPage() {
  const [modalMode, setModalMode] = useState<'add' | 'edit' | null>(null);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [addForm, setAddForm] = useState<EmployeeFormValues>(EMPTY_ADD_FORM);
  const [editForm, setEditForm] = useState<EmployeeEditValues | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Employee | null>(null);
  const [newCredentials, setNewCredentials] = useState<{ email: string; password: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const { data: restaurantData } = useQuery<MyRestaurantData>(GET_MY_RESTAURANT_QUERY);
  const restaurantId = restaurantData?.myRestaurant?.id;
  const branches = restaurantData?.myRestaurant?.branches ?? [];

    const { data, loading, error } = useQuery<EmployeesData>(GET_EMPLOYEES_QUERY, {
    variables: { restaurantId },
    skip: !restaurantId,
    fetchPolicy: 'cache-and-network',
  });

  const employees: Employee[] = data?.employees ?? [];
  const refetch = { refetchQueries: [{ query: GET_EMPLOYEES_QUERY, variables: { restaurantId } }] };

  const [createEmployee, { loading: creating }] = useMutation<CreateEmployeeData>(
    CREATE_EMPLOYEE_MUTATION,
    refetch,
  );
  const [updateEmployee, { loading: updating }] = useMutation(UPDATE_EMPLOYEE_MUTATION, refetch);
  const [removeEmployee, { loading: removing }] = useMutation(REMOVE_EMPLOYEE_MUTATION, refetch);

  const defaultBranchId = useMemo(() => branches[0]?.id ?? '', [branches]);

  function openAdd() {
    setAddForm({ ...EMPTY_ADD_FORM, branchId: defaultBranchId });
    setModalMode('add');
  }

  function openEdit(emp: Employee) {
    setEditingEmployee(emp);
    setEditForm({
      branchId: emp.branch.id,
      designation: emp.designation,
      salary: String(emp.salary),
      hiredAt: emp.hiredAt.slice(0, 10),
      status: emp.status,
    });
    setModalMode('edit');
  }

  function closeModal() {
    setModalMode(null);
    setEditingEmployee(null);
    setEditForm(null);
  }

  async function handleAddSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!restaurantId) return;

    const result = await createEmployee({
      variables: {
        input: {
          restaurantId,
          branchId: addForm.branchId,
          firstName: addForm.firstName.trim(),
          lastName: addForm.lastName.trim(),
          email: addForm.email.trim(),
          phone: addForm.phone.trim() || undefined,
          designation: addForm.designation.trim(),
          salary: parseFloat(addForm.salary) || 0,
          hiredAt: addForm.hiredAt,
        },
      },
    });

    const created = result.data?.createEmployee;
    closeModal();

    if (created) {
      setNewCredentials({ email: created.employee.user.email, password: created.temporaryPassword });
    }
  }

  async function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!restaurantId || !editingEmployee || !editForm) return;

    await updateEmployee({
      variables: {
        input: {
          restaurantId,
          employeeId: editingEmployee.id,
          branchId: editForm.branchId,
          designation: editForm.designation.trim(),
          salary: parseFloat(editForm.salary) || 0,
          hiredAt: editForm.hiredAt,
          status: editForm.status,
        },
      },
    });

    closeModal();
  }

  async function confirmDelete() {
    if (!restaurantId || !deleteTarget) return;
    await removeEmployee({ variables: { restaurantId, employeeId: deleteTarget.id } });
    setDeleteTarget(null);
  }

  function copyPassword() {
    if (!newCredentials) return;
    navigator.clipboard.writeText(newCredentials.password);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  if (!restaurantId) {
    return <div className="p-10 text-center text-gray-400">Loading...</div>;
  }

  if (error) {
    return (
      <div className="p-5">
        <pre className="rounded-lg bg-red-50 p-4 text-sm text-red-600">{error.message}</pre>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="Employees"
        subtitle={`${employees.length} staff members.`}
        action={
          <button
            onClick={openAdd}
            className="flex items-center gap-1.5 rounded-lg bg-ink px-3.5 py-2 text-sm text-paper hover:bg-ink-soft"
          >
            <Plus size={15} />
            Add employee
          </button>
        }
      />

      <div className="animate-fade-up overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/60 text-xs uppercase tracking-wide text-gray-400">
              <th className="px-5 py-3 font-medium">Name</th>
              <th className="px-5 py-3 font-medium">Role</th>
              <th className="px-5 py-3 font-medium">Branch</th>
              <th className="px-5 py-3 font-medium">Hired</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && !data ? (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-gray-400">
                  Loading employees...
                </td>
              </tr>
            ) : employees.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-gray-400">
                  No employees yet.
                </td>
              </tr>
            ) : (
              employees.map((emp) => (
                <tr key={emp.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ink/5 font-mono text-xs text-ink">
                        {emp.user.firstName[0]}
                        {emp.user.lastName[0]}
                      </div>
                      <div>
                        <p className="text-ink">
                          {emp.user.firstName} {emp.user.lastName}
                        </p>
                        <p className="text-xs text-gray-400">{emp.user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-gray-500">{emp.designation}</td>
                  <td className="px-5 py-3 text-gray-500">{emp.branch.name}</td>
                  <td className="px-5 py-3 text-gray-400">
                    {new Date(emp.hiredAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-5 py-3">
                    <StatusBadge status={STATUS_LABEL[emp.status] as any} />
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openEdit(emp)}
                        className="rounded-lg border p-1.5 hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(emp)}
                        className="rounded-lg border p-1.5 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add employee modal */}
      {modalMode === 'add' && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-md rounded-xl border border-gray-100 bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <p className="text-sm font-semibold text-ink">Add employee</p>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="flex max-h-[70vh] flex-col gap-3 overflow-y-auto px-5 py-4">
              <div className="grid grid-cols-2 gap-3">
                <label className="flex flex-col gap-1">
                  <span className="text-xs text-gray-500">First name</span>
                  <input
                    required
                    value={addForm.firstName}
                    onChange={(e) => setAddForm({ ...addForm, firstName: e.target.value })}
                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none"
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-xs text-gray-500">Last name</span>
                  <input
                    required
                    value={addForm.lastName}
                    onChange={(e) => setAddForm({ ...addForm, lastName: e.target.value })}
                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none"
                  />
                </label>
              </div>

              <label className="flex flex-col gap-1">
                <span className="text-xs text-gray-500">Email</span>
                <input
                  required
                  type="email"
                  value={addForm.email}
                  onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none"
                />
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-xs text-gray-500">Phone (optional)</span>
                <input
                  value={addForm.phone}
                  onChange={(e) => setAddForm({ ...addForm, phone: e.target.value })}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none"
                />
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-xs text-gray-500">Branch</span>
                <select
                  required
                  value={addForm.branchId}
                  onChange={(e) => setAddForm({ ...addForm, branchId: e.target.value })}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none"
                >
                  <option value="" disabled>
                    Select a branch
                  </option>
                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-xs text-gray-500">Role / designation</span>
                <input
                  required
                  placeholder="e.g. Waiter"
                  value={addForm.designation}
                  onChange={(e) => setAddForm({ ...addForm, designation: e.target.value })}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none"
                />
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="flex flex-col gap-1">
                  <span className="text-xs text-gray-500">Salary</span>
                  <input
                    required
                    type="number"
                    min={0}
                    step="0.01"
                    value={addForm.salary}
                    onChange={(e) => setAddForm({ ...addForm, salary: e.target.value })}
                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none"
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-xs text-gray-500">Hired date</span>
                  <input
                    required
                    type="date"
                    value={addForm.hiredAt}
                    onChange={(e) => setAddForm({ ...addForm, hiredAt: e.target.value })}
                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none"
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
                  disabled={creating}
                  className="rounded-lg bg-ink px-4 py-2 text-sm text-paper hover:bg-ink-soft disabled:opacity-50"
                >
                  {creating ? 'Adding...' : 'Add employee'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit employee modal */}
      {modalMode === 'edit' && editForm && editingEmployee && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-md rounded-xl border border-gray-100 bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <div>
                <p className="text-sm font-semibold text-ink">Edit employee</p>
                <p className="text-xs text-gray-400">
                  {editingEmployee.user.firstName} {editingEmployee.user.lastName}
                </p>
              </div>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="flex flex-col gap-3 px-5 py-4">
              <label className="flex flex-col gap-1">
                <span className="text-xs text-gray-500">Branch</span>
                <select
                  value={editForm.branchId}
                  onChange={(e) => setEditForm({ ...editForm, branchId: e.target.value })}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none"
                >
                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-xs text-gray-500">Role / designation</span>
                <input
                  value={editForm.designation}
                  onChange={(e) => setEditForm({ ...editForm, designation: e.target.value })}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none"
                />
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="flex flex-col gap-1">
                  <span className="text-xs text-gray-500">Salary</span>
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={editForm.salary}
                    onChange={(e) => setEditForm({ ...editForm, salary: e.target.value })}
                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none"
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-xs text-gray-500">Hired date</span>
                  <input
                    type="date"
                    value={editForm.hiredAt}
                    onChange={(e) => setEditForm({ ...editForm, hiredAt: e.target.value })}
                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none"
                  />
                </label>
              </div>

              <label className="flex flex-col gap-1">
                <span className="text-xs text-gray-500">Status</span>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value as EmployeeStatus })}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {STATUS_LABEL[s]}
                    </option>
                  ))}
                </select>
              </label>

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
                  disabled={updating}
                  className="rounded-lg bg-ink px-4 py-2 text-sm text-paper hover:bg-ink-soft disabled:opacity-50"
                >
                  {updating ? 'Saving...' : 'Save changes'}
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
            <p className="text-sm font-semibold text-ink">
              Remove {deleteTarget.user.firstName} {deleteTarget.user.lastName}?
            </p>
            <p className="mt-1 text-sm text-gray-500">
              This marks them as resigned and removes them from the active staff list. This can't be undone.
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
                disabled={removing}
                className="rounded-lg bg-red-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50"
              >
                {removing ? 'Removing...' : 'Remove'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New credentials — the only time the temp password is ever shown */}
      {newCredentials && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-sm rounded-xl border border-gray-100 bg-white p-5 shadow-xl">
            <p className="text-sm font-semibold text-ink">Employee added</p>
            <p className="mt-1 text-sm text-gray-500">
              Share these login details with them now — this password won't be shown again.
            </p>

            <div className="mt-4 flex flex-col gap-2 rounded-lg bg-gray-50 p-3">
              <div>
                <p className="text-xs text-gray-400">Email</p>
                <p className="text-sm text-ink">{newCredentials.email}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Temporary password</p>
                <div className="flex items-center justify-between">
                  <p className="font-mono text-sm text-ink">{newCredentials.password}</p>
                  <button onClick={copyPassword} className="text-gray-400 hover:text-gray-600">
                    {copied ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={() => setNewCredentials(null)}
              className="mt-4 w-full rounded-lg bg-ink py-2 text-sm text-paper hover:bg-ink-soft"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </>
  );
}