"use client";

import { useState, useImperativeHandle, forwardRef, type Ref } from "react";
import { useBoard } from "@/context/BoardContext";

export interface AddCardButtonHandle {
  activate: () => void;
}

interface AddCardButtonProps {
  columnId: string;
}

export const AddCardButton = forwardRef(function AddCardButton(
  { columnId }: AddCardButtonProps,
  ref: Ref<AddCardButtonHandle>,
) {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");
  const { dispatch } = useBoard();

  function handleSubmit() {
    const trimmed = title.trim();
    if (trimmed) {
      dispatch({ type: "ADD_CARD", columnId, title: trimmed });
    }
    setTitle("");
    setIsAdding(false);
  }

  function handleCancel() {
    setTitle("");
    setIsAdding(false);
  }

  useImperativeHandle(ref, () => ({
    activate: () => setIsAdding(true),
  }));

  if (isAdding) {
    return (
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSubmit();
          } else if (e.key === "Escape") {
            handleCancel();
          }
        }}
        onBlur={() => {
          if (title.trim()) {
            handleSubmit();
          } else {
            handleCancel();
          }
        }}
        autoFocus
        placeholder="Enter card title..."
        aria-label="New card title"
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setIsAdding(true)}
      className="flex min-h-[44px] w-full items-center justify-center rounded-lg text-sm font-medium text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      aria-label={`Add card to ${columnId}`}
    >
      + Add card
    </button>
  );
});
