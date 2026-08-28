import { useLocation } from "react-router-dom";

const useIsRoute = (path) => {
  const { pathname } = useLocation();

  const rootPath = `/${pathname.split("/")[1]}`;

  return rootPath === path;
};

export default useIsRoute;
