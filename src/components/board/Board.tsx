"use client";

import { useState, useCallback, useRef } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  KeyboardSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useBoard } from "@/context/BoardContext";
import { Column, type ColumnHandle } from "./Column";
import { Card } from "./Card";
import { CardDetailModal } from "./CardDetailModal";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { SearchDialog } from "@/components/search/SearchDialog";

export function Board() {
  const { board, dispatch } = useBoard();
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const [draggedCardId, setDraggedCardId] = useState<string | null>(null);
  const columnRefs = useRef<(ColumnHandle | null)[]>([]);

  const handleNewCard = useCallback(() => {
    columnRefs.current[0]?.activateAddCard();
  }, []);

  const handleEscape = useCallback(() => {
    setActiveCardId(null);
  }, []);

  const handleFocusColumn = useCallback((columnIndex: number) => {
    columnRefs.current[columnIndex]?.focus();
  }, []);

  useKeyboardShortcuts({
    onNewCard: handleNewCard,
    onEscape: handleEscape,
    onFocusColumn: handleFocusColumn,
  });

  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: { distance: 5 },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 250, tolerance: 5 },
  });
  const keyboardSensor = useSensor(KeyboardSensor, {
    coordinateGetter: sortableKeyboardCoordinates,
  });
  const sensors = useSensors(pointerSensor, touchSensor, keyboardSensor);

  const findColumnByCardId = useCallback(
    (cardId: string): string | undefined => {
      return board.columns.find((col) => col.cardIds.includes(cardId))?.id;
    },
    [board.columns]
  );

  function handleDragStart(event: DragStartEvent) {
    setDraggedCardId(event.active.id as string);
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeColumnId = findColumnByCardId(activeId);
    // over could be a card or a column (droppable)
    let overColumnId = findColumnByCardId(overId);
    if (!overColumnId) {
      // overId might be a column id itself
      overColumnId = board.columns.find((col) => col.id === overId)?.id;
    }

    if (!activeColumnId || !overColumnId || activeColumnId === overColumnId) return;

    // Move card to new column during drag for visual feedback
    const overColumn = board.columns.find((col) => col.id === overColumnId);
    if (!overColumn) return;

    const overIndex = overColumn.cardIds.indexOf(overId);
    const toIndex = overIndex >= 0 ? overIndex : overColumn.cardIds.length;

    dispatch({
      type: "MOVE_CARD",
      cardId: activeId,
      fromColumnId: activeColumnId,
      toColumnId: overColumnId,
      toIndex,
    });
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setDraggedCardId(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    const activeColumnId = findColumnByCardId(activeId);
    let overColumnId = findColumnByCardId(overId);
    if (!overColumnId) {
      overColumnId = board.columns.find((col) => col.id === overId)?.id;
    }

    if (!activeColumnId || !overColumnId) return;

    if (activeColumnId === overColumnId) {
      // Reorder within same column
      const column = board.columns.find((col) => col.id === activeColumnId);
      if (!column) return;
      const overIndex = column.cardIds.indexOf(overId);
      if (overIndex === -1) return;

      dispatch({
        type: "REORDER_CARD",
        columnId: activeColumnId,
        cardId: activeId,
        toIndex: overIndex,
      });
    }
    // Cross-column moves already handled in handleDragOver
  }

  const draggedCard = draggedCardId ? board.cards[draggedCardId] : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <main className="flex flex-1 gap-4 overflow-x-auto p-4 lg:overflow-x-visible">
        {board.columns.map((column, index) => (
          <Column
            key={column.id}
            ref={(handle) => { columnRefs.current[index] = handle; }}
            column={column}
            cards={board.cards}
            onCardClick={(cardId) => setActiveCardId(cardId)}
            draggedCardId={draggedCardId}
          />
        ))}
        <CardDetailModal
          cardId={activeCardId}
          onClose={() => setActiveCardId(null)}
        />
        <SearchDialog onSelectCard={(cardId) => setActiveCardId(cardId)} />
      </main>
      <DragOverlay>
        {draggedCard ? (
          <div className="rotate-2 shadow-lg motion-reduce:rotate-0 motion-reduce:transition-none">
            <Card card={draggedCard} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
