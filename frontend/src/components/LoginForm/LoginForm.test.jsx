import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { renderWithProviders } from "../../test/renderWithProviders.jsx";
import LoginForm from "./LoginForm.jsx";

const { logInMock, refreshUserMock, unwrapMock } = vi.hoisted(() => ({
  logInMock: vi.fn(),
  refreshUserMock: vi.fn(),
  unwrapMock: vi.fn(),
}));

vi.mock("../../../redux/auth/authOps", () => ({
  logIn: logInMock,
  refreshUser: refreshUserMock,
}));

const renderLoginForm = (props = {}) => {
  return renderWithProviders(
    <LoginForm isLogin onLogin={() => {}} onRegister={() => {}} {...props} />,
  );
};

describe("LoginForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    unwrapMock.mockResolvedValue({ id: "user-1" });
    logInMock.mockImplementation(() => () => ({ unwrap: unwrapMock }));
    refreshUserMock.mockReturnValue({ type: "test/refreshUser" });
  });

  it("renders the login fields with a disabled submit button", () => {
    renderLoginForm();

    expect(screen.getByPlaceholderText("Email*")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password*")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Submit SignIn" })).toBeDisabled();
  });

  it("shows and hides the password", async () => {
    const user = userEvent.setup();
    renderLoginForm();

    const password = screen.getByPlaceholderText("Password*");
    await user.click(screen.getByRole("button", { name: "Show password" }));

    expect(password).toHaveAttribute("type", "text");

    await user.click(screen.getByRole("button", { name: "Hide password" }));

    expect(password).toHaveAttribute("type", "password");
  });

  it("calls onLogin when Escape is pressed", async () => {
    const user = userEvent.setup();
    const onLogin = vi.fn();
    renderLoginForm({ onLogin });

    await user.keyboard("{Escape}");

    expect(onLogin).toHaveBeenCalledOnce();
  });

  it("calls onRegister from the create-account button", async () => {
    const user = userEvent.setup();
    const onRegister = vi.fn();
    renderLoginForm({ onRegister });

    await user.click(screen.getByRole("button", { name: "Open SignUp" }));

    expect(onRegister).toHaveBeenCalledOnce();
  });

  it("dispatches logIn with entered credentials", async () => {
    const user = userEvent.setup();
    const onLogin = vi.fn();
    const onLoginSuccess = vi.fn();
    renderLoginForm({ onLogin, onLoginSuccess });

    await user.type(screen.getByPlaceholderText("Email*"), "anna@example.com");
    await user.type(screen.getByPlaceholderText("Password*"), "password123");
    await user.click(screen.getByRole("button", { name: "Submit SignIn" }));

    await waitFor(() => {
      expect(logInMock).toHaveBeenCalledWith({
        email: "anna@example.com",
        password: "password123",
      });
    });
    expect(unwrapMock).toHaveBeenCalledOnce();
    expect(refreshUserMock).toHaveBeenCalledOnce();
    expect(onLoginSuccess).toHaveBeenCalledOnce();
    expect(onLogin).toHaveBeenCalledOnce();
    expect(unwrapMock.mock.invocationCallOrder[0]).toBeLessThan(
      refreshUserMock.mock.invocationCallOrder[0],
    );
    expect(refreshUserMock.mock.invocationCallOrder[0]).toBeLessThan(
      onLoginSuccess.mock.invocationCallOrder[0],
    );
    expect(onLoginSuccess.mock.invocationCallOrder[0]).toBeLessThan(
      onLogin.mock.invocationCallOrder[0],
    );
  });
});
