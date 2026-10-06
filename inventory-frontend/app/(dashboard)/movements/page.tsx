'use client';
import { useEffect, useState, FormEvent } from 'react';
import api from '@/lib/api';
import type { Product, StockMovement } from '@/lib/types';

export default function MovementsPage() {
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [filterType, setFilterType] = useState('');
  const [form, setForm] = useState({
    product_id: '',
    type: 'in',
    quantity: 1,
    reference: '',
    notes: '',
  });
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const load = () =>
    api
      .get('/stock-movements', { params: { type: filterType || undefined } })
      .then((r) => setMovements(r.data.data));

  useEffect(() => {
    load();
  }, [filterType]);

  useEffect(() => {
    api
      .get('/products', { params: { per_page: 100 } })
      .then((r) => setProducts(r.data.data));
  }, []);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setMsg('');
    setError('');
    try {
      await api.post('/stock-movements', {
        ...form,
        product_id: Number(form.product_id),
        quantity: Number(form.quantity),
      });
      setMsg('Movement recorded.');
      setForm({ product_id: '', type: 'in', quantity: 1, reference: '', notes: '' });
      load();
      api
        .get('/products', { params: { per_page: 100 } })
        .then((r) => setProducts(r.data.data));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to record movement');
    }
  };

  const inputClass =
    'w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 bg-white transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 outline-none';
  const labelClass = 'block text-xs font-medium text-slate-600 mb-1.5';

  const typeStyles: Record<string, string> = {
    in: 'text-emerald-700 bg-emerald-50 ring-emerald-600/10',
    out: 'text-rose-700 bg-rose-50 ring-rose-600/10',
    adjustment: 'text-amber-700 bg-amber-50 ring-amber-600/10',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Stock Movements
        </h1>
        <p className="text-slate-500 mt-1 text-sm">
          Record and review inventory changes
        </p>
      </div>

      {/* Form card */}
      <form
        onSubmit={submit}
        className="bg-white rounded-2xl border border-slate-200/70 shadow-sm p-5 space-y-4"
      >
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500" />
          <h2 className="font-semibold text-slate-900">Record Movement</h2>
        </div>

        {msg && (
          <div className="flex items-start gap-2 text-emerald-700 text-sm bg-emerald-50 border border-emerald-200 rounded-lg p-3">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{msg}</span>
          </div>
        )}
        {error && (
          <div className="flex items-start gap-2 text-rose-700 text-sm bg-rose-50 border border-rose-200 rounded-lg p-3">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="md:col-span-1">
            <label className={labelClass}>Product</label>
            <select
              required
              value={form.product_id}
              onChange={(e) => setForm({ ...form, product_id: e.target.value })}
              className={inputClass}
            >
              <option value="">Select Product</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.sku}) — {p.quantity}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Type</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className={inputClass}
            >
              <option value="in">Stock In</option>
              <option value="out">Stock Out</option>
              <option value="adjustment">Adjustment (set qty)</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Quantity</label>
            <input
              type="number"
              min={1}
              value={form.quantity}
              onChange={(e) =>
                setForm({ ...form, quantity: Number(e.target.value) })
              }
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Reference</label>
            <input
              placeholder="Optional"
              value={form.reference}
              onChange={(e) => setForm({ ...form, reference: e.target.value })}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Notes</label>
          <textarea
            placeholder="Optional notes…"
            value={form.notes}
            rows={2}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            className={`${inputClass} resize-none`}
          />
        </div>

        <div className="flex justify-end pt-1">
          <button className="inline-flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium shadow-sm hover:bg-slate-800 active:scale-[0.98] transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Save Movement
          </button>
        </div>
      </form>

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-700">Filter</span>
          <div className="inline-flex rounded-lg border border-slate-300 bg-white p-0.5">
            {[
              { value: '', label: 'All' },
              { value: 'in', label: 'In' },
              { value: 'out', label: 'Out' },
              { value: 'adjustment', label: 'Adjustment' },
            ].map((opt) => {
              const active = filterType === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setFilterType(opt.value)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${
                    active
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
        <p className="text-xs text-slate-500">
          {movements.length} movement{movements.length === 1 ? '' : 's'}
        </p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200/70 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/70">
                {['Date', 'Product', 'Type', 'Qty', 'Reference', 'User'].map((h) => (
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
              {movements.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                      </svg>
                      <span className="text-sm">No movements yet.</span>
                    </div>
                  </td>
                </tr>
              )}
              {movements.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50/60 transition">
                  <td className="px-4 py-3 text-slate-600 whitespace-nowrap tabular-nums">
                    {new Date(m.created_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-medium text-slate-900">
                      {m.product?.name}
                    </span>{' '}
                    <span className="text-slate-400 font-mono text-xs">
                      ({m.product?.sku})
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ring-1 ${
                        typeStyles[m.type] ?? 'text-slate-700 bg-slate-100 ring-slate-600/10'
                      }`}
                    >
                      {m.type === 'in' && (
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19V5m0 0l-7 7m7-7l7 7" />
                        </svg>
                      )}
                      {m.type === 'out' && (
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 5v14m0 0l7-7m-7 7l-7-7" />
                        </svg>
                      )}
                      {m.type === 'adjustment' && (
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 8h16M4 16h16" />
                        </svg>
                      )}
                      {m.type.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-900 tabular-nums">
                    {m.quantity}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {m.reference || <span className="text-slate-300">—</span>}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {m.user?.name || <span className="text-slate-300">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}