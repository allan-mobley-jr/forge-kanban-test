"use client";

import { useState } from "react";
import { useBoard } from "@/context/BoardContext";
import { Column } from "./Column";
import { CardDetailModal } from "./CardDetailModal";

export function Board() {
  const { board } = useBoard();
  const [activeCardId, setActiveCardId] = useState<string | null>(null);

  return (
    <main className="flex flex-1 gap-4 overflow-x-auto p-4 lg:overflow-x-visible">
      {board.columns.map((column) => (
        <Column
          key={column.id}
          column={column}
          cards={board.cards}
          onCardClick={(cardId) => setActiveCardId(cardId)}
        />
      ))}
      <CardDetailModal
        cardId={activeCardId}
        onClose={() => setActiveCardId(null)}
      />
    </main>
  );
}
