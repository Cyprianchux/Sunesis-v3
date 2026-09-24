import { describe, expect, it } from "vitest";
import { descriptionToHtml, plainTextToRichHtml, sanitizeRichText } from "../../lib/rich-text";

describe("rich text helpers", () => {
  it("escapes plain text and turns hyphen lines into a list", () => {
    expect(plainTextToRichHtml("Intro\n- First\n- Second")).toBe(
      "<div>Intro</div><ul><li>First</li><li>Second</li></ul>",
    );
  });

  it("removes scripts, comments, and event handlers from rich text", () => {
    expect(
      sanitizeRichText('<p onclick="alert(1)">Safe</p><script>alert(2)</script><!-- hidden -->'),
    ).toBe("<p>Safe</p>");
  });

  it("detects markup and sanitizes it, while preserving plain text conversion", () => {
    expect(descriptionToHtml("<strong>Heading</strong>")).toBe("<strong>Heading</strong>");
    expect(descriptionToHtml("Heading")).toBe("<div>Heading</div>");
  });
});
