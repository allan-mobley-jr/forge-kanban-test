"use client";

import type { Column as ColumnType } from "@/lib/types";

interface ColumnProps {
  column: ColumnType;
  cardCount: number;
}

export function Column({ column, cardCount }: ColumnProps) {
  return (
    <section
      aria-label={column.title}
      className="flex min-w-[280px] flex-1 flex-col rounded-lg bg-slate-100 p-3"
    >
      <div className="mb-3 flex items-center justify-between px-1">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
          {column.title}
        </h2>
        <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-500">
          {cardCount}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 overflow-y-auto">
        {cardCount === 0 && (
          <p className="py-8 text-center text-sm text-slate-400">No tasks</p>
        )}
      </div>
    </section>
  );
}
