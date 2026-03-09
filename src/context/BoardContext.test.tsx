import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { BoardProvider, useBoard } from "./BoardContext";
import type { ReactNode } from "react";

function wrapper({ children }: { children: ReactNode }) {
  return <BoardProvider>{children}</BoardProvider>;
}

describe("BoardContext", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("provides default board with 3 columns and no cards", () => {
    const { result } = renderHook(() => useBoard(), { wrapper });
    expect(result.current.board.columns).toHaveLength(3);
    expect(result.current.board.columns[0].title).toBe("To Do");
    expect(result.current.board.columns[1].title).toBe("In Progress");
    expect(result.current.board.columns[2].title).toBe("Done");
    expect(Object.keys(result.current.board.cards)).toHaveLength(0);
  });

  it("throws when useBoard is used outside BoardProvider", () => {
    expect(() => renderHook(() => useBoard())).toThrow("useBoard must be used within a BoardProvider");
  });

  it("ADD_CARD creates a card and adds it to the correct column", () => {
    const { result } = renderHook(() => useBoard(), { wrapper });

    act(() => {
      result.current.dispatch({ type: "ADD_CARD", columnId: "todo", title: "Test task" });
    });

    const cardIds = result.current.board.columns[0].cardIds;
    expect(cardIds).toHaveLength(1);
    const card = result.current.board.cards[cardIds[0]];
    expect(card.title).toBe("Test task");
    expect(card.labels).toEqual([]);
    expect(card.createdAt).toBeDefined();
  });

  it("UPDATE_CARD updates card fields", () => {
    const { result } = renderHook(() => useBoard(), { wrapper });

    act(() => {
      result.current.dispatch({ type: "ADD_CARD", columnId: "todo", title: "Original" });
    });

    const cardId = result.current.board.columns[0].cardIds[0];

    act(() => {
      result.current.dispatch({
        type: "UPDATE_CARD",
        cardId,
        updates: { title: "Updated", description: "A description" },
      });
    });

    expect(result.current.board.cards[cardId].title).toBe("Updated");
    expect(result.current.board.cards[cardId].description).toBe("A description");
  });

  it("DELETE_CARD removes card from state and column", () => {
    const { result } = renderHook(() => useBoard(), { wrapper });

    act(() => {
      result.current.dispatch({ type: "ADD_CARD", columnId: "todo", title: "To delete" });
    });

    const cardId = result.current.board.columns[0].cardIds[0];

    act(() => {
      result.current.dispatch({ type: "DELETE_CARD", cardId });
    });

    expect(result.current.board.columns[0].cardIds).toHaveLength(0);
    expect(result.current.board.cards[cardId]).toBeUndefined();
  });

  it("MOVE_CARD moves a card between columns", () => {
    const { result } = renderHook(() => useBoard(), { wrapper });

    act(() => {
      result.current.dispatch({ type: "ADD_CARD", columnId: "todo", title: "Moving card" });
    });

    const cardId = result.current.board.columns[0].cardIds[0];

    act(() => {
      result.current.dispatch({
        type: "MOVE_CARD",
        cardId,
        fromColumnId: "todo",
        toColumnId: "in-progress",
        toIndex: 0,
      });
    });

    expect(result.current.board.columns[0].cardIds).toHaveLength(0);
    expect(result.current.board.columns[1].cardIds).toContain(cardId);
  });

  it("REORDER_CARD changes position within a column", () => {
    const { result } = renderHook(() => useBoard(), { wrapper });

    act(() => {
      result.current.dispatch({ type: "ADD_CARD", columnId: "todo", title: "First" });
      result.current.dispatch({ type: "ADD_CARD", columnId: "todo", title: "Second" });
      result.current.dispatch({ type: "ADD_CARD", columnId: "todo", title: "Third" });
    });

    const cardIds = result.current.board.columns[0].cardIds;
    const firstCardId = cardIds[0];

    act(() => {
      result.current.dispatch({
        type: "REORDER_CARD",
        columnId: "todo",
        cardId: firstCardId,
        toIndex: 2,
      });
    });

    expect(result.current.board.columns[0].cardIds[2]).toBe(firstCardId);
  });

  it("persists board state to localStorage", () => {
    const { result } = renderHook(() => useBoard(), { wrapper });

    act(() => {
      result.current.dispatch({ type: "ADD_CARD", columnId: "todo", title: "Persisted" });
    });

    const stored = JSON.parse(localStorage.getItem("kanbanflow-board")!);
    expect(Object.values(stored.cards)).toHaveLength(1);
  });
});
