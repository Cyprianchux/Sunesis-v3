import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Button, Input, Panel, Toast } from "../../../components/ui";

describe("UI components", () => {
  it("renders button, input, and panel content", () => {
    render(
      <>
        <Button>Save</Button>
        <Input aria-label="Name" />
        <Panel>Panel content</Panel>
      </>,
    );
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Name" })).toBeInTheDocument();
    expect(screen.getByText("Panel content")).toBeInTheDocument();
  });

  it("dismisses a toast after its timer", () => {
    vi.useFakeTimers();
    const onDismiss = vi.fn();
    render(<Toast message="Saved" onDismiss={onDismiss} />);
    vi.advanceTimersByTime(5000);
    expect(onDismiss).toHaveBeenCalledOnce();
    vi.useRealTimers();
  });
});
