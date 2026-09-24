import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BrandPix } from "../../../components/brand-pix";

describe("BrandPix", () => {
  it("renders its image link", () => {
    render(<BrandPix href="/learn" />);
    expect(screen.getByRole("link")).toHaveAttribute("href", "/learn");
    expect(screen.getByAltText("")).toHaveAttribute("src", "/images/sunesisBG.png");
  });
});
