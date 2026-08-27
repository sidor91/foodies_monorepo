import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { renderWithRouter } from "../../test/renderWithProviders.jsx";
import App from "./App.jsx";

const mocks = vi.hoisted(() => ({
  dispatch: vi.fn(),
  refreshUser: vi.fn(),
  logOut: vi.fn(),
  logoutUnwrap: vi.fn(),
  toastError: vi.fn(),
  actions: {
    refresh: { type: "test/refreshUser" },
    logout: { type: "test/logOut" },
  },
}));

vi.mock("react-redux", () => ({
  useDispatch: () => mocks.dispatch,
}));

vi.mock("../../../redux/auth/authOps.js", () => ({
  refreshUser: mocks.refreshUser,
  logOut: mocks.logOut,
}));

vi.mock("react-hot-toast", () => ({
  Toaster: () => null,
  toast: { error: mocks.toastError },
}));

vi.mock("../index.js", () => ({
  Header: ({ onMobileToggle, onLogin, onRegister, onLogout }) => (
    <header>
      <button type="button" onClick={onMobileToggle}>
        Toggle mobile menu
      </button>
      <button type="button" onClick={onLogin}>
        Open login
      </button>
      <button type="button" onClick={onRegister}>
        Open register
      </button>
      <button type="button" onClick={onLogout}>
        Open logout
      </button>
    </header>
  ),
  MobileMenu: ({ isMobileMenuOpen }) => (
    <p>{isMobileMenuOpen ? "Mobile menu open" : "Mobile menu closed"}</p>
  ),
  LoginForm: ({ isLogin, onRegister }) =>
    isLogin ? (
      <section>
        <p>Login modal open</p>
        <button type="button" onClick={onRegister}>
          Go to register
        </button>
      </section>
    ) : null,
  RegisterForm: ({ isRegister }) =>
    isRegister ? <p>Register modal open</p> : null,
  Loader: () => <div role="status">Loading page</div>,
  Footer: () => <footer>Footer</footer>,
}));

vi.mock("../LogoutModal/LogoutModal.jsx", () => ({
  default: ({ isLogout, onLogoutToggle, onLogout }) =>
    isLogout ? (
      <section>
        <p>Logout modal open</p>
        <button type="button" onClick={onLogoutToggle}>
          Cancel logout
        </button>
        <button type="button" onClick={onLogout}>
          Confirm logout
        </button>
      </section>
    ) : null,
}));

vi.mock("../../pages/Home/Home.jsx", () => ({
  default: () => <p>Home page</p>,
}));

vi.mock("../../pages/AddRecipe/AddRecipe.jsx", () => ({
  default: () => <p>Add recipe page</p>,
}));

vi.mock("../../pages/UserProfile/UserProfile.jsx", () => ({
  default: () => <p>User profile page</p>,
}));

vi.mock("../../pages/NotFound/NotFound.jsx", () => ({
  default: () => <p>Not found page</p>,
}));

describe("App", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.refreshUser.mockReturnValue(mocks.actions.refresh);
    mocks.logOut.mockReturnValue(mocks.actions.logout);
    mocks.logoutUnwrap.mockResolvedValue(undefined);
    mocks.dispatch.mockImplementation((action) => {
      if (action === mocks.actions.logout) {
        return { unwrap: mocks.logoutUnwrap };
      }

      return action;
    });
  });

  it("refreshes the user and renders the current route", async () => {
    renderWithRouter(<App />);

    expect(mocks.refreshUser).toHaveBeenCalledOnce();
    expect(mocks.dispatch).toHaveBeenCalledWith(mocks.actions.refresh);
    expect(await screen.findByText("Home page")).toBeInTheDocument();
    expect(screen.getByText("Footer")).toBeInTheDocument();
  });

  it("opens and closes the mobile menu", async () => {
    const user = userEvent.setup();
    renderWithRouter(<App />);

    expect(screen.getByText("Mobile menu closed")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Toggle mobile menu" }));
    expect(screen.getByText("Mobile menu open")).toBeInTheDocument();
    expect(screen.getByRole("main")).toHaveAttribute("inert", "");

    await user.click(screen.getByRole("button", { name: "Toggle mobile menu" }));
    expect(screen.getByText("Mobile menu closed")).toBeInTheDocument();
  });

  it("switches from the login modal to the register modal", async () => {
    const user = userEvent.setup();
    renderWithRouter(<App />);

    await user.click(screen.getByRole("button", { name: "Open login" }));
    expect(screen.getByText("Login modal open")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Go to register" }));

    expect(screen.queryByText("Login modal open")).not.toBeInTheDocument();
    expect(screen.getByText("Register modal open")).toBeInTheDocument();
  });

  it("logs out and closes the logout modal", async () => {
    const user = userEvent.setup();
    renderWithRouter(<App />);

    await user.click(screen.getByRole("button", { name: "Open logout" }));
    expect(screen.getByText("Logout modal open")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Confirm logout" }));

    await waitFor(() => {
      expect(mocks.logOut).toHaveBeenCalledOnce();
      expect(mocks.logoutUnwrap).toHaveBeenCalledOnce();
      expect(screen.queryByText("Logout modal open")).not.toBeInTheDocument();
    });
  });

  it("renders the not-found route", async () => {
    renderWithRouter(<App />, { route: "/missing" });

    expect(await screen.findByText("Not found page")).toBeInTheDocument();
  });
});
