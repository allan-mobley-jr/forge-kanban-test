"use client";

import type { Card as CardType } from "@/lib/types";

interface CardProps {
  card: CardType;
  onClick?: () => void;
}

export function Card({ card, onClick }: CardProps) {
  return (
    <article
      aria-label={card.title}
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
      className="cursor-pointer rounded-lg bg-white p-3 shadow-sm transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <h3 className="text-sm font-medium text-slate-900">{card.title}</h3>
      {card.description && (
        <p className="mt-1 line-clamp-2 text-xs text-slate-500">
          {card.description}
        </p>
      )}
    </article>
  );
}
