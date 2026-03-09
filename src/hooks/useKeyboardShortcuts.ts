"use client";

import { useEffect } from "react";

interface UseKeyboardShortcutsOptions {
  onNewCard: () => void;
  onEscape: () => void;
  onFocusColumn: (columnIndex: number) => void;
}

function isEditableElement(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tagName = target.tagName;
  if (tagName === "INPUT" || tagName === "TEXTAREA") return true;
  if (target.isContentEditable) return true;
  return false;
}

export function useKeyboardShortcuts({
  onNewCard,
  onEscape,
  onFocusColumn,
}: UseKeyboardShortcutsOptions) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Escape always fires regardless of focus
      if (e.key === "Escape") {
        onEscape();
        return;
      }

      // Skip single-key shortcuts when in editable elements
      if (isEditableElement(e.target)) return;

      // Skip if modifier keys are held (allow browser shortcuts)
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      switch (e.key) {
        case "n":
        case "N":
          e.preventDefault();
          onNewCard();
          break;
        case "1":
          e.preventDefault();
          onFocusColumn(0);
          break;
        case "2":
          e.preventDefault();
          onFocusColumn(1);
          break;
        case "3":
          e.preventDefault();
          onFocusColumn(2);
          break;
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onNewCard, onEscape, onFocusColumn]);
}
