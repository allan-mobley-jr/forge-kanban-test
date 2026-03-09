import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { DndContext } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableCard } from "./SortableCard";
import type { Card } from "@/lib/types";

const mockCard: Card = {
  id: "card-1",
  title: "Test Card",
  labels: [],
  createdAt: new Date().toISOString(),
};

function renderSortableCard(props: { onClick?: () => void; isDragOverlay?: boolean } = {}) {
  return render(
    <DndContext>
      <SortableContext items={["card-1"]} strategy={verticalListSortingStrategy}>
        <SortableCard card={mockCard} {...props} />
      </SortableContext>
    </DndContext>
  );
}

describe("SortableCard", () => {
  it("renders the card content", () => {
    renderSortableCard();
    expect(screen.getByText("Test Card")).toBeInTheDocument();
  });

  it("passes onClick to Card component", () => {
    renderSortableCard({ onClick: () => {} });

    // The card article element should be present and interactive
    const article = screen.getByRole("article", { name: "Test Card" });
    expect(article).toBeInTheDocument();
    expect(article).toHaveAttribute("tabindex", "0");
  });

  it("applies opacity when isDragOverlay is true", () => {
    const { container } = renderSortableCard({ isDragOverlay: true });
    const wrapper = container.firstElementChild;
    expect(wrapper).toHaveClass("opacity-40");
  });

  it("does not apply opacity when isDragOverlay is false", () => {
    const { container } = renderSortableCard({ isDragOverlay: false });
    const wrapper = container.firstElementChild;
    expect(wrapper).not.toHaveClass("opacity-40");
  });

  it("renders card description if present", () => {
    const cardWithDesc: Card = {
      ...mockCard,
      description: "A description",
    };
    render(
      <DndContext>
        <SortableContext items={["card-1"]} strategy={verticalListSortingStrategy}>
          <SortableCard card={cardWithDesc} />
        </SortableContext>
      </DndContext>
    );
    expect(screen.getByText("A description")).toBeInTheDocument();
  });
});
