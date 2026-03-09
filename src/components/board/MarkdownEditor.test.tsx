import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { MarkdownEditor } from "./MarkdownEditor";

describe("MarkdownEditor", () => {
  it("renders textarea and preview panel", () => {
    render(<MarkdownEditor value="" onChange={() => {}} />);

    expect(screen.getByLabelText("Card description")).toBeInTheDocument();
    expect(screen.getByText("Preview")).toBeInTheDocument();
  });

  it("displays initial value in textarea", () => {
    render(<MarkdownEditor value="Hello world" onChange={() => {}} />);

    const textarea = screen.getByLabelText("Card description") as HTMLTextAreaElement;
    expect(textarea.value).toBe("Hello world");
  });

  it("shows placeholder when empty", () => {
    render(<MarkdownEditor value="" onChange={() => {}} />);

    expect(
      screen.getByPlaceholderText("Add a description (supports Markdown)...")
    ).toBeInTheDocument();
  });

  it("calls onChange on blur when value changed", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<MarkdownEditor value="" onChange={onChange} />);

    const textarea = screen.getByLabelText("Card description");
    await user.click(textarea);
    await user.type(textarea, "New description");
    await user.tab();

    expect(onChange).toHaveBeenCalledWith("New description");
  });

  it("does not call onChange on blur when value unchanged", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<MarkdownEditor value="Same" onChange={onChange} />);

    const textarea = screen.getByLabelText("Card description");
    await user.click(textarea);
    await user.tab();

    expect(onChange).not.toHaveBeenCalled();
  });

  it("renders markdown in preview after debounce", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    render(<MarkdownEditor value="**bold text**" onChange={() => {}} />);

    // Wait for debounce
    vi.advanceTimersByTime(200);

    expect(screen.getByText("bold text")).toBeInTheDocument();

    vi.useRealTimers();
  });

  it("renders markdown headings", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });

    render(<MarkdownEditor value="# Heading" onChange={() => {}} />);

    vi.advanceTimersByTime(200);

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("Heading");

    vi.useRealTimers();
  });
});
