import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { useKeyboardShortcuts } from "./useKeyboardShortcuts";

function fireKey(key: string, options: Partial<KeyboardEventInit> = {}) {
  document.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, ...options }));
}

describe("useKeyboardShortcuts", () => {
  it("calls onNewCard when N is pressed", () => {
    const onNewCard = vi.fn();
    renderHook(() =>
      useKeyboardShortcuts({
        onNewCard,
        onEscape: vi.fn(),
        onFocusColumn: vi.fn(),
      }),
    );

    fireKey("n");
    expect(onNewCard).toHaveBeenCalledTimes(1);
  });

  it("calls onNewCard when uppercase N is pressed", () => {
    const onNewCard = vi.fn();
    renderHook(() =>
      useKeyboardShortcuts({
        onNewCard,
        onEscape: vi.fn(),
        onFocusColumn: vi.fn(),
      }),
    );

    fireKey("N");
    expect(onNewCard).toHaveBeenCalledTimes(1);
  });

  it("calls onEscape when Escape is pressed", () => {
    const onEscape = vi.fn();
    renderHook(() =>
      useKeyboardShortcuts({
        onNewCard: vi.fn(),
        onEscape,
        onFocusColumn: vi.fn(),
      }),
    );

    fireKey("Escape");
    expect(onEscape).toHaveBeenCalledTimes(1);
  });

  it("calls onFocusColumn with correct index for 1, 2, 3", () => {
    const onFocusColumn = vi.fn();
    renderHook(() =>
      useKeyboardShortcuts({
        onNewCard: vi.fn(),
        onEscape: vi.fn(),
        onFocusColumn,
      }),
    );

    fireKey("1");
    expect(onFocusColumn).toHaveBeenCalledWith(0);

    fireKey("2");
    expect(onFocusColumn).toHaveBeenCalledWith(1);

    fireKey("3");
    expect(onFocusColumn).toHaveBeenCalledWith(2);
  });

  it("does not fire N shortcut when target is an input", () => {
    const onNewCard = vi.fn();
    renderHook(() =>
      useKeyboardShortcuts({
        onNewCard,
        onEscape: vi.fn(),
        onFocusColumn: vi.fn(),
      }),
    );

    const input = document.createElement("input");
    document.body.appendChild(input);
    input.focus();

    input.dispatchEvent(new KeyboardEvent("keydown", { key: "n", bubbles: true }));
    expect(onNewCard).not.toHaveBeenCalled();

    document.body.removeChild(input);
  });

  it("does not fire number shortcuts when target is a textarea", () => {
    const onFocusColumn = vi.fn();
    renderHook(() =>
      useKeyboardShortcuts({
        onNewCard: vi.fn(),
        onEscape: vi.fn(),
        onFocusColumn,
      }),
    );

    const textarea = document.createElement("textarea");
    document.body.appendChild(textarea);
    textarea.focus();

    textarea.dispatchEvent(new KeyboardEvent("keydown", { key: "1", bubbles: true }));
    expect(onFocusColumn).not.toHaveBeenCalled();

    document.body.removeChild(textarea);
  });

  it("fires Escape even when focus is in an input", () => {
    const onEscape = vi.fn();
    renderHook(() =>
      useKeyboardShortcuts({
        onNewCard: vi.fn(),
        onEscape,
        onFocusColumn: vi.fn(),
      }),
    );

    const input = document.createElement("input");
    document.body.appendChild(input);
    input.focus();

    input.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    expect(onEscape).toHaveBeenCalledTimes(1);

    document.body.removeChild(input);
  });

  it("does not fire shortcuts when modifier keys are held", () => {
    const onNewCard = vi.fn();
    renderHook(() =>
      useKeyboardShortcuts({
        onNewCard,
        onEscape: vi.fn(),
        onFocusColumn: vi.fn(),
      }),
    );

    fireKey("n", { ctrlKey: true });
    fireKey("n", { metaKey: true });
    fireKey("n", { altKey: true });
    expect(onNewCard).not.toHaveBeenCalled();
  });
});
