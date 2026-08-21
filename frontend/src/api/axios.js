import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api",
  withCredentials: true,
});

let refreshPromise = null;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;

    if (response?.status !== 401 || config._retry || config.url === "/auth/refresh") {
      return Promise.reject(error);
    }

    config._retry = true;

    try {
      refreshPromise ??= api.post("/auth/refresh").finally(() => {
        refreshPromise = null;
      });
      await refreshPromise;

      return api(config);
    } catch (refreshError) {
      return Promise.reject(refreshError);
    }
  },
);

export default api;