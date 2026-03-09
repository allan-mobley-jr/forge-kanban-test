import type { Board } from "./types";

export const STORAGE_KEY = "kanbanflow-board";

export const BOARD_VERSION = 1;

export const DEFAULT_COLUMNS = [
  { id: "todo", title: "To Do", cardIds: [] },
  { id: "in-progress", title: "In Progress", cardIds: [] },
  { id: "done", title: "Done", cardIds: [] },
] as const;

export const LABEL_COLORS = [
  { id: "red", name: "Red", value: "#EF4444" },
  { id: "yellow", name: "Yellow", value: "#EAB308" },
  { id: "green", name: "Green", value: "#22C55E" },
  { id: "blue", name: "Blue", value: "#3B82F6" },
  { id: "purple", name: "Purple", value: "#A855F7" },
] as const;

export const DEFAULT_BOARD: Board = {
  version: BOARD_VERSION,
  columns: DEFAULT_COLUMNS.map((col) => ({ ...col, cardIds: [] as string[] })),
  cards: {},
};
// Auto-merge test Mon Mar  9 09:59:28 EDT 2026
// Copilot check detection test Mon Mar  9 10:04:13 EDT 2026
