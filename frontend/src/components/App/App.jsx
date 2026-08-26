import { Route, Routes } from "react-router-dom";
import { lazy, Suspense, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Toaster } from "react-hot-toast";

import { Header, MobileMenu, Loader, Footer, LoginForm, RegisterForm } from "../index.js";
import { getCurrentUser } from "../../api/users.js";
import { fetchFavorites } from "../../../redux/favorites/favoritesOps.js";
import { logOut } from "../../../redux/auth/authOps.js";

import css from "./App.module.css";

const Home = lazy(() => import("../../pages/Home/Home.jsx"));
const Recipe = lazy(() => import("../../pages/Recipe/Recipe.jsx"));
const AddRecipe = lazy(() => import("../../pages/AddRecipe/AddRecipe.jsx"));
const UserProfile = lazy(() => import("../../pages/UserProfile/UserProfile.jsx"));

const App = () => {
  const dispatch = useDispatch();
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
      await dispatch(logOut()).unwrap();
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

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchFavorites());
    }
  }, [dispatch, isAuthenticated]);

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
            <Route
              path="/"
              element={
                <Home isAuthenticated={isAuthenticated} onRequireLogin={handleLoginToggle} />
              }
            />
            <Route
              path="/categories/:categorySlug"
              element={
                <Home isAuthenticated={isAuthenticated} onRequireLogin={handleLoginToggle} />
              }
            />
            <Route
              path="/recipes/:recipeSlugId"
              element={
                <Recipe isAuthenticated={isAuthenticated} onRequireLogin={handleLoginToggle} />
              }
            />
            <Route path="/recipe/add" element={<AddRecipe />} />
            <Route path="/profile" element={<UserProfile />} />
          </Routes>
        </Suspense>
      </main>

      <Footer />
    </div>
  );
};

export default App;
