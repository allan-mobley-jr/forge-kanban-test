import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { CardDetailModal } from "./CardDetailModal";
import type { Card } from "@/lib/types";

// --- Mocks ---

const mockDispatch = vi.fn();
const mockBoard = {
  version: 1,
  columns: [
    { id: "todo", title: "To Do", cardIds: ["card-1"] },
    { id: "in-progress", title: "In Progress", cardIds: [] },
    { id: "done", title: "Done", cardIds: [] },
  ],
  cards: {} as Record<string, Card>,
};

vi.mock("@/context/BoardContext", () => ({
  useBoard: () => ({ board: mockBoard, dispatch: mockDispatch }),
}));

// Mock Dialog to render children directly (avoids base-ui portal issues in jsdom)
vi.mock("@/components/ui/dialog", () => ({
  Dialog: ({ children, open }: { children: React.ReactNode; open: boolean }) =>
    open ? <div data-testid="dialog">{children}</div> : null,
  DialogContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dialog-content">{children}</div>
  ),
  DialogHeader: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DialogTitle: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <h2 className={className}>{children}</h2>
  ),
}));

// Mock AlertDialog to render children directly
vi.mock("@/components/ui/alert-dialog", () => ({
  AlertDialog: ({
    children,
    open,
  }: {
    children: React.ReactNode;
    open: boolean;
  }) => (open ? <div data-testid="alert-dialog">{children}</div> : null),
  AlertDialogContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="alert-dialog-content">{children}</div>
  ),
  AlertDialogHeader: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  AlertDialogTitle: ({ children }: { children: React.ReactNode }) => (
    <h2>{children}</h2>
  ),
  AlertDialogDescription: ({ children }: { children: React.ReactNode }) => (
    <p>{children}</p>
  ),
  AlertDialogFooter: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  AlertDialogCancel: ({
    children,
    ...props
  }: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    children: React.ReactNode;
  }) => <button {...props}>{children}</button>,
  AlertDialogAction: ({
    children,
    variant,
    ...rest
  }: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    children: React.ReactNode;
    variant?: string;
  }) => {
    void variant;
    return <button {...rest}>{children}</button>;
  },
}));

// Mock Button to render a plain button
vi.mock("@/components/ui/button", () => ({
  Button: ({
    children,
    variant,
    size,
    ...rest
  }: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    children: React.ReactNode;
    variant?: string;
    size?: string;
  }) => {
    void variant;
    void size;
    return <button {...rest}>{children}</button>;
  },
}));

// Mock Input to render a plain input
vi.mock("@/components/ui/input", () => ({
  Input: (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input {...props} />
  ),
}));

// Mock lucide-react icons
vi.mock("lucide-react", () => ({
  Calendar: () => <span data-testid="calendar-icon" />,
  Trash2: () => <span data-testid="trash-icon" />,
}));

// --- Helpers ---

function makeCard(overrides: Partial<Card> = {}): Card {
  return {
    id: "card-1",
    title: "Test Card",
    labels: [],
    createdAt: "2025-01-15T12:00:00.000Z",
    ...overrides,
  };
}

function setMockCards(cards: Record<string, Card>) {
  mockBoard.cards = cards;
}

function renderModal(cardId: string | null = "card-1", onClose = vi.fn()) {
  return {
    onClose,
    ...render(<CardDetailModal cardId={cardId} onClose={onClose} />),
  };
}

// --- Tests ---

describe("CardDetailModal", () => {
  beforeEach(() => {
    mockDispatch.mockClear();
    setMockCards({ "card-1": makeCard() });
  });

  describe("opening and closing", () => {
    it("renders nothing when cardId is null", () => {
      renderModal(null);

      expect(screen.queryByTestId("dialog")).not.toBeInTheDocument();
    });

    it("renders nothing when cardId does not match any card in the board", () => {
      renderModal("nonexistent-card");

      expect(screen.queryByTestId("dialog")).not.toBeInTheDocument();
    });

    it("renders dialog content when cardId matches a card", () => {
      renderModal("card-1");

      expect(screen.getByTestId("dialog")).toBeInTheDocument();
    });
  });

  describe("card title display and editing", () => {
    it("displays the card title in an input field", () => {
      renderModal("card-1");

      const input = screen.getByLabelText("Card title");
      expect(input).toBeInTheDocument();
      expect(input).toHaveValue("Test Card");
    });

    it("allows editing the title", async () => {
      const user = userEvent.setup();
      renderModal("card-1");

      const input = screen.getByLabelText("Card title");
      await user.clear(input);
      await user.type(input, "Updated Title");

      expect(input).toHaveValue("Updated Title");
    });

    it("dispatches UPDATE_CARD on blur when title has changed", async () => {
      const user = userEvent.setup();
      renderModal("card-1");

      const input = screen.getByLabelText("Card title");
      await user.clear(input);
      await user.type(input, "Updated Title");
      await user.tab(); // triggers blur

      expect(mockDispatch).toHaveBeenCalledWith({
        type: "UPDATE_CARD",
        cardId: "card-1",
        updates: { title: "Updated Title" },
      });
    });

    it("trims whitespace before dispatching title update", async () => {
      const user = userEvent.setup();
      renderModal("card-1");

      const input = screen.getByLabelText("Card title");
      await user.clear(input);
      await user.type(input, "  Trimmed Title  ");
      await user.tab();

      expect(mockDispatch).toHaveBeenCalledWith({
        type: "UPDATE_CARD",
        cardId: "card-1",
        updates: { title: "Trimmed Title" },
      });
    });

    it("does not dispatch when title has not changed", async () => {
      const user = userEvent.setup();
      renderModal("card-1");

      const input = screen.getByLabelText("Card title");
      // Focus and blur without changing
      await user.click(input);
      await user.tab();

      expect(mockDispatch).not.toHaveBeenCalled();
    });

    it("reverts to original title on blur when input is empty", async () => {
      const user = userEvent.setup();
      renderModal("card-1");

      const input = screen.getByLabelText("Card title");
      await user.clear(input);
      await user.tab();

      expect(input).toHaveValue("Test Card");
      expect(mockDispatch).not.toHaveBeenCalled();
    });

    it("reverts to original title on blur when input is only whitespace", async () => {
      const user = userEvent.setup();
      renderModal("card-1");

      const input = screen.getByLabelText("Card title");
      await user.clear(input);
      await user.type(input, "   ");
      await user.tab();

      expect(input).toHaveValue("Test Card");
      expect(mockDispatch).not.toHaveBeenCalled();
    });

    it("dispatches UPDATE_CARD when Enter is pressed with changed title", async () => {
      const user = userEvent.setup();
      renderModal("card-1");

      const input = screen.getByLabelText("Card title");
      await user.clear(input);
      await user.type(input, "Enter Title{Enter}");

      expect(mockDispatch).toHaveBeenCalledWith({
        type: "UPDATE_CARD",
        cardId: "card-1",
        updates: { title: "Enter Title" },
      });
    });
  });

  describe("created date display", () => {
    it("displays the created date", () => {
      setMockCards({
        "card-1": makeCard({ createdAt: "2025-01-15T12:00:00.000Z" }),
      });
      renderModal("card-1");

      // toLocaleDateString for 2025-01-15 — match partial text
      expect(screen.getByText(/Created/)).toBeInTheDocument();
      expect(screen.getByText(/1\/15\/2025/)).toBeInTheDocument();
    });

    it("shows the calendar icon", () => {
      renderModal("card-1");

      expect(screen.getByTestId("calendar-icon")).toBeInTheDocument();
    });
  });

  describe("delete flow", () => {
    it("shows a Delete button", () => {
      renderModal("card-1");

      expect(
        screen.getByRole("button", { name: /delete/i })
      ).toBeInTheDocument();
    });

    it("shows confirmation dialog when Delete button is clicked", async () => {
      const user = userEvent.setup();
      renderModal("card-1");

      await user.click(screen.getByRole("button", { name: /delete/i }));

      expect(screen.getByTestId("alert-dialog")).toBeInTheDocument();
      expect(screen.getByText("Delete card")).toBeInTheDocument();
      expect(
        screen.getByText(/Are you sure you want to delete/)
      ).toBeInTheDocument();
    });

    it("includes the card title in the confirmation message", async () => {
      const user = userEvent.setup();
      renderModal("card-1");

      await user.click(screen.getByRole("button", { name: /delete/i }));

      expect(
        screen.getByText(/Test Card/)
      ).toBeInTheDocument();
    });

    it("does not dispatch DELETE_CARD before confirming", async () => {
      const user = userEvent.setup();
      renderModal("card-1");

      await user.click(screen.getByRole("button", { name: /delete/i }));

      expect(mockDispatch).not.toHaveBeenCalledWith(
        expect.objectContaining({ type: "DELETE_CARD" })
      );
    });

    it("dispatches DELETE_CARD and calls onClose when confirmed", async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();
      renderModal("card-1", onClose);

      // Click the initial Delete button to open confirmation
      await user.click(screen.getByRole("button", { name: /delete/i }));

      // Within the alert dialog, find the confirmation Delete button
      const alertDialog = screen.getByTestId("alert-dialog");
      const confirmButton = within(alertDialog).getByRole("button", {
        name: /delete/i,
      });
      await user.click(confirmButton);

      expect(mockDispatch).toHaveBeenCalledWith({
        type: "DELETE_CARD",
        cardId: "card-1",
      });
      expect(onClose).toHaveBeenCalled();
    });

    it("shows Cancel button in the confirmation dialog", async () => {
      const user = userEvent.setup();
      renderModal("card-1");

      await user.click(screen.getByRole("button", { name: /delete/i }));

      const alertDialog = screen.getByTestId("alert-dialog");
      expect(
        within(alertDialog).getByRole("button", { name: /cancel/i })
      ).toBeInTheDocument();
    });
  });

  describe("multiple cards", () => {
    it("displays the correct card when multiple cards exist", () => {
      setMockCards({
        "card-1": makeCard({ id: "card-1", title: "First Card" }),
        "card-2": makeCard({ id: "card-2", title: "Second Card" }),
      });
      renderModal("card-2");

      const input = screen.getByLabelText("Card title");
      expect(input).toHaveValue("Second Card");
    });
  });

  describe("accessibility", () => {
    it("has a sr-only dialog title for screen readers", () => {
      renderModal("card-1");

      expect(screen.getByText("Edit card")).toBeInTheDocument();
    });

    it("title input has accessible aria-label", () => {
      renderModal("card-1");

      expect(screen.getByLabelText("Card title")).toBeInTheDocument();
    });
  });
});
