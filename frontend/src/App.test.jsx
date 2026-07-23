import { render, screen } from "@testing-library/react";
import { beforeEach, expect, test } from "vitest";
import App from "./App";

beforeEach(() => {
  sessionStorage.clear();
});

test("shows the sign-in screen when there is no active session", () => {
  render(<App />);
  expect(screen.getByRole("heading", { name: "InventoryPro" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Sign in" })).toBeInTheDocument();
});
