import api from "./api";

const AUTH = import.meta.env.VITE_APP_AUTH;

const auth = {
  getRefreshToken() {
    if (localStorage.getItem(AUTH)) {
      const { refresh_token } = JSON.parse(localStorage.getItem(AUTH) as any);
      return refresh_token;
    }
    return false;
  },
  getRole() {
    if (localStorage.getItem(AUTH)) {
      const { current_role } = JSON.parse(localStorage.getItem(AUTH) as any);
      return current_role;
    }
    return false;
  },
  getUser() {
    if (localStorage.getItem(AUTH)) {
      const { roles } = JSON.parse(localStorage.getItem(AUTH) as any);
      return roles;
    }
    return false;
  },
  isAuthenticated() {
    if (localStorage.getItem(AUTH) !== null) return true;

    return false;
  },
  login(authData: any) {
    localStorage.setItem(AUTH, JSON.stringify(authData));
  },
  getToken() {
    const { access_token } = JSON.parse(localStorage.getItem(AUTH) as any);
    return access_token;
  },
  getExternalId() {
    const { external_id } = JSON.parse(localStorage.getItem(AUTH) as any);
    return external_id;
  },
  logout() {
    const storage = JSON.parse(localStorage.getItem(AUTH) as any);

    if (storage) {
      localStorage.removeItem(AUTH);
      return api.delete("/auth/logout", {
        headers: {
          Authorization: storage?.access_token,
          "Refresh-Token": storage?.refresh_token,
        },
      });
    }
  },
};

export default auth;
