import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { renderWithRouter } from "../../test/renderWithProviders.jsx";
import LogoutModal from "./LogoutModal.jsx";

const renderLogoutModal = (isLogout = true, route = "/profile") => {
  const onLogoutToggle = vi.fn();
  const onLogout = vi.fn();

  renderWithRouter(
    <LogoutModal isLogout={isLogout} onLogoutToggle={onLogoutToggle} onLogout={onLogout} />,
    { route },
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

  it("passes the current pathname to onLogout", async () => {
    const user = userEvent.setup();
    const { onLogout } = renderLogoutModal(true, "/user/user-1");

    await user.click(screen.getByRole("button", { name: "Log Out" }));

    expect(onLogout).toHaveBeenCalledOnce();
    expect(onLogout).toHaveBeenCalledWith("/user/user-1");
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
