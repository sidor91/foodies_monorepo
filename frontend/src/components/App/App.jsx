import { Route, Routes } from "react-router-dom";
import { lazy, Suspense, useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { useDispatch } from "react-redux";

import { Header, MobileMenu, Loader, Footer, LoginForm, RegisterForm } from "../index.js";

import { logOut, refreshUser } from "../../../redux/auth/authOps.js";

import css from "./App.module.css";
import LogoutModal from "../LogoutModal/LogoutModal.jsx";

const Home = lazy(() => import("../../pages/Home/Home.jsx"));
const AddRecipe = lazy(() => import("../../pages/AddRecipe/AddRecipe.jsx"));
const UserProfile = lazy(() => import("../../pages/UserProfile/UserProfile.jsx"));
const NotFound = lazy(() => import("../../pages/NotFound/NotFound.jsx"));

const App = () => {
  const dispatch = useDispatch();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [isLogout, setIsLogout] = useState(false);

  useEffect(() => {
    dispatch(refreshUser());
  }, [dispatch]);

  const handleLogout = async () => {
    try {
      await dispatch(logOut()).unwrap();
      setIsLogout(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
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

  const handleLogoutToggle = () => {
    setIsLogout((prev) => !prev);
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
        onLogout={handleLogoutToggle}
      />

      <MobileMenu isMobileMenuOpen={isMobileMenuOpen} onMobileToggle={handleMobileToggle} />
      <LoginForm isLogin={isLogin} onLogin={handleLoginToggle} onRegister={handleRegisterToggle} />
      <RegisterForm
        isRegister={isRegister}
        onRegister={handleRegisterToggle}
        onLogin={handleLoginToggle}
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
            <Route path="/recipe/add" element={<AddRecipe />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>

      <Footer />
    </div>
  );
};

export default App;
