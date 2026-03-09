"use client";

import { useState } from "react";
import type { Card } from "@/lib/types";
import { useBoard } from "@/context/BoardContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Trash2 } from "lucide-react";

interface CardDetailModalProps {
  cardId: string | null;
  onClose: () => void;
}

export function CardDetailModal({ cardId, onClose }: CardDetailModalProps) {
  const { board } = useBoard();
  const card = cardId ? board.cards[cardId] : null;

  return (
    <Dialog
      open={!!card}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="p-6 sm:max-w-md">
        {card && <CardDetailContent key={card.id} card={card} onClose={onClose} />}
      </DialogContent>
    </Dialog>
  );
}

function CardDetailContent({
  card,
  onClose,
}: {
  card: Card;
  onClose: () => void;
}) {
  const { dispatch } = useBoard();
  const [title, setTitle] = useState(card.title);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  function handleTitleBlur() {
    const trimmed = title.trim();
    if (trimmed && trimmed !== card.title) {
      dispatch({ type: "UPDATE_CARD", cardId: card.id, updates: { title: trimmed } });
    } else if (!trimmed) {
      setTitle(card.title);
    }
  }

  function handleTitleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
      (e.target as HTMLInputElement).blur();
    }
  }

  function handleDelete() {
    dispatch({ type: "DELETE_CARD", cardId: card.id });
    setDeleteConfirmOpen(false);
    onClose();
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle className="sr-only">Edit card</DialogTitle>
      </DialogHeader>
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onBlur={handleTitleBlur}
        onKeyDown={handleTitleKeyDown}
        aria-label="Card title"
        className="text-base font-medium"
      />
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Calendar className="size-3.5" />
        <span>Created {new Date(card.createdAt).toLocaleDateString()}</span>
      </div>
      <div className="flex justify-end pt-2">
        <Button
          variant="destructive"
          size="sm"
          onClick={() => setDeleteConfirmOpen(true)}
        >
          <Trash2 className="size-3.5" />
          Delete
        </Button>
      </div>
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete card</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &ldquo;{card.title}&rdquo;? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
