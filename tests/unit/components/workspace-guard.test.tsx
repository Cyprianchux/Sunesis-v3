import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const { replace, getCurrentUser } = vi.hoisted(() => ({
  replace: vi.fn(),
  getCurrentUser: vi.fn(),
}));

vi.mock("next/navigation", () => ({ useRouter: () => ({ replace }) }));
vi.mock("../../../lib/storage", () => ({ getCurrentUser }));

import { WorkspaceGuard } from "../../../components/workspace-guard";

describe("WorkspaceGuard", () => {
  it("renders children for an authenticated user", async () => {
    getCurrentUser.mockReturnValue("learner");
    render(<WorkspaceGuard>Workspace</WorkspaceGuard>);
    await waitFor(() => expect(screen.getByText("Workspace")).toBeInTheDocument());
    expect(replace).not.toHaveBeenCalled();
  });

  it("redirects unauthenticated users", async () => {
    getCurrentUser.mockReturnValue(null);
    render(<WorkspaceGuard>Workspace</WorkspaceGuard>);
    await waitFor(() => expect(replace).toHaveBeenCalledWith("/"));
  });
});
