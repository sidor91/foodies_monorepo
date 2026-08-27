import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { renderWithProviders } from "../../test/renderWithProviders.jsx";
import RegisterForm from "./RegisterForm.jsx";

const { registerMock, unwrapMock } = vi.hoisted(() => ({
  registerMock: vi.fn(),
  unwrapMock: vi.fn(),
}));

vi.mock("../../../redux/auth/authOps", () => ({
  register: registerMock,
}));

const renderRegisterForm = (props = {}) => {
  return renderWithProviders(
    <RegisterForm isRegister onRegister={() => {}} onLogin={() => {}} {...props} />,
  );
};

describe("RegisterForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    unwrapMock.mockResolvedValue({ id: "user-1" });
    registerMock.mockImplementation(() => () => ({ unwrap: unwrapMock }));
  });

  it("renders the registration fields with a disabled submit button", () => {
    renderRegisterForm();

    expect(screen.getByPlaceholderText("Name*")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email*")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password*")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Submit SignIn" })).toBeDisabled();
  });

  it("shows and hides the password", async () => {
    const user = userEvent.setup();
    renderRegisterForm();

    const password = screen.getByPlaceholderText("Password*");
    await user.click(screen.getByRole("button", { name: "Show password" }));

    expect(password).toHaveAttribute("type", "text");

    await user.click(screen.getByRole("button", { name: "Hide password" }));

    expect(password).toHaveAttribute("type", "password");
  });

  it("calls onRegister when Escape is pressed", async () => {
    const user = userEvent.setup();
    const onRegister = vi.fn();
    renderRegisterForm({ onRegister });

    await user.keyboard("{Escape}");

    expect(onRegister).toHaveBeenCalledOnce();
  });

  it("calls onLogin from the sign-in button", async () => {
    const user = userEvent.setup();
    const onLogin = vi.fn();
    renderRegisterForm({ onLogin });

    await user.click(screen.getByRole("button", { name: "Open SignIn" }));

    expect(onLogin).toHaveBeenCalledOnce();
  });

  it("shows a validation error for a short name", async () => {
    const user = userEvent.setup();
    renderRegisterForm();

    await user.type(screen.getByPlaceholderText("Name*"), "Al");
    await user.type(screen.getByPlaceholderText("Email*"), "al@example.com");
    await user.type(screen.getByPlaceholderText("Password*"), "123456");
    await user.click(screen.getByRole("button", { name: "Submit SignIn" }));

    expect(await screen.findByText("too short")).toBeInTheDocument();
  });

  it("dispatches register with entered user data", async () => {
    const user = userEvent.setup();
    renderRegisterForm();

    await user.type(screen.getByPlaceholderText("Name*"), "Anna");
    await user.type(screen.getByPlaceholderText("Email*"), "anna@example.com");
    await user.type(screen.getByPlaceholderText("Password*"), "password123");
    await user.click(screen.getByRole("button", { name: "Submit SignIn" }));

    await waitFor(() => {
      expect(registerMock).toHaveBeenCalledWith({
        name: "Anna",
        email: "anna@example.com",
        password: "password123",
      });
    });
    expect(unwrapMock).toHaveBeenCalledOnce();
  });
});
