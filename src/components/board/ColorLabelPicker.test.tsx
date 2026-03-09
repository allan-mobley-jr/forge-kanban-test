import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { ColorLabelPicker } from "./ColorLabelPicker";

describe("ColorLabelPicker", () => {
  it("renders 5 color buttons", () => {
    render(<ColorLabelPicker selected={[]} onChange={() => {}} />);

    expect(screen.getByLabelText("Red label")).toBeInTheDocument();
    expect(screen.getByLabelText("Yellow label")).toBeInTheDocument();
    expect(screen.getByLabelText("Green label")).toBeInTheDocument();
    expect(screen.getByLabelText("Blue label")).toBeInTheDocument();
    expect(screen.getByLabelText("Purple label")).toBeInTheDocument();
  });

  it("shows selected state in aria-label", () => {
    render(<ColorLabelPicker selected={["red", "blue"]} onChange={() => {}} />);

    expect(screen.getByLabelText("Red label, selected")).toBeInTheDocument();
    expect(screen.getByLabelText("Yellow label")).toBeInTheDocument();
    expect(screen.getByLabelText("Blue label, selected")).toBeInTheDocument();
  });

  it("adds a color when clicking an unselected label", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ColorLabelPicker selected={["red"]} onChange={onChange} />);

    await user.click(screen.getByLabelText("Green label"));

    expect(onChange).toHaveBeenCalledWith(["red", "green"]);
  });

  it("removes a color when clicking a selected label", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ColorLabelPicker selected={["red", "blue"]} onChange={onChange} />);

    await user.click(screen.getByLabelText("Red label, selected"));

    expect(onChange).toHaveBeenCalledWith(["blue"]);
  });

  it("has minimum 44px touch targets", () => {
    render(<ColorLabelPicker selected={[]} onChange={() => {}} />);

    const buttons = screen.getAllByRole("button");
    buttons.forEach((button) => {
      expect(button).toHaveClass("min-h-[44px]");
      expect(button).toHaveClass("min-w-[44px]");
    });
  });
});
