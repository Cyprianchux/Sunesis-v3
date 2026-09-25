import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const { push, logout } = vi.hoisted(() => ({
  push: vi.fn(),
  logout: vi.fn(),
}));
vi.mock("next/navigation", () => ({
  usePathname: () => "/account",
  useRouter: () => ({ push, replace: vi.fn() }),
}));
vi.mock("../../../lib/storage", () => ({
  getSlides: () => [],
  getTopics: () => [],
  logout,
}));

import { AppHeader } from "../../../components/app-header";

describe("AppHeader", () => {
  it("opens mobile navigation and logs out", () => {
    render(<AppHeader searchPlaceholder="Find content" />);
    fireEvent.click(screen.getByRole("button", { name: "Open navigation" }));
    expect(screen.getByRole("link", { name: "Slides" })).toBeVisible();
    expect(screen.getByPlaceholderText("Find content")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Logout" }));
    expect(logout).toHaveBeenCalledOnce();
    expect(push).toHaveBeenCalledWith("/");
  });
});
