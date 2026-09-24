import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Footer } from "../../../components/footer";

describe("Footer", () => {
  it("renders grouped resource links and copyright", () => {
    render(<Footer />);
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Privacy Policy" })).toHaveAttribute(
      "href",
      "/footer-pages?page=privacy-policy",
    );
    expect(screen.getByText("© 2026 Sunesis. All rights reserved.")).toBeInTheDocument();
  });
});
