import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { AddCardButton } from "./AddCardButton";

const mockDispatch = vi.fn();

vi.mock("@/context/BoardContext", () => ({
  useBoard: () => ({ dispatch: mockDispatch }),
}));

describe("AddCardButton", () => {
  beforeEach(() => {
    mockDispatch.mockClear();
  });

  it("shows '+ Add card' button initially", () => {
    render(<AddCardButton columnId="col-1" />);

    expect(
      screen.getByRole("button", { name: /add card/i })
    ).toBeInTheDocument();
  });

  it("shows text input after clicking the add button", async () => {
    const user = userEvent.setup();
    render(<AddCardButton columnId="col-1" />);

    await user.click(screen.getByRole("button", { name: /add card/i }));

    expect(
      screen.getByRole("textbox", { name: "New card title" })
    ).toBeInTheDocument();
    // The button should no longer be visible
    expect(
      screen.queryByRole("button", { name: /add card/i })
    ).not.toBeInTheDocument();
  });

  it("dispatches ADD_CARD when typing and pressing Enter", async () => {
    const user = userEvent.setup();
    render(<AddCardButton columnId="col-1" />);

    await user.click(screen.getByRole("button", { name: /add card/i }));
    await user.type(screen.getByRole("textbox"), "New Task{Enter}");

    expect(mockDispatch).toHaveBeenCalledWith({
      type: "ADD_CARD",
      columnId: "col-1",
      title: "New Task",
    });
  });

  it("returns to button state after submitting", async () => {
    const user = userEvent.setup();
    render(<AddCardButton columnId="col-1" />);

    await user.click(screen.getByRole("button", { name: /add card/i }));
    await user.type(screen.getByRole("textbox"), "New Task{Enter}");

    expect(
      screen.getByRole("button", { name: /add card/i })
    ).toBeInTheDocument();
  });

  it("cancels and returns to button when Escape is pressed", async () => {
    const user = userEvent.setup();
    render(<AddCardButton columnId="col-1" />);

    await user.click(screen.getByRole("button", { name: /add card/i }));
    await user.type(screen.getByRole("textbox"), "Draft");
    await user.keyboard("{Escape}");

    expect(mockDispatch).not.toHaveBeenCalled();
    expect(
      screen.getByRole("button", { name: /add card/i })
    ).toBeInTheDocument();
  });

  it("submits on blur when input has content", async () => {
    const user = userEvent.setup();
    render(<AddCardButton columnId="col-1" />);

    await user.click(screen.getByRole("button", { name: /add card/i }));
    await user.type(screen.getByRole("textbox"), "Blur Task");
    // Tab away to trigger blur
    await user.tab();

    expect(mockDispatch).toHaveBeenCalledWith({
      type: "ADD_CARD",
      columnId: "col-1",
      title: "Blur Task",
    });
  });

  it("cancels on blur when input is empty", async () => {
    const user = userEvent.setup();
    render(<AddCardButton columnId="col-1" />);

    await user.click(screen.getByRole("button", { name: /add card/i }));
    // Tab away without typing
    await user.tab();

    expect(mockDispatch).not.toHaveBeenCalled();
    expect(
      screen.getByRole("button", { name: /add card/i })
    ).toBeInTheDocument();
  });

  it("cancels on blur when input is only whitespace", async () => {
    const user = userEvent.setup();
    render(<AddCardButton columnId="col-1" />);

    await user.click(screen.getByRole("button", { name: /add card/i }));
    await user.type(screen.getByRole("textbox"), "   ");
    await user.tab();

    expect(mockDispatch).not.toHaveBeenCalled();
    expect(
      screen.getByRole("button", { name: /add card/i })
    ).toBeInTheDocument();
  });

  it("trims whitespace from the card title before dispatching", async () => {
    const user = userEvent.setup();
    render(<AddCardButton columnId="col-1" />);

    await user.click(screen.getByRole("button", { name: /add card/i }));
    await user.type(screen.getByRole("textbox"), "  Trimmed Title  {Enter}");

    expect(mockDispatch).toHaveBeenCalledWith({
      type: "ADD_CARD",
      columnId: "col-1",
      title: "Trimmed Title",
    });
  });

  it("does not dispatch when submitting empty input via Enter", async () => {
    const user = userEvent.setup();
    render(<AddCardButton columnId="col-1" />);

    await user.click(screen.getByRole("button", { name: /add card/i }));
    await user.keyboard("{Enter}");

    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it("has a minimum touch target of 44px", () => {
    render(<AddCardButton columnId="col-1" />);

    const button = screen.getByRole("button", { name: /add card/i });
    expect(button.className).toContain("min-h-[44px]");
  });

  it("includes the columnId in the button aria-label", () => {
    render(<AddCardButton columnId="todo" />);

    expect(
      screen.getByRole("button", { name: "Add card to todo" })
    ).toBeInTheDocument();
  });
});
