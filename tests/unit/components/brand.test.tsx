import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Brand } from "../../../components/brand";

describe("Brand", () => {
  it("renders the logo and configurable destination", () => {
    render(<Brand href="/account" />);
    expect(screen.getByRole("link", { name: "sunesis" })).toHaveAttribute("href", "/account");
    expect(screen.getByAltText("")).toHaveAttribute("src", "/images/sunesisIcon.png");
  });
});
