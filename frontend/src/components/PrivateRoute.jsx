import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { selectIsLoggedIn } from "../../redux/auth/authSelectors.js";
import { useEffect } from "react";

const PrivateRoute = ({ component: Component, openModal }) => {
  const isLoggedIn = useSelector(selectIsLoggedIn);

  useEffect(() => {
    if (!isLoggedIn) {
      openModal();
    }
  }, [isLoggedIn, openModal]);

  return isLoggedIn ? Component : <Navigate to="/" />;
};

export default PrivateRoute;
