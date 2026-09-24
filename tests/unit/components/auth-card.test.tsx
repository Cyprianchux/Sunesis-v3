import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const push = vi.fn();
const users: Record<string, unknown> = {};
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));
vi.mock("../../../lib/storage", () => ({
  getUsers: () => users,
  hashPassword: async (value: string) => `hash:${value}`,
  saveUser: (user: { username: string }) => {
    users[user.username] = user;
  },
  setCurrentUser: vi.fn(),
}));

import { AuthCard } from "../../../components/auth-card";

describe("AuthCard", () => {
  beforeEach(() => {
    push.mockClear();
    Object.keys(users).forEach((key) => delete users[key]);
  });

  it("reports invalid forgot-password email", () => {
    render(<AuthCard />);
    fireEvent.click(screen.getByRole("button", { name: "Forgot password?" }));
    fireEvent.click(screen.getByRole("button", { name: "Send reset link →" }));
    expect(screen.getByText("Please provide a valid email address.")).toBeInTheDocument();
  });

  it("registers a valid user and navigates to the account page", async () => {
    render(<AuthCard />);
    fireEvent.click(screen.getByRole("button", { name: "Register" }));
    fireEvent.change(screen.getByPlaceholderText("Enter your username"), {
      target: { value: "Learner" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter your email"), {
      target: { value: "learner@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Create a password"), {
      target: { value: "Learning1" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm password"), {
      target: { value: "Learning1" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Create account →" }));
    await waitFor(() => expect(push).toHaveBeenCalledWith("/account"));
  });
});
