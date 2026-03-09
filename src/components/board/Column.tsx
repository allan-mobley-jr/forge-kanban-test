"use client";

import { useRef, forwardRef, useImperativeHandle } from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { Column as ColumnType, Card as CardType } from "@/lib/types";
import { SortableCard } from "./SortableCard";
import { AddCardButton, type AddCardButtonHandle } from "./AddCardButton";

export interface ColumnHandle {
  focus: () => void;
  activateAddCard: () => void;
}

interface ColumnProps {
  column: ColumnType;
  cards: Record<string, CardType>;
  onCardClick?: (cardId: string) => void;
  draggedCardId?: string | null;
}

export const Column = forwardRef<ColumnHandle, ColumnProps>(function Column(
  { column, cards, onCardClick, draggedCardId },
  ref,
) {
  const addCardRef = useRef<AddCardButtonHandle>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useImperativeHandle(ref, () => ({
    focus: () => {
      const firstCard = sectionRef.current?.querySelector<HTMLElement>("[tabindex]");
      if (firstCard) {
        firstCard.focus();
      } else {
        sectionRef.current?.focus();
      }
    },
    activateAddCard: () => {
      addCardRef.current?.activate();
    },
  }));

  const cardCount = column.cardIds.length;

  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  return (
    <section
      ref={sectionRef}
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
      <SortableContext
        items={column.cardIds}
        strategy={verticalListSortingStrategy}
      >
        <div ref={setNodeRef} className="flex flex-1 flex-col gap-2 overflow-y-auto">
          {column.cardIds.map((cardId) => {
            const card = cards[cardId];
            if (!card) return null;
            return (
              <SortableCard
                key={cardId}
                card={card}
                onClick={() => onCardClick?.(cardId)}
                isDragOverlay={draggedCardId === cardId}
              />
            );
          })}
          {cardCount === 0 && (
            <p className="py-8 text-center text-sm text-slate-400">No tasks</p>
          )}
        </div>
      </SortableContext>
      <AddCardButton ref={addCardRef} columnId={column.id} />
    </section>
  );
});
