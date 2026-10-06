'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    api.get('/dashboard').then((r) => setData(r.data));
  }, []);

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3 text-slate-500">
          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span>Loading dashboard…</span>
        </div>
      </div>
    );
  }

  const cards = [
    {
      label: 'Total Products',
      value: data.total_products,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      accent: 'from-blue-500 to-blue-600',
      ring: 'ring-blue-500/10',
    },
    {
      label: 'Categories',
      value: data.total_categories,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5a2 2 0 012 2v5a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2zm10 10h.01M17 13h.01M17 17h.01M13 13h.01M13 17h.01M9 17h.01" />
        </svg>
      ),
      accent: 'from-purple-500 to-purple-600',
      ring: 'ring-purple-500/10',
    },
    {
      label: 'Stock Value',
      value: `$${Number(data.total_stock_value).toFixed(2)}`,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      accent: 'from-emerald-500 to-emerald-600',
      ring: 'ring-emerald-500/10',
    },
    {
      label: 'Low Stock',
      value: data.low_stock_count,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M5.07 19h13.86a2 2 0 001.74-2.99l-6.93-12a2 2 0 00-3.48 0l-6.93 12A2 2 0 005.07 19z" />
        </svg>
      ),
      accent: 'from-rose-500 to-rose-600',
      ring: 'ring-rose-500/10',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Dashboard
        </h1>
        <p className="text-slate-500 mt-1 text-sm">
          Overview of your inventory at a glance
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div
            key={c.label}
            className="group relative bg-white rounded-2xl border border-slate-200/70 p-5 shadow-sm transition hover:shadow-md hover:-translate-y-0.5"
          >
            <div className="flex items-start justify-between">
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.accent} text-white flex items-center justify-center shadow-sm ring-4 ${c.ring}`}
              >
                {c.icon}
              </div>
            </div>
            <p className="text-sm text-slate-500 mt-4">{c.label}</p>
            <p className="text-2xl font-bold text-slate-900 mt-1 tracking-tight">
              {c.value}
            </p>
          </div>
        ))}
      </div>

      {/* Detail panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low stock */}
        <div className="bg-white rounded-2xl border border-slate-200/70 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <h2 className="font-semibold text-slate-900">Low Stock Products</h2>
            </div>
            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
              {data.low_stock_products.length}
            </span>
          </div>
          <ul className="divide-y divide-slate-100">
            {data.low_stock_products.length === 0 && (
              <li className="px-5 py-6 text-sm text-slate-500 text-center">
                All products are well stocked. 🎉
              </li>
            )}
            {data.low_stock_products.map((p: any) => (
              <li
                key={p.id}
                className="flex justify-between items-center px-5 py-3 hover:bg-slate-50/60 transition"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">
                    {p.name}
                  </p>
                  <p className="text-xs text-slate-400 font-mono">{p.sku}</p>
                </div>
                <span className="text-sm font-semibold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full whitespace-nowrap">
                  {p.quantity} / {p.reorder_level}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Recent movements */}
        <div className="bg-white rounded-2xl border border-slate-200/70 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <h2 className="font-semibold text-slate-900">Recent Movements</h2>
            </div>
            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
              {data.recent_movements.length}
            </span>
          </div>
          <ul className="divide-y divide-slate-100">
            {data.recent_movements.length === 0 && (
              <li className="px-5 py-6 text-sm text-slate-500 text-center">
                No movements yet.
              </li>
            )}
            {data.recent_movements.map((m: any) => {
              const styles =
                m.type === 'in'
                  ? 'text-emerald-700 bg-emerald-50'
                  : m.type === 'out'
                  ? 'text-rose-700 bg-rose-50'
                  : 'text-amber-700 bg-amber-50';
              return (
                <li
                  key={m.id}
                  className="flex justify-between items-center px-5 py-3 hover:bg-slate-50/60 transition"
                >
                  <span className="text-sm text-slate-700 truncate">
                    {m.product?.name}
                  </span>
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${styles}`}
                  >
                    {m.type.toUpperCase()} · {m.quantity}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}