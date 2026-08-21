import api from "./axios.js";

export const loginUser = async ({ email, password }) => {
  const { data } = await api.post("/auth/login", {
    email,
    password,
  });

  return data;
};

export const registerUser = async ({ name, email, password, avatar }) => {
  const formData = new FormData();

  formData.append("name", name);
  formData.append("email", email);
  formData.append("password", password);

  if (avatar) {
    formData.append("avatar", avatar);
  }

  const { data } = await api.post("/auth/register", formData);

  return data;
};

export const refreshUser = async () => {
  const { data } = await api.post("/auth/refresh");

  return data;
};

export const logoutUser = async () => {
  await api.post("/auth/logout");
};
