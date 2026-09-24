import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("../../../components/workspace-guard", () => ({
  WorkspaceGuard: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));
vi.mock("../../../lib/storage", () => ({
  getTopics: () => [{ name: "Science", creator: "learner", createdAt: "2026-01-01" }],
  getSlides: () => [
    { id: "1", topic: "Science", title: "Plants", description: "They grow.", creator: "learner" },
  ],
}));
import SlideViewPage from "../../../app/(workspace)/slide-view/page";

describe("SlideViewPage", () => {
  it("shows the first stored slide before a topic is chosen", async () => {
    render(<SlideViewPage />);
    await waitFor(() =>
      expect(screen.getByRole("heading", { name: "Plants" })).toBeInTheDocument(),
    );
    expect(screen.getByRole("heading", { name: "Slide view" })).toBeInTheDocument();
  });
});
