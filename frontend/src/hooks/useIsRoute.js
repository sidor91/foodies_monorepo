import { useLocation } from "react-router-dom";

const useIsRoute = (paths) => {
  const { pathname } = useLocation();

  const pathsArray = Array.isArray(paths) ? paths : [paths];

  return pathsArray.some((path) => pathname === path || pathname.startsWith(`${path}/`));
};

export default useIsRoute;
