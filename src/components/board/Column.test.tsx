import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { Column } from "./Column";
import { BoardProvider } from "@/context/BoardContext";
import type { Column as ColumnType, Card } from "@/lib/types";

function makeColumn(overrides: Partial<ColumnType> = {}): ColumnType {
  return {
    id: "test-col",
    title: "Test Column",
    cardIds: [],
    ...overrides,
  };
}

function makeCards(...items: { id: string; title: string }[]): Record<string, Card> {
  const cards: Record<string, Card> = {};
  for (const item of items) {
    cards[item.id] = {
      id: item.id,
      title: item.title,
      labels: [],
      createdAt: new Date().toISOString(),
    };
  }
  return cards;
}

function renderColumn(column: ColumnType, cards: Record<string, Card> = {}) {
  return render(
    <BoardProvider>
      <Column column={column} cards={cards} />
    </BoardProvider>
  );
}

describe("Column", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("displays the column title", () => {
    renderColumn(makeColumn({ title: "To Do" }));

    expect(screen.getByRole("heading", { level: 2, name: "To Do" })).toBeInTheDocument();
  });

  it("displays the card count badge", () => {
    const cards = makeCards({ id: "c1", title: "A" }, { id: "c2", title: "B" });
    renderColumn(makeColumn({ cardIds: ["c1", "c2"] }), cards);

    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("displays zero count when column is empty", () => {
    renderColumn(makeColumn());

    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("shows empty state message when card count is 0", () => {
    renderColumn(makeColumn());

    expect(screen.getByText("No tasks")).toBeInTheDocument();
  });

  it("does not show empty state message when cards exist", () => {
    const cards = makeCards({ id: "c1", title: "A" }, { id: "c2", title: "B" });
    renderColumn(makeColumn({ cardIds: ["c1", "c2"] }), cards);

    expect(screen.queryByText("No tasks")).not.toBeInTheDocument();
  });

  it("has an accessible section with aria-label matching column title", () => {
    renderColumn(makeColumn({ title: "In Progress" }));

    const section = screen.getByRole("region", { name: "In Progress" });
    expect(section).toBeInTheDocument();
  });

  it("renders card titles within the column", () => {
    const cards = makeCards({ id: "c1", title: "Task One" }, { id: "c2", title: "Task Two" });
    renderColumn(makeColumn({ cardIds: ["c1", "c2"] }), cards);

    expect(screen.getByText("Task One")).toBeInTheDocument();
    expect(screen.getByText("Task Two")).toBeInTheDocument();
  });

  it("renders an add card button", () => {
    renderColumn(makeColumn());

    expect(screen.getByRole("button", { name: /add card/i })).toBeInTheDocument();
  });
});
