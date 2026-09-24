import { describe, expect, it } from "vitest";
import RootLayout from "../../../app/layout";

describe("RootLayout", () => {
  it("renders the document shell", () => {
    const tree = RootLayout({ children: <main>Page</main> });
    expect(tree.type).toBe("html");
    expect(tree.props.lang).toBe("en");
    expect(tree.props.children.props.children.props.children).toBe("Page");
  });
});
