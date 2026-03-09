"use client";

import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react";
import type { Board, Card } from "@/lib/types";
import { DEFAULT_BOARD, STORAGE_KEY } from "@/lib/constants";

type BoardAction =
  | { type: "ADD_CARD"; columnId: string; title: string }
  | { type: "UPDATE_CARD"; cardId: string; updates: Partial<Omit<Card, "id" | "createdAt">> }
  | { type: "DELETE_CARD"; cardId: string }
  | { type: "MOVE_CARD"; cardId: string; fromColumnId: string; toColumnId: string; toIndex: number }
  | { type: "REORDER_CARD"; columnId: string; cardId: string; toIndex: number };

function boardReducer(state: Board, action: BoardAction): Board {
  switch (action.type) {
    case "ADD_CARD": {
      const id = crypto.randomUUID();
      const card: Card = {
        id,
        title: action.title,
        labels: [],
        createdAt: new Date().toISOString(),
      };
      return {
        ...state,
        cards: { ...state.cards, [id]: card },
        columns: state.columns.map((col) =>
          col.id === action.columnId ? { ...col, cardIds: [...col.cardIds, id] } : col
        ),
      };
    }
    case "UPDATE_CARD": {
      const existing = state.cards[action.cardId];
      if (!existing) return state;
      return {
        ...state,
        cards: { ...state.cards, [action.cardId]: { ...existing, ...action.updates } },
      };
    }
    case "DELETE_CARD": {
      const remainingCards = Object.fromEntries(
        Object.entries(state.cards).filter(([id]) => id !== action.cardId)
      );
      return {
        ...state,
        cards: remainingCards,
        columns: state.columns.map((col) => ({
          ...col,
          cardIds: col.cardIds.filter((id) => id !== action.cardId),
        })),
      };
    }
    case "MOVE_CARD": {
      return {
        ...state,
        columns: state.columns.map((col) => {
          if (col.id === action.fromColumnId) {
            return { ...col, cardIds: col.cardIds.filter((id) => id !== action.cardId) };
          }
          if (col.id === action.toColumnId) {
            const newCardIds = [...col.cardIds];
            newCardIds.splice(action.toIndex, 0, action.cardId);
            return { ...col, cardIds: newCardIds };
          }
          return col;
        }),
      };
    }
    case "REORDER_CARD": {
      return {
        ...state,
        columns: state.columns.map((col) => {
          if (col.id !== action.columnId) return col;
          const oldIndex = col.cardIds.indexOf(action.cardId);
          if (oldIndex === -1) return col;
          const newCardIds = [...col.cardIds];
          newCardIds.splice(oldIndex, 1);
          newCardIds.splice(action.toIndex, 0, action.cardId);
          return { ...col, cardIds: newCardIds };
        }),
      };
    }
    default:
      return state;
  }
}

function loadBoard(): Board {
  if (typeof window === "undefined") return DEFAULT_BOARD;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as Board;
    }
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }
  return DEFAULT_BOARD;
}

interface BoardContextValue {
  board: Board;
  dispatch: React.Dispatch<BoardAction>;
}

const BoardContext = createContext<BoardContextValue | null>(null);

export function BoardProvider({ children }: { children: ReactNode }) {
  const [board, dispatch] = useReducer(boardReducer, undefined, loadBoard);

  // Auto-save to localStorage after every state change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(board));
    } catch {
      // Storage full — silently fail
    }
  }, [board]);

  return <BoardContext.Provider value={{ board, dispatch }}>{children}</BoardContext.Provider>;
}

export function useBoard() {
  const context = useContext(BoardContext);
  if (!context) {
    throw new Error("useBoard must be used within a BoardProvider");
  }
  return context;
}

export type { BoardAction };
