import { Route, Routes } from "react-router-dom";
import { lazy, Suspense, useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

import { Header, MobileMenu, Loader, Footer, LoginForm, RegisterForm } from "../index.js";

import { logOut, refreshUser } from "../../../redux/auth/authOps.js";
import {
  selectIsLoggedIn,
  selectUser,
  selectIsRefreshing,
} from "../../../redux/auth/authSelectors.js";

import css from "./App.module.css";

const Home = lazy(() => import("../../pages/Home/Home.jsx"));
const AddRecipe = lazy(() => import("../../pages/AddRecipe/AddRecipe.jsx"));
const UserProfile = lazy(() => import("../../pages/UserProfile/UserProfile.jsx"));

const App = () => {
  const dispatch = useDispatch();

  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsLoggedIn);
  const isAuthLoading = useSelector(selectIsRefreshing);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  useEffect(() => {
    dispatch(refreshUser());
  }, [dispatch]);

  const handleLogout = async () => {
    dispatch(logOut);
  };

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
      <LoginForm isLogin={isLogin} onLogin={handleLoginToggle} onRegister={handleRegisterToggle} />
      <RegisterForm
        isRegister={isRegister}
        onRegister={handleRegisterToggle}
        onLogin={handleLoginToggle}
      />

      <main className={css.content} inert={isMobileMenuOpen ? "" : undefined}>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<Home />} />
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
