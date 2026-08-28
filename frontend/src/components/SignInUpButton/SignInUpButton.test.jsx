import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import SignInUpButton from "./SignInUpButton.jsx";

describe("SignInUpButton", () => {
  it("renders the Sign In and Sign Up buttons", () => {
    render(
      <SignInUpButton
        isLogin={false}
        isRegister={false}
        onLogin={() => {}}
        onRegister={() => {}}
      />,
    );

    expect(screen.getByRole("button", { name: "Sign In" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign Up" })).toBeInTheDocument();
  });

  it("calls the correct function when each button is clicked", async () => {
    const user = userEvent.setup();
    const onLogin = vi.fn();
    const onRegister = vi.fn();

    render(
      <SignInUpButton
        isLogin={false}
        isRegister={false}
        onLogin={onLogin}
        onRegister={onRegister}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Sign In" }));
    await user.click(screen.getByRole("button", { name: "Sign Up" }));

    expect(onLogin).toHaveBeenCalledTimes(1);
    expect(onRegister).toHaveBeenCalledTimes(1);
  });
});
