import { Route, Routes } from "react-router-dom";
import { lazy, Suspense, useState } from "react";

import { Header, MobileMenu, Loader, Footer } from "../index.js";

import css from "./App.module.css";

const Home = lazy(() => import("../../pages/Home/Home.jsx"));
const AddRecipe = lazy(() => import("../../pages/AddRecipe/AddRecipe.jsx"));
const LoginForm = lazy(() => import("../../pages/LoginForm/LoginForm.jsx"));
const RegisterForm = lazy(() => import("../../pages/RegisterForm/RegisterForm.jsx"));

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  const handleAuthSuccess = (user) => {
    setUser(user);
    setIsAuthenticated(true);
    setIsLogin(false);
    setIsRegister(false);
  }

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
      <Header
        isMobileMenuOpen={isMobileMenuOpen}
        onMobileToggle={handleMobileToggle}
        isLogin={isLogin}
        isRegister={isRegister}
        onLogin={handleLoginToggle}
        onRegister={handleRegisterToggle}
        isAuthenticated={isAuthenticated}
        user={user}
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
            <Route path="/add-recipe" element={<AddRecipe />} />
          </Routes>
        </Suspense>
      </main>

      <Footer />
    </div>
  );
};

export default App;
