import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("../../../components/workspace-guard", () => ({
  WorkspaceGuard: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));
vi.mock("../../../lib/storage", () => ({
  getCurrentUser: () => "learner",
  getTopics: () => [],
  getSlides: () => [],
}));
import AccountPage from "../../../app/(workspace)/account/page";

describe("AccountPage", () => {
  it("greets the current user and shows an empty library", async () => {
    render(<AccountPage />);
    await waitFor(() =>
      expect(screen.getByRole("heading", { name: "Welcome, learner" })).toBeInTheDocument(),
    );
    expect(
      screen.getByText("Your knowledge base is ready for its first topic."),
    ).toBeInTheDocument();
  });
});
