/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Loading } from "../../components/Loading";
import { Styles, GlobalLogin } from "./styles";
import useWindowSize from "../../hooks/useWindowSize";

const LoginLayout: React.FC = () => {
  const sizeWindow: any = useWindowSize();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sizeWindow) {
      setLoading(false);
    }
  }, [sizeWindow, setLoading]);

  return (
    <Loading loading={loading}>
      <Styles>
        <GlobalLogin heightLogin={sizeWindow.height}>
          <Outlet />
        </GlobalLogin>
      </Styles>
    </Loading>
  );
};

export default LoginLayout;
