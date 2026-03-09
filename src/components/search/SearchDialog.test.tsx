import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { SearchDialog } from "./SearchDialog";
import { BoardProvider } from "@/context/BoardContext";

function renderSearch(onSelectCard = vi.fn()) {
  return {
    onSelectCard,
    ...render(
      <BoardProvider>
        <SearchDialog onSelectCard={onSelectCard} />
      </BoardProvider>,
    ),
  };
}

describe("SearchDialog", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("opens on Cmd+K", async () => {
    renderSearch();

    // Dialog should not be open initially — no search input visible
    expect(screen.queryByPlaceholderText("Search cards...")).not.toBeInTheDocument();

    // Simulate Cmd+K
    await userEvent.keyboard("{Meta>}k{/Meta}");

    expect(screen.getByPlaceholderText("Search cards...")).toBeInTheDocument();
  });

  it("opens on Ctrl+K", async () => {
    renderSearch();

    await userEvent.keyboard("{Control>}k{/Control}");

    expect(screen.getByPlaceholderText("Search cards...")).toBeInTheDocument();
  });

  it("shows empty state when no cards exist", async () => {
    renderSearch();

    await userEvent.keyboard("{Meta>}k{/Meta}");

    // Type something to trigger filtering
    await userEvent.type(screen.getByPlaceholderText("Search cards..."), "test");

    expect(screen.getByText("No cards found.")).toBeInTheDocument();
  });

  it("closes on Escape", async () => {
    renderSearch();

    await userEvent.keyboard("{Meta>}k{/Meta}");
    expect(screen.getByPlaceholderText("Search cards...")).toBeInTheDocument();

    await userEvent.keyboard("{Escape}");

    expect(screen.queryByPlaceholderText("Search cards...")).not.toBeInTheDocument();
  });
});
