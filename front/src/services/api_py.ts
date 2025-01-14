import axios from "axios";
import auth from "./auth";

const api_py = axios.create({
  baseURL: import.meta.env.VITE_APP_PY_BASE_URL,
  headers: {
    Accept: "*/*",
    "Content-Type": "application/json",
  },
});

api_py.interceptors.request.use(async (config) => {
  const storedAuth = localStorage.getItem(import.meta.env.VITE_APP_AUTH);
  if (storedAuth) {
    const { access_token } = JSON.parse(storedAuth);
    if (access_token) {
      config.headers.Authorization = access_token;
    }
  }
  return config;
});

api_py.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.message.includes("Network Error")) {
      auth.logout();
    } else if (
      error.response &&
      (error.response.status === 500 ||
        error.response.status === 403 ||
        error.message.includes("Network Error"))
    ) {
      auth.logout();
    }
    return Promise.reject(error);
  }
);

export default api_py;
