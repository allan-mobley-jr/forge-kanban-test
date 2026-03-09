"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Card as CardType } from "@/lib/types";
import { Card } from "./Card";

interface SortableCardProps {
  card: CardType;
  onClick?: () => void;
  isDragOverlay?: boolean;
}

export function SortableCard({ card, onClick, isDragOverlay }: SortableCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`motion-reduce:transition-none ${isDragging || isDragOverlay ? "opacity-40" : ""}`}
    >
      <Card card={card} onClick={!isDragging ? onClick : undefined} />
    </div>
  );
}
