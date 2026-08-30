import { screen, waitFor } from "@testing-library/react";
import { Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import { renderWithProviders } from "../test/renderWithProviders.jsx";
import PrivateRoute from "./PrivateRoute.jsx";

const renderPrivateRoute = (isLoggedIn, openModal = vi.fn()) =>
  renderWithProviders(
    <Routes>
      <Route path="/" element={<p>Home page</p>} />
      <Route
        path="/recipe/add"
        element={<PrivateRoute component={<p>Private page</p>} openModal={openModal} />}
      />
    </Routes>,
    { route: "/recipe/add", preloadedState: { auth: { isLoggedIn } } },
  );

describe("PrivateRoute", () => {
  it("renders the protected component for an authenticated user", () => {
    renderPrivateRoute(true);

    expect(screen.getByText("Private page")).toBeInTheDocument();
  });

  it("opens login with the requested path and redirects a guest", async () => {
    const openModal = vi.fn();
    renderPrivateRoute(false, openModal);

    await waitFor(() => {
      expect(openModal).toHaveBeenCalledWith("/recipe/add");
    });
    expect(screen.getByText("Home page")).toBeInTheDocument();
  });
});
