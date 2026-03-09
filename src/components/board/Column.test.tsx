import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Column } from "./Column";
import type { Column as ColumnType } from "@/lib/types";

function makeColumn(overrides: Partial<ColumnType> = {}): ColumnType {
  return {
    id: "test-col",
    title: "Test Column",
    cardIds: [],
    ...overrides,
  };
}

describe("Column", () => {
  it("displays the column title", () => {
    render(<Column column={makeColumn({ title: "To Do" })} cardCount={0} />);

    expect(screen.getByRole("heading", { level: 2, name: "To Do" })).toBeInTheDocument();
  });

  it("displays the card count badge", () => {
    render(<Column column={makeColumn()} cardCount={5} />);

    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("displays zero count when column is empty", () => {
    render(<Column column={makeColumn()} cardCount={0} />);

    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("shows empty state message when card count is 0", () => {
    render(<Column column={makeColumn()} cardCount={0} />);

    expect(screen.getByText("No tasks")).toBeInTheDocument();
  });

  it("does not show empty state message when cards exist", () => {
    render(<Column column={makeColumn({ cardIds: ["c1", "c2"] })} cardCount={2} />);

    expect(screen.queryByText("No tasks")).not.toBeInTheDocument();
  });

  it("has an accessible section with aria-label matching column title", () => {
    render(<Column column={makeColumn({ title: "In Progress" })} cardCount={3} />);

    const section = screen.getByRole("region", { name: "In Progress" });
    expect(section).toBeInTheDocument();
  });
});
