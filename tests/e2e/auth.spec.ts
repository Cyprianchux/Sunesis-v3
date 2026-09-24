import { expect, test } from "@playwright/test";

test("landing page exposes the authentication flow", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "Turn information into understanding." }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();

  await page.getByRole("button", { name: "Forgot password?" }).click();
  await expect(page.getByRole("heading", { name: "Reset your password" })).toBeVisible();
  await page.getByRole("button", { name: "Send reset link →" }).click();
  await expect(page.getByText("Please provide a valid email address.")).toBeVisible();
});

test("a learner can register and reach the protected account page", async ({ page }) => {
  const username = `e2e-${Date.now()}`;
  await page.goto("/");
  await page.getByRole("button", { name: "Register" }).click();

  await page.getByPlaceholder("Enter your username").fill(username);
  await page.getByPlaceholder("Enter your email").fill(`${username}@example.com`);
  await page.getByPlaceholder("Create a password").fill("Learning1");
  await page.getByPlaceholder("Confirm password").fill("Learning1");
  await page.getByRole("button", { name: "Create account →" }).click();

  await expect(page).toHaveURL(/\/account$/);
  await expect(page.getByRole("heading", { name: `Welcome, ${username}` })).toBeVisible();
  await expect(page.getByText("Your knowledge base is ready for its first topic.")).toBeVisible();
});
