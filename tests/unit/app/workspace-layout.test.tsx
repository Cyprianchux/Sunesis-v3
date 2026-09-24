import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("../../../components/app-header", () => ({
  AppHeader: () => <header>Header</header>,
}));
import WorkspaceLayout from "../../../app/(workspace)/layout";

describe("WorkspaceLayout", () => {
  it("renders the header and workspace content", () => {
    render(
      <WorkspaceLayout>
        <p>Content</p>
      </WorkspaceLayout>,
    );
    expect(screen.getByText("Header")).toBeInTheDocument();
    expect(screen.getByText("Content")).toBeInTheDocument();
  });
});
