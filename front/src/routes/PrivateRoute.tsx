import { Navigate, useLocation, useNavigate } from "react-router-dom";
import auth from "../services/auth";
import rolesPath from "../utils/roles";
import api from "../services/api";

const PrivateRoute = ({ children }: any) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  function getPathUser(role: any) {
    const array: string[] = [];
    rolesPath.forEach((elem) => {
      if (elem.role.includes(role)) {
        array.push(elem.path);
      }
    });
    return array;
  }

  async function check() {
    const role = auth.getRole();
    try {
      const response = await api.get(`auth/checkRole/${role}`);
      if (response.data !== true) {
        auth?.logout()?.then(() => {
          navigate("/login");
        });
      }
    } catch {
      auth?.logout()?.then(() => {
        navigate("/login");
      });
    }
  }

  if (auth.getUser()) check();

  if (auth.getRole()) {
    const allowedRoutes = getPathUser(auth.getRole());

    if (auth.isAuthenticated() && allowedRoutes.includes(pathname)) {
      return children;
    } else if (allowedRoutes.length > 0) {
      return <Navigate to={allowedRoutes[0]} replace />;
    } else {
      auth?.logout()?.then(() => {
        navigate("/login");
      });
    }
  } else {
    return <Navigate to="/" replace />;
  }

  return <Navigate to="/" replace />;
};

export default PrivateRoute;
