import Login from "../pages/Login";
import Landing from "../pages/Landing";
import Home from "../pages/Home";
import Solicitations from "../pages/Solicitations";
import Files from "../pages/Files";
import { Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import { DefaultLayout } from "../layouts/default";

export const RoutesComponent = () => {
  return (
    <Suspense fallback={<h1>Loading..</h1>}>
      <Routes>
        <Route element={<DefaultLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />

          {/* Rotas Privadas */}
          <Route
            path="/home"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/files"
            element={
              <PrivateRoute>
                <Files />
              </PrivateRoute>
            }
          />
          <Route
            path="/solicitations"
            element={
              <PrivateRoute>
                <Solicitations />
              </PrivateRoute>
            }
          />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Suspense>
  );
};
