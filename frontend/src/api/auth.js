import api from "./axios.js";

export const loginUser = async ({ email, password }) => {
  const { data } = await api.post("/auth/login", {
    email,
    password,
  });

  return data;
};

export const registerUser = async (data) => {
  const { user } = await api.post("/auth/register", data);

  return user;
};

export const refreshUser = async () => {
  const { data } = await api.post("/auth/refresh");

  return data;
};

export const logoutUser = async () => {
  await api.post("/auth/logout");
};
