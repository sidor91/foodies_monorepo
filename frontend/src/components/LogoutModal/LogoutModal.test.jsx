import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import LogoutModal from "./LogoutModal.jsx";

const renderLogoutModal = (isLogout = true) => {
  const onLogoutToggle = vi.fn();
  const onLogout = vi.fn();

  render(
    <LogoutModal
      isLogout={isLogout}
      onLogoutToggle={onLogoutToggle}
      onLogout={onLogout}
    />,
  );

  return { onLogoutToggle, onLogout };
};

describe("LogoutModal", () => {
  it("renders the modal action buttons", () => {
    renderLogoutModal();

    expect(screen.getByRole("button", { name: "Close Modal" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Log Out" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });

  it("calls onLogout when the Log Out button is clicked", async () => {
    const user = userEvent.setup();
    const { onLogout } = renderLogoutModal();

    await user.click(screen.getByRole("button", { name: "Log Out" }));

    expect(onLogout).toHaveBeenCalledOnce();
  });

  it("calls onLogoutToggle when the Cancel button is clicked", async () => {
    const user = userEvent.setup();
    const { onLogoutToggle } = renderLogoutModal();

    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(onLogoutToggle).toHaveBeenCalledOnce();
  });

  it("calls onLogoutToggle when the close button is clicked", async () => {
    const user = userEvent.setup();
    const { onLogoutToggle } = renderLogoutModal();

    await user.click(screen.getByRole("button", { name: "Close Modal" }));

    expect(onLogoutToggle).toHaveBeenCalledOnce();
  });

  it("calls onLogoutToggle when Escape is pressed while the modal is open", async () => {
    const user = userEvent.setup();
    const { onLogoutToggle } = renderLogoutModal(true);

    await user.keyboard("{Escape}");

    expect(onLogoutToggle).toHaveBeenCalledOnce();
  });
});
