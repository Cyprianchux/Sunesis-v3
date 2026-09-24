import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({ useSearchParams: () => new URLSearchParams("token=valid") }));
import ResetPasswordPage from "../../../app/reset-password/page";

describe("ResetPasswordPage", () => {
  it("confirms a valid matching password", async () => {
    render(<ResetPasswordPage />);
    fireEvent.change(await screen.findByPlaceholderText("New password"), {
      target: { value: "Learning1" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm password"), {
      target: { value: "Learning1" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Reset password →" }));
    expect(screen.getByRole("heading", { name: "Password reset" })).toBeInTheDocument();
  });
});
