import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import FooterPage from "../../../app/footer-pages/page";

describe("FooterPage", () => {
  it("renders a known resource", async () => {
    const element = await FooterPage({ searchParams: Promise.resolve({ page: "solutions" }) });
    render(element);
    expect(screen.getByRole("heading", { name: "Solutions" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Back to Sunesis" })).toHaveAttribute("href", "/");
  });
});
