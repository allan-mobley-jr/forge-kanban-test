import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Card } from "./Card";
import type { Card as CardType } from "@/lib/types";

function makeCard(overrides: Partial<CardType> = {}): CardType {
  return {
    id: "card-1",
    title: "Test Card",
    labels: [],
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

describe("Card", () => {
  it("renders the card title", () => {
    render(<Card card={makeCard({ title: "My Task" })} />);

    expect(screen.getByText("My Task")).toBeInTheDocument();
  });

  it("renders description when present", () => {
    render(
      <Card card={makeCard({ description: "Some details about the task" })} />
    );

    expect(screen.getByText("Some details about the task")).toBeInTheDocument();
  });

  it("does not render a description paragraph when description is absent", () => {
    render(<Card card={makeCard({ description: undefined })} />);

    // The only text content should be the title heading — no <p> element
    expect(screen.queryByRole("paragraph")).not.toBeInTheDocument();
  });

  it("renders as an accessible article with aria-label matching the title", () => {
    render(<Card card={makeCard({ title: "Accessible Card" })} />);

    const article = screen.getByRole("article", { name: "Accessible Card" });
    expect(article).toBeInTheDocument();
  });

  it("calls onClick when clicked", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<Card card={makeCard()} onClick={handleClick} />);

    await user.click(screen.getByRole("article"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("calls onClick when Enter key is pressed", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<Card card={makeCard()} onClick={handleClick} />);

    const article = screen.getByRole("article");
    article.focus();
    await user.keyboard("{Enter}");

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("calls onClick when Space key is pressed", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<Card card={makeCard()} onClick={handleClick} />);

    const article = screen.getByRole("article");
    article.focus();
    await user.keyboard(" ");

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("does not throw when clicked without an onClick handler", async () => {
    const user = userEvent.setup();

    render(<Card card={makeCard()} />);

    // Should not throw
    await user.click(screen.getByRole("article"));
  });
});
