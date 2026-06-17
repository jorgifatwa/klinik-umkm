"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface DataTableColumn<T> {
  key: string;
  header: string;
  render: (item: T) => React.ReactNode;
  className?: string;
  searchable?: boolean;
  sortable?: boolean;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  searchPlaceholder?: string;
  searchField?: string;
  emptyMessage?: string;
  emptyIcon?: string;
  loading?: boolean;
  pageSize?: number;
  actions?: (item: T) => React.ReactNode;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  searchPlaceholder = "Cari...",
  emptyMessage = "Tidak ada data.",
  emptyIcon = "📋",
  loading = false,
  pageSize = 8,
  actions,
}: DataTableProps<T>) {
  const [search, setSearch] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);

  const filtered = React.useMemo(() => {
    if (!search.trim()) return data;
    const q = search.toLowerCase();
    return data.filter((item) =>
      columns.some((col) => {
        const val = (item as Record<string, unknown>)[col.key];
        return val != null && String(val).toLowerCase().includes(q);
      })
    );
  }, [data, search, columns]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);
  const startItem = filtered.length === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endItem = Math.min(safePage * pageSize, filtered.length);

  // Reset page when search changes

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 rounded-xl border border-slate-100 bg-white p-4">
            <div className="h-4 w-32 animate-pulse rounded bg-slate-100" />
            <div className="h-4 flex-1 animate-pulse rounded bg-slate-100" />
            <div className="h-4 w-20 animate-pulse rounded bg-slate-100" />
            <div className="h-4 w-24 animate-pulse rounded bg-slate-100" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 0z" />
          </svg>
          <Input
            type="text"
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10"
          />
        </div>
        {search && (
          <Button variant="ghost" size="sm" onClick={() => setSearch("")} className="text-slate-500 hover:text-slate-700">
            Reset
          </Button>
        )}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              {columns.map((col) => (
                <th key={col.key} className={cn("px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500", col.className)}>
                  {col.header}
                </th>
              ))}
              {actions && <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Aksi</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="px-4 py-16 text-center">
                  <span className="text-3xl">{emptyIcon}</span>
                  <p className="mt-2 text-sm font-medium text-slate-500">{emptyMessage}</p>
                  {search && <p className="mt-1 text-xs text-slate-400">Coba kata kunci yang berbeda.</p>}
                </td>
              </tr>
            ) : (
              paginated.map((item) => (
                <tr key={keyExtractor(item)} className="group transition-colors hover:bg-slate-50/50">
                  {columns.map((col) => (
                    <td key={col.key} className={cn("px-4 py-3.5 text-sm text-slate-700", col.className)}>
                      {col.render(item)}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-4 py-3.5 text-right">
                      {actions(item)}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="space-y-2 md:hidden">
        {paginated.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
            <span className="text-3xl">{emptyIcon}</span>
            <p className="mt-2 text-sm font-medium text-slate-500">{emptyMessage}</p>
            {search && <p className="mt-1 text-xs text-slate-400">Coba kata kunci yang berbeda.</p>}
          </div>
        ) : (
          paginated.map((item) => (
            <div key={keyExtractor(item)} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="space-y-2">
                {columns.map((col) => (
                  <div key={col.key} className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500">{col.header}</span>
                    <span className="text-sm text-slate-700">{col.render(item)}</span>
                  </div>
                ))}
              </div>
              {actions && (
                <div className="mt-3 flex justify-end gap-2 border-t border-slate-100 pt-3">
                  {actions(item)}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {filtered.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
          <p className="text-xs">
            Menampilkan <span className="font-medium text-slate-700">{startItem}–{endItem}</span> dari <span className="font-medium text-slate-700">{filtered.length}</span> data
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="h-8 px-3 text-xs"
            >
              Sebelumnya
            </Button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let page: number;
              if (totalPages <= 5) {
                page = i + 1;
              } else if (safePage <= 3) {
                page = i + 1;
              } else if (safePage >= totalPages - 2) {
                page = totalPages - 4 + i;
              } else {
                page = safePage - 2 + i;
              }
              return (
                <Button
                  key={page}
                  variant={page === safePage ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className="h-8 w-8 p-0 text-xs"
                >
                  {page}
                </Button>
              );
            })}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className="h-8 px-3 text-xs"
            >
              Selanjutnya
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}