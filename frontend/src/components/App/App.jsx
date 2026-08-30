import { Route, Routes, useNavigate } from "react-router-dom";
import { lazy, Suspense, useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

import { Header, MobileMenu, Loader, Footer, LoginForm, RegisterForm } from "../index.js";

import { logOut, refreshUser } from "../../../redux/auth/authOps.js";
import { selectIsLoggedIn } from "../../../redux/auth/authSelectors.js";
import { fetchFavorites } from "../../../redux/favorites/favoritesOps.js";

import css from "./App.module.css";
import LogoutModal from "../LogoutModal/LogoutModal.jsx";
import PrivateRoute from "../../components/PrivateRoute.jsx";

const Home = lazy(() => import("../../pages/Home/Home.jsx"));
const Recipe = lazy(() => import("../../pages/Recipe/Recipe.jsx"));
const AddRecipe = lazy(() => import("../../pages/AddRecipe/AddRecipe.jsx"));
const UserProfile = lazy(() => import("../../pages/UserProfile/UserProfile.jsx"));
const NotFound = lazy(() => import("../../pages/NotFound/NotFound.jsx"));

export const privateRoutesList = ["/user", "/recipe/add"];

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isAuthenticated = useSelector(selectIsLoggedIn);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [isLogout, setIsLogout] = useState(false);
  const [pendingRoute, setPendingRoute] = useState(null);

  useEffect(() => {
    dispatch(refreshUser());
  }, [dispatch]);

  const handleLogout = async (pathname) => {
    try {
      // navigate away first so PrivateRoute unmounts before isLoggedIn flips to false
      const isPrivateRoute = privateRoutesList.some((item) => pathname.includes(item));
      if (isPrivateRoute) {
        navigate("/");
      }

      await dispatch(logOut()).unwrap();
      setIsLogout(false);
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

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

  const openLoginModal = (targetRoute) => {
    setPendingRoute(targetRoute);
    setIsLogin(true);
    setIsRegister(false);
  };

  const handleRegisterToggle = () => {
    setIsRegister((prev) => !prev);
    setIsLogin(false);
  };

  const handleLogoutToggle = () => {
    setIsLogout((prev) => !prev);
  };

  const handleAuthSuccess = () => {
    if (pendingRoute) {
      navigate(pendingRoute);
      setPendingRoute(null);
    }
  };

  useEffect(() => {
    if (!isLogin && !isRegister && !isAuthenticated) {
      setPendingRoute(null);
    }
  }, [isLogin, isRegister, isAuthenticated]);

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
        onLogout={handleLogoutToggle}
      />

      <MobileMenu isMobileMenuOpen={isMobileMenuOpen} onMobileToggle={handleMobileToggle} />
      <LoginForm
        isLogin={isLogin}
        onLogin={handleLoginToggle}
        onRegister={handleRegisterToggle}
        onLoginSuccess={handleAuthSuccess}
      />
      <RegisterForm
        isRegister={isRegister}
        onRegister={handleRegisterToggle}
        onLogin={handleLoginToggle}
        onRegisterSuccess={handleAuthSuccess}
      />
      <LogoutModal
        isLogout={isLogout}
        onLogoutToggle={handleLogoutToggle}
        onLogout={handleLogout}
      />

      <main className={css.content} inert={isMobileMenuOpen ? "" : undefined}>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/" element={<Home onRequireLogin={handleLoginToggle} />} />
            <Route
              path="/recipe/add"
              element={<PrivateRoute component={<AddRecipe />} openModal={openLoginModal} />}
            />
            <Route
              path="/categories/:categorySlug"
              element={<Home onRequireLogin={handleLoginToggle} />}
            />
            <Route
              path="/recipes/:recipeSlugId"
              element={<Recipe onRequireLogin={handleLoginToggle} />}
            />
            <Route
              path="/user/:id"
              element={
                <PrivateRoute
                  component={<UserProfile onLogout={handleLogoutToggle} />}
                  openModal={openLoginModal}
                />
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>

      <Footer />
    </div>
  );
};

export default App;
