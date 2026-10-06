'use client';
import { useEffect, useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuth } from '@/lib/AuthContext';
import type { User, Role } from '@/lib/types';

export default function UsersPage() {
  const router = useRouter();
  const { user } = useAuth();

  // Only admin + manager can be here
  const canManage = user?.role === 'admin' || user?.role === 'manager';

  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);

  // Client-side guard: bounce non-admin/manager
  useEffect(() => {
    if (user && !canManage) router.replace('/dashboard');
  }, [user, canManage, router]);

  const load = () => {
    if (!canManage) return;
    api.get('/users', { params: { search } }).then((r) => setUsers(r.data.data));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, canManage]);

  // Don't render anything until we know the user's role
  if (!user || !canManage) return null;

  const save = async (form: any) => {
    if (editing) await api.put(`/users/${editing.id}`, form);
    else await api.post('/users', form);
    setShowForm(false);
    setEditing(null);
    load();
  };

  const del = async (id: number) => {
    if (!confirm('Delete this user?')) return;
    try {
      await api.delete(`/users/${id}`);
      load();
    } catch (e: any) {
      alert(e.response?.data?.message || 'Delete failed');
    }
  };

  const roleStyles: Record<string, { badge: string; dot: string }> = {
    admin: {
      badge: 'text-purple-700 bg-purple-50 ring-purple-600/10',
      dot: 'bg-purple-500',
    },
    manager: {
      badge: 'text-blue-700 bg-blue-50 ring-blue-600/10',
      dot: 'bg-blue-500',
    },
    staff: {
      badge: 'text-slate-700 bg-slate-100 ring-slate-600/10',
      dot: 'bg-slate-400',
    },
  };

  const initials = (name?: string) =>
    (name ?? '')
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n[0]?.toUpperCase())
      .join('');

  const avatarColors = [
    'from-blue-500 to-blue-600',
    'from-purple-500 to-purple-600',
    'from-emerald-500 to-emerald-600',
    'from-amber-500 to-amber-600',
    'from-rose-500 to-rose-600',
    'from-cyan-500 to-cyan-600',
  ];
  const colorFor = (id: number) => avatarColors[id % avatarColors.length];

  // ─── Per-row permission check ───────────────────────────────
  // Admin: can edit/delete anyone (except self-delete, gated below)
  // Manager: can only edit/delete staff
  // Staff: never here
  const canEditRow = (row: User) => {
    if (user.role === 'admin') return true;
    if (user.role === 'manager') return row.role === 'staff';
    return false;
  };

  const canDeleteRow = (row: User) => {
    if (user.id === row.id) return false; // never delete self
    return canEditRow(row);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Users
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            Manage team members and permissions
          </p>
        </div>
        <button
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
          className="inline-flex items-center justify-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-lg font-medium shadow-sm hover:bg-slate-800 active:scale-[0.98] transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          Add User
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <svg
          className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
        </svg>
        <input
          placeholder="Search by name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-slate-300 rounded-lg pl-9 pr-3 py-2.5 bg-white text-sm text-slate-900 placeholder-slate-400 transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 outline-none"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200/70 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/70">
                {['User', 'Email', 'Role', 'Status', 'Actions'].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider text-slate-500"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-1.13a4 4 0 10-4-4 4 4 0 004 4zm6 0a3 3 0 100-6 3 3 0 000 6z" />
                      </svg>
                      <span className="text-sm">No users found.</span>
                    </div>
                  </td>
                </tr>
              )}
              {users.map((u) => {
                const role = roleStyles[u.role] ?? roleStyles.staff;
                const editable = canEditRow(u);
                const deletable = canDeleteRow(u);
                const isSelf = u.id === user.id;

                return (
                  <tr key={u.id} className="hover:bg-slate-50/60 transition">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-full bg-gradient-to-br ${colorFor(u.id)} text-white flex items-center justify-center text-xs font-semibold shrink-0 shadow-sm`}
                        >
                          {initials(u.name) || '?'}
                        </div>
                        <span className="font-medium text-slate-900">
                          {u.name}
                          {isSelf && (
                            <span className="ml-2 text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                              You
                            </span>
                          )}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{u.email}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ring-1 capitalize ${role.badge}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${role.dot}`} />
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {u.is_active ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {editable || deletable ? (
                        <div className="flex items-center gap-1">
                          {editable && (
                            <button
                              onClick={() => {
                                setEditing(u);
                                setShowForm(true);
                              }}
                              className="p-1.5 rounded-md text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition"
                              title="Edit"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                          )}
                          {deletable && (
                            <button
                              onClick={() => del(u.id)}
                              className="p-1.5 rounded-md text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition"
                              title="Delete"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M9 7V4a2 2 0 012-2h2a2 2 0 012 2v3" />
                              </svg>
                            </button>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <UserForm
          initial={editing}
          currentUser={user}
          onCancel={() => {
            setShowForm(false);
            setEditing(null);
          }}
          onSave={save}
        />
      )}
    </div>
  );
}

function UserForm({
  initial,
  currentUser,
  onCancel,
  onSave,
}: {
  initial: User | null;
  currentUser: User;
  onCancel: () => void;
  onSave: (payload: any) => void;
}) {
  const isSelf = !!initial && initial.id === currentUser.id;
  const canAssignAdmin = currentUser.role === 'admin';

  // Coerced to a strict boolean — was `boolean | null`
  const lockedRole =
    currentUser.role === 'manager' &&
    !!initial &&
    initial.role !== 'staff';

  const [form, setForm] = useState({
    name: initial?.name ?? '',
    email: initial?.email ?? '',
    password: '',
    password_confirmation: '',
    role: (initial?.role ?? 'staff') as Role,
    is_active: initial?.is_active ?? true,
  });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const payload: any = { ...form };
    if (initial && !form.password) {
      delete payload.password;
      delete payload.password_confirmation;
    }
    onSave(payload);
  };

  const inputClass =
    'w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 bg-white transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 outline-none disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed';
  const labelClass = 'block text-xs font-medium text-slate-600 mb-1.5';

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <form
        onSubmit={submit}
        className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {initial ? 'Edit User' : 'Add User'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {initial
                ? 'Update user details and permissions'
                : 'Create a new team member account'}
            </p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Name</label>
              <input
                placeholder="Full name"
                value={form.name}
                required
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input
                type="email"
                placeholder="user@example.com"
                value={form.email}
                required
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>
                {initial ? 'New Password' : 'Password'}
              </label>
              <input
                type="password"
                placeholder={initial ? 'Leave blank to keep current' : '••••••••'}
                value={form.password}
                required={!initial}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className={inputClass}
              />
              {initial && (
                <p className="text-[11px] text-slate-400 mt-1">
                  Leave blank to keep the existing password.
                </p>
              )}
            </div>
            <div>
              <label className={labelClass}>Confirm Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={form.password_confirmation}
                required={!initial && !!form.password}
                onChange={(e) =>
                  setForm({ ...form, password_confirmation: e.target.value })
                }
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Role</label>
              <select
                value={form.role}
                disabled={isSelf || lockedRole}
                onChange={(e) => setForm({ ...form, role: e.target.value as Role })}
                className={inputClass}
              >
                {canAssignAdmin && <option value="admin">Admin</option>}
                <option value="manager">Manager</option>
                <option value="staff">Staff</option>
              </select>
              {isSelf && (
                <p className="text-[11px] text-slate-400 mt-1">
                  You can't change your own role.
                </p>
              )}
              {lockedRole && !isSelf && (
                <p className="text-[11px] text-slate-400 mt-1">
                  Managers can only manage staff accounts.
                </p>
              )}
            </div>

            <div>
              <label className={labelClass}>Status</label>
              <button
                type="button"
                onClick={() => setForm({ ...form, is_active: !form.is_active })}
                className={`flex items-center gap-3 w-full border rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  form.is_active
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                    : 'border-slate-300 bg-slate-50 text-slate-600'
                }`}
              >
                <span
                  className={`relative inline-flex h-5 w-9 shrink-0 rounded-full transition ${
                    form.is_active ? 'bg-emerald-500' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                      form.is_active ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </span>
                {form.is_active ? 'Active' : 'Inactive'}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-6 py-4 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium hover:bg-white transition"
          >
            Cancel
          </button>
          <button className="px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium shadow-sm hover:bg-slate-800 active:scale-[0.98] transition">
            {initial ? 'Save Changes' : 'Create User'}
          </button>
        </div>
      </form>
    </div>
  );
}