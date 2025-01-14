/* eslint-disable no-unused-vars */
import axios from "axios";
import auth from "./auth";
import { useToast } from "./../contexts/ToastContext"; // Verifique o caminho correto

const AUTH = import.meta.env.VITE_APP_AUTH;

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
      const { access_token } = JSON.parse(storedAuth);
      if (access_token) {
        config.headers.Authorization = access_token;
      }
    }
    return config;
  });

  api.interceptors.response.use(
    (response) => response,
    async (error) => {

      const originalRequest = error.config;

      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          // Chama o endpoint de refresh token
          const response = await axios.post(import.meta.env.VITE_APP_BASE_URL+'/auth/refresh', null, {
            headers: {
              "Refresh-Token": auth.getRefreshToken(),
              "Authorization": auth.getToken(),
            }
          });

          const storage = JSON.parse(localStorage.getItem(AUTH) as any);
          const authData = {
            ...storage,
            access_token: response.data.access_token,
            refresh_token: response.data.refresh_token,
          };
      
          auth.login(authData);

          // Atualiza o header Authorization
          api.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.accessToken;
  
          return api(originalRequest);
        } catch (refreshError) {
          auth.logout();
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }


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
