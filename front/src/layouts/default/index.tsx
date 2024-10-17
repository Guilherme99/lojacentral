import { FC } from "react";
import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";
import { Styles } from "./styles";

export const DefaultLayout: FC = () => {
  return (
    <Styles>
      <NavBar />
      <main>
        {/* <Sidebar /> */}
        <Outlet />
      </main>
    </Styles>
  );
};
