"use client";

import { useBoard } from "@/context/BoardContext";
import { Column } from "./Column";

export function Board() {
  const { board } = useBoard();

  return (
    <main className="flex flex-1 gap-4 overflow-x-auto p-4 lg:overflow-x-visible">
      {board.columns.map((column) => (
        <Column
          key={column.id}
          column={column}
          cardCount={column.cardIds.length}
        />
      ))}
    </main>
  );
}
