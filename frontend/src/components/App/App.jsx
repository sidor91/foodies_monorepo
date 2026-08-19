import { Route, Routes } from "react-router-dom";
import { lazy, Suspense, useState } from "react";

import { Header, MobileMenu, Loader, Footer } from "../index.js";

import css from "./App.module.css";

const Home = lazy(() => import("../../pages/Home/Home.jsx"));

const App = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const handleMobileToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  return (
    <div className={`main__container ${isMobileMenuOpen && "modal__open"}`}>
      <Header
        isMobileMenuOpen={isMobileMenuOpen}
        onMobileToggle={handleMobileToggle}
      />

      <MobileMenu
        isMobileMenuOpen={isMobileMenuOpen}
        onMobileToggle={handleMobileToggle}
      />

      <main className={css.content} inert={isMobileMenuOpen ? "" : undefined}>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </Suspense>
      </main>

      <Footer />
    </div>
  );
};

export default App;
