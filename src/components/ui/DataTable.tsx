'use client';

import React from 'react';

interface Column<T> {
  key: keyof T;
  label: string;
  align?: 'left' | 'right' | 'center';
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
}

const alignClass: Record<string, string> = {
  left: 'text-left',
  right: 'text-right',
  center: 'text-center',
};

export default function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  onRowClick,
}: DataTableProps<T>) {
  const interactive = !!onRowClick;

  return (
    <div className="overflow-x-auto -mx-4">
      <table className="w-full text-sm border-collapse min-w-full">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className={`px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-[var(--t3)] ${
                  alignClass[col.align ?? 'left']
                }`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr
              key={idx}
              onClick={interactive ? () => onRowClick(row) : undefined}
              tabIndex={interactive ? 0 : undefined}
              onKeyDown={
                interactive
                  ? (e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onRowClick(row);
                      }
                    }
                  : undefined
              }
              className={`border-b border-[var(--sep)] last:border-b-0 transition-colors ${
                interactive
                  ? 'cursor-pointer hover:bg-[var(--accS)] active:bg-[var(--accS)] min-h-[44px] focus-visible:outline-2 focus-visible:outline-[var(--acc)] focus-visible:outline-offset-[-2px]'
                  : ''
              }`}
            >
              {columns.map((col) => {
                const value = row[col.key];
                const isRight = col.align === 'right';
                return (
                  <td
                    key={String(col.key)}
                    className={`px-4 py-2.5 text-[var(--t1)] ${
                      alignClass[col.align ?? 'left']
                    } ${isRight ? 'font-[tabular-nums] font-semibold' : ''}`}
                  >
                    {col.render
                      ? col.render(value, row)
                      : (String(value ?? ''))}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
