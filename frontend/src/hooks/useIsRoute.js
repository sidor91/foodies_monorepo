import { useLocation } from "react-router-dom";

const useIsRoute = (path) => {
  const { pathname } = useLocation();
  if (path === "/") {
    return pathname === path;
  }
  const rootPathName = pathname.split("/")[1];
  const routePath = path.split("/")[1];

  return rootPathName === routePath;
};

export default useIsRoute;
