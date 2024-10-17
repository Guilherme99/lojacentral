import React, { useState } from "react";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import * as Yup from "yup";
import { Button } from "../../components/Button";
import { FormContainer, Label, SpanPoppinsBold } from "./styles";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import auth from "../../services/auth";
import { useDispatch } from "react-redux";
import * as usersActions from "../../actions/users";

const validationSchema = Yup.object({
  email: Yup.string().email("Email inválido").required("Email é obrigatório"),
  password: Yup.string()
    .min(6, "Senha deve ter pelo menos 6 caracteres")
    .required("Senha é obrigatória"),
});

const Login: React.FC = () => {
  const navigation = useNavigate();
  const dispatch = useDispatch();

  const [validated, setValidated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      setValidated(true);
      return;
    }

    try {
      await validationSchema.validate({ email, password });

      const response = await api.post("/auth/login", {
        email: email.toLowerCase(),
        senha: password,
      });

      if (response.status === 200) {
        const { data } = response;
        login(data);
      } else {
        console.log("erro ao logar");
      }
    } catch (e: any) {
      return e;
    }
  };

  const login = (data: any) => {
    const authData = {
      ...data,
      current_role: data.roles[0],
    };

    auth.login(authData);
    auth.getToken();
    dispatch(usersActions.userActive(true));
    dispatch(usersActions.setUser(authData));
    navigation("/home");
  };

  return (
    <FormContainer>
      <SpanPoppinsBold> Login</SpanPoppinsBold>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Form.Group as={Col} controlId="formEmail">
          <Label>E-mail</Label>
          <InputGroup hasValidation>
            <Form.Control
              type="email"
              style={{ width: "400px" }} // Define largura máxima
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              isInvalid={validated && !email}
              required
            />
            <Form.Control.Feedback type="invalid">
              Por favor, insira um e-mail válido.
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>
        <Form.Group as={Col} controlId="formPassword">
          <Label>Senha</Label>
          <InputGroup hasValidation>
            <Form.Control
              type="password"
              style={{ width: "400px" }} // Define largura máxima
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              isInvalid={validated && password.length < 6}
              required
            />
            <Form.Control.Feedback type="invalid">
              A senha deve ter pelo menos 6 caracteres.
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>
        <Button type="submit">Entrar</Button>
      </Form>
    </FormContainer>
  );
};

export default Login;
