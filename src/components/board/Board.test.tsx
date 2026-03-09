import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { Board } from "./Board";
import { BoardProvider } from "@/context/BoardContext";

function renderBoard() {
  return render(
    <BoardProvider>
      <Board />
    </BoardProvider>
  );
}

describe("Board", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders three columns from context", () => {
    renderBoard();

    expect(screen.getByRole("region", { name: "To Do" })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "In Progress" })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Done" })).toBeInTheDocument();
  });

  it("renders inside a main element", () => {
    renderBoard();

    expect(screen.getByRole("main")).toBeInTheDocument();
  });

  it("renders exactly 3 column sections", () => {
    renderBoard();

    const sections = screen.getAllByRole("region");
    expect(sections).toHaveLength(3);
  });
});
