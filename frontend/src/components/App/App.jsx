import { Route, Routes } from "react-router-dom";
import { lazy, useState } from "react";

import { Header, MobileMenu, Loader, Footer } from "../index.js";

import css from "./App.module.css";

// Тут вставляйте посилання на сторінки. Це приклад
// const Home = lazy(() => import("../pages/Home/Home.jsx"));

const App = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = userState(false);

  const handleMobileToggle = () => {
    setIsMobileOpen(!isMobileOpen);
  };
  return (
    <div className={`main__container ${isMobileOpen && "modal__open"}`}>
      <Header
        isMobileMenuOpen={isMobileOpen}
        onMobileToggle={handleMobileToggle}
      />

      <MobileMenu
        isMobileMenuOpen={isMobileOpen}
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
