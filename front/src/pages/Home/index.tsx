/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import * as Icons from "react-icons/fa";
import { Link } from "react-router-dom";
import { FormContainer, Menu, MenuItem } from "./styles";
const Home: React.FC = () => {
  const menuOptions = [
    {
      id: "solicitation",
      link: "/solicitations",
      icon: <Icons.FaUser className="icon" />,
      title: "Solicitações",
    },
    {
      id: "management",
      link: "/files",
      icon: <Icons.FaFileUpload className="icon" />,
      title: "Arquivos",
    },
  ];

  return (
    <FormContainer>
      <Menu>
        {menuOptions?.map((option: any) => (
          <MenuItem
            key={option?.id}
            className="option"
            onClick={() => (option?.func ? option?.func() : null)}
          >
            <Link to={option?.func ? "#" : option?.link} id={`${option?.id}`}>
              {option?.icon}
              <p>{option?.title}</p>
            </Link>
          </MenuItem>
        ))}
      </Menu>
    </FormContainer>
  );
};

export default Home;
