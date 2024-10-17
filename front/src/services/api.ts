/* eslint-disable no-unused-vars */
import axios from "axios";
import auth from "./auth";
import { useToast } from "./../contexts/ToastContext"; // Verifique o caminho correto

const api = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL,
  headers: {
    Accept: "*/*",
    "Content-Type": "application/json",
  },
});

// Usar o useToast em um componente funcional
const ApiProvider = ({ children }) => {
  const { showToast } = useToast();

  api.interceptors.request.use(async (config) => {
    const storedAuth = localStorage.getItem(import.meta.env.VITE_APP_AUTH);
    if (storedAuth) {
      const { token } = JSON.parse(storedAuth);
      if (token) {
        config.headers.Authorization = token;
      }
    }
    return config;
  });

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.message.includes("Network Error")) {
        auth.logout();
        showToast("Erro de conexão. Você foi desconectado.", "danger");
      } else if (
        error.response &&
        (error.response.status === 500 ||
          error.response.status === 403 ||
          error.message.includes("Network Error"))
      ) {
        auth.logout();
        showToast("Ocorreu um erro ao processar sua solicitação.", "danger");
      }
      return Promise.reject(error);
    }
  );

  return children;
};

export { ApiProvider };
export default api;
