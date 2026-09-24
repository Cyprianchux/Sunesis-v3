import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({ useSearchParams: () => new URLSearchParams("token=valid") }));
import VerifyEmailPage from "../../../app/verify-email/page";

describe("VerifyEmailPage", () => {
  it("shows the verified state when a token exists", async () => {
    render(<VerifyEmailPage />);
    expect(await screen.findByRole("heading", { name: "Email verified" })).toBeInTheDocument();
  });
});
