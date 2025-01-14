import { useEffect, useState } from "react";
import { Form, Image } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link, useLocation } from "react-router-dom";
import Logo from "../../../assets/images/logo.jpg";
import { ThemeContext } from "../../../providers/ThemeProvider";
import { Span, SpanLogin } from "./styles";
import auth from "../../../services/auth"; // Importando o auth

function NavBar() {
  const location = useLocation();
  const [activeItem, setActiveItem] = useState<string>();

  const menuItems = [];

  // Adicionando a opção "Home" condicionalmente
  if (!auth.isAuthenticated()) {
    menuItems.unshift({ text: "Login", path: "/login" });
  }
  if (auth.isAuthenticated()) {
    menuItems.unshift({ text: "Home", path: "/home" }); // Adiciona "Home" no início do array se autenticado
  }

  useEffect(() => {
    if (location) {
      setActiveItem(location.pathname);
    }
  }, [location]);

  const handleItemClick = (path: string) => {
    setActiveItem(path);
  };

  return (
    <ThemeContext.Consumer>
      {(context) => (
        <Navbar
          collapseOnSelect
          expand="lg"
          variant={context.theme.type}
          style={{ gridArea: "nav", boxShadow: "2px 2px 10px 1px #EF8D21" }}
        >
          <Container>
            <Navbar.Brand as={Link} to={"/"}>
              {/* <Image src={Logo} roundedCircle width={100} /> */}
              <SpanLogin>SINTRAF</SpanLogin>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="flex-fill justify-content-center">
                {/* 
                <Nav.Link href="#pricing">Projects</Nav.Link>
                <Nav.Link href="#pricing">Contacts</Nav.Link>
                */}
              </Nav>
              <Nav className="align-items-center">
                {menuItems.map(({ text, path }) => (
                  <Span
                    key={text}
                    as={Link}
                    to={path}
                    onClick={() => handleItemClick(path)}
                    style={{
                      borderBottom:
                        activeItem === path ? "2px solid #EF8D21" : "none",
                      textDecoration: "none",
                    }}
                  >
                    {text}
                  </Span>
                ))}
                {auth.isAuthenticated() && (
                  <Span
                    as={Link}
                    to="#"
                    style={{
                      borderBottom: "none",
                      textDecoration: "none",
                    }}
                    key={"logout"}
                    onClick={() => auth.logout()}
                  >
                    Logout
                  </Span>
                )}
                <Form.Check
                  type="switch"
                  checked={context.theme.type !== "light"}
                  onChange={context.toggleTheme}
                />
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      )}
    </ThemeContext.Consumer>
  );
}

export default NavBar;
