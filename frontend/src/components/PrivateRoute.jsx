import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { selectIsLoggedIn } from "../../redux/auth/authSelectors.js";
import { useEffect } from "react";

const PrivateRoute = ({ component: Component, openModal }) => {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const location = useLocation();

  useEffect(() => {
    if (!isLoggedIn) {
      openModal(location.pathname);
    }
  }, [isLoggedIn, openModal, location.pathname]);

  return isLoggedIn ? Component : <Navigate to="/" />;
};

export default PrivateRoute;
