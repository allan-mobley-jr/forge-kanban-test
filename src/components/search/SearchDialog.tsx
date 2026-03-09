"use client";

import { useCallback, useEffect, useState } from "react";
import { useBoard } from "@/context/BoardContext";
import {
  CommandDialog,
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";

interface SearchDialogProps {
  onSelectCard: (cardId: string) => void;
}

export function SearchDialog({ onSelectCard }: SearchDialogProps) {
  const [open, setOpen] = useState(false);
  const { board } = useBoard();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSelect = useCallback(
    (cardId: string) => {
      setOpen(false);
      onSelectCard(cardId);
    },
    [onSelectCard],
  );

  const columnNameById = Object.fromEntries(
    board.columns.map((col) => [col.id, col.title]),
  );

  function getColumnForCard(cardId: string): string {
    const col = board.columns.find((c) => c.cardIds.includes(cardId));
    return col ? columnNameById[col.id] : "";
  }

  const allCards = Object.values(board.cards);

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      title="Search cards"
      description="Find cards by title or description"
    >
      <Command>
        <CommandInput placeholder="Search cards..." />
        <CommandList>
          <CommandEmpty>No cards found.</CommandEmpty>
          <CommandGroup>
            {allCards.map((card) => (
              <CommandItem
                key={card.id}
                value={`${card.title} ${card.description ?? ""}`}
                onSelect={() => handleSelect(card.id)}
              >
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{card.title}</span>
                  <span className="text-xs text-slate-500">
                    {getColumnForCard(card.id)}
                  </span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
