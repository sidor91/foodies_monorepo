import { Route, Routes } from "react-router-dom";
import { lazy, Suspense, useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";

import { Header, MobileMenu, Loader, Footer, LoginForm, RegisterForm } from "../index.js";
import { logoutUser } from "../../api/auth";
import { getCurrentUser } from "../../api/users.js";

import css from "./App.module.css";

const Home = lazy(() => import("../../pages/Home/Home.jsx"));
const AddRecipe = lazy(() => import("../../pages/AddRecipe/AddRecipe.jsx"));
const UserProfile = lazy(() => import("../../pages/UserProfile/UserProfile.jsx"));

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  const handleAuthSuccess = (user) => {
    setUser(user);
    setIsAuthenticated(true);
    setIsLogin(false);
    setIsRegister(false);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    const restoreSession = async () => {
      try {
        if (user) {
          setIsAuthenticated(true);
          return;
        }

        const currentUser = await getCurrentUser();

        setUser(currentUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.log(error.message);
      } finally {
        setIsAuthLoading(false);
      }
    };

    restoreSession();
  }, [user]);

  const handleMobileToggle = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const handleLoginToggle = () => {
    setIsLogin((prev) => !prev);
    setIsRegister(false);
  };

  const handleRegisterToggle = () => {
    setIsRegister((prev) => !prev);
    setIsLogin(false);
  };
  return (
    <div className={`main__container ${isMobileMenuOpen && "modal__open"}`}>
      <Toaster />

      <Header
        isMobileMenuOpen={isMobileMenuOpen}
        onMobileToggle={handleMobileToggle}
        isLogin={isLogin}
        isRegister={isRegister}
        onLogin={handleLoginToggle}
        onRegister={handleRegisterToggle}
        isAuthenticated={isAuthenticated}
        user={user}
        isAuthLoading={isAuthLoading}
        onLogout={handleLogout}
      />

      <MobileMenu isMobileMenuOpen={isMobileMenuOpen} onMobileToggle={handleMobileToggle} />
      <LoginForm
        isLogin={isLogin}
        onLogin={handleLoginToggle}
        onRegister={handleRegisterToggle}
        onAuthSuccess={handleAuthSuccess}
      />
      <RegisterForm
        isRegister={isRegister}
        onRegister={handleRegisterToggle}
        onLogin={handleLoginToggle}
        onAuthSuccess={handleAuthSuccess}
      />

      <main className={css.content} inert={isMobileMenuOpen ? "" : undefined}>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/recipe/add" element={<AddRecipe />} />
            {/* <Route path="/add-recipe" element={<AddRecipe />} /> */}
            <Route path="/profile" element={<UserProfile />} />
          </Routes>
        </Suspense>
      </main>

      <Footer />
    </div>
  );
};

export default App;
