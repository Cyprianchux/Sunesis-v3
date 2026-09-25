import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("../../../components/workspace-guard", () => ({
  WorkspaceGuard: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));
vi.mock("../../../lib/storage", () => ({
  getBoardEntries: () => [],
  saveBoardEntries: vi.fn(),
}));
vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(),
}));
import BoardPage from "../../../app/(workspace)/board/page";

describe("BoardPage", () => {
  it("saves an editor write-up", async () => {
    render(<BoardPage />);
    const editor = screen.getByRole("textbox", { name: "Typing board editor" });
    fireEvent.input(editor, { target: { innerText: "Explain photosynthesis" } });
    fireEvent.click(screen.getByRole("button", { name: "▣ Save write-up" }));
    await waitFor(() =>
      expect(screen.getByText("Write-up saved successfully.")).toBeInTheDocument(),
    );
  });
});
