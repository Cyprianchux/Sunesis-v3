import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("../../../components/auth-card", () => ({
  AuthCard: () => <div>Authentication form</div>,
}));

import Home from "../../../app/page";

describe("Home page", () => {
  it("renders the hero and scrolls to authentication", () => {
    render(<Home />);
    expect(
      screen.getByRole("heading", { name: "Turn information into understanding." }),
    ).toBeInTheDocument();
    const authSection = document.getElementById("auth-section")!;
    authSection.scrollIntoView = () => undefined;
    fireEvent.click(screen.getByRole("button", { name: "Get started →" }));
    expect(screen.getByText("Authentication form")).toBeInTheDocument();
  });
});
