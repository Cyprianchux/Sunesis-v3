import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("../../../components/workspace-guard", () => ({
  WorkspaceGuard: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));
const { saveTopics } = vi.hoisted(() => ({ saveTopics: vi.fn() }));
vi.mock("../../../lib/storage", () => ({
  getCurrentUser: () => "learner",
  getSlides: () => [],
  getTopics: () => [],
  saveSlides: vi.fn(),
  saveTopics,
}));
import AdminPage from "../../../app/(workspace)/slide-admin/page";

describe("AdminPage", () => {
  it("creates a topic", async () => {
    render(<AdminPage />);
    fireEvent.change(screen.getByPlaceholderText("e.g. Pharmacology Basics"), {
      target: { value: "Biology" },
    });
    fireEvent.click(screen.getByRole("button", { name: "+ Create topic" }));
    await waitFor(() =>
      expect(screen.getByRole("heading", { level: 3, name: "Biology" })).toBeInTheDocument(),
    );
    expect(saveTopics).toHaveBeenCalled();
  });
});
