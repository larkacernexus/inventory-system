'use client';
import { useEffect, useState, FormEvent } from 'react';
import api from '@/lib/api';
import type { Category } from '@/lib/types';

export default function CategoriesPage() {
  const [items, setItems] = useState<Category[]>([]);
  const [form, setForm] = useState({ name: '', description: '' });
  const [editing, setEditing] = useState<Category | null>(null);

  const load = () => api.get('/categories').then((r) => setItems(r.data));
  useEffect(() => {
    load();
  }, []);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (editing) await api.put(`/categories/${editing.id}`, form);
    else await api.post('/categories', form);
    setForm({ name: '', description: '' });
    setEditing(null);
    load();
  };

  const del = async (id: number) => {
    if (!confirm('Delete this category?')) return;
    await api.delete(`/categories/${id}`);
    load();
  };

  const inputClass =
    'w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 bg-white transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 outline-none';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Categories
        </h1>
        <p className="text-slate-500 mt-1 text-sm">
          Organize your products into groups
        </p>
      </div>

      {/* Inline form */}
      <form
        onSubmit={submit}
        className="bg-white rounded-2xl border border-slate-200/70 shadow-sm p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <span
            className={`w-2 h-2 rounded-full ${
              editing ? 'bg-amber-500' : 'bg-emerald-500'
            }`}
          />
          <h2 className="font-semibold text-slate-900">
            {editing ? `Editing "${editing.name}"` : 'Add a new category'}
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label className="block text-xs font-medium text-slate-600 mb-1.5">
              Name
            </label>
            <input
              placeholder="e.g. Electronics"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={inputClass}
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-medium text-slate-600 mb-1.5">
              Description
            </label>
            <input
              placeholder="Optional description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className={inputClass}
            />
          </div>
          <div className="flex items-end gap-2">
            <button className="h-[42px] inline-flex items-center justify-center gap-2 bg-slate-900 text-white px-5 rounded-lg text-sm font-medium shadow-sm hover:bg-slate-800 active:scale-[0.98] transition whitespace-nowrap">
              {editing ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Update
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                  </svg>
                  Add
                </>
              )}
            </button>
            {editing && (
              <button
                type="button"
                onClick={() => {
                  setEditing(null);
                  setForm({ name: '', description: '' });
                }}
                className="h-[42px] px-4 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50 transition"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Grid */}
      {items.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/70 shadow-sm p-12 text-center">
          <div className="flex flex-col items-center gap-2 text-slate-400">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5a2 2 0 012 2v5a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2zM15 15h.01M15 19h.01M11 15h.01M11 19h.01" />
            </svg>
            <p className="text-sm">No categories yet. Add your first one above.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((c) => (
            <div
              key={c.id}
              className="group relative bg-white rounded-2xl border border-slate-200/70 shadow-sm p-5 transition hover:shadow-md hover:-translate-y-0.5 flex flex-col"
            >
              {/* Header row */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white flex items-center justify-center shadow-sm ring-4 ring-purple-500/10 shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5a2 2 0 012 2v5a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2zm10 10h.01M17 13h.01M17 17h.01M13 13h.01M13 17h.01M9 17h.01" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-slate-900 truncate">
                      {c.name}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {c.products_count ?? 0} product
                      {(c.products_count ?? 0) === 1 ? '' : 's'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-slate-600 mt-4 line-clamp-2 min-h-[2.5rem]">
                {c.description || (
                  <span className="text-slate-400 italic">No description</span>
                )}
              </p>

              {/* Actions */}
              <div className="flex gap-1 mt-4 pt-4 border-t border-slate-100">
                <button
                  onClick={() => {
                    setEditing(c);
                    setForm({ name: c.name, description: c.description ?? '' });
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 px-2.5 py-1.5 rounded-md transition"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </button>
                <button
                  onClick={() => del(c.id)}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 px-2.5 py-1.5 rounded-md transition"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M9 7V4a2 2 0 012-2h2a2 2 0 012 2v3" />
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}