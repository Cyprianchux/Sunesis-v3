import { describe, expect, it } from "vitest";
import { cn, emailPattern, makeId } from "../../lib/utils";

describe("utility helpers", () => {
  it("joins only truthy class names", () => {
    expect(cn("card", false, undefined, "active", null)).toBe("card active");
  });

  it("validates standard email addresses", () => {
    expect(emailPattern.test("learner@example.com")).toBe(true);
    expect(emailPattern.test("not-an-email")).toBe(false);
  });

  it("creates an id with a timestamp and random suffix", () => {
    expect(makeId()).toMatch(/^\d+-[a-z0-9]{6}$/);
  });
});
