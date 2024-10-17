import React from "react";
import { Col } from "react-bootstrap";
import {
  Container,
  RowWithBg,
  Span,
  SpanPoppins,
  SpanPoppinsBold,
  SpanPoppinsOrange,
  Text,
} from "./styles";

const Landing: React.FC = () => {
  return (
    <RowWithBg>
      <Col className="d-flex align-items-center justify-content-center">
        <Container>
          <SpanPoppins>Personalize os</SpanPoppins>
          <SpanPoppinsBold>
            seus mimos <SpanPoppinsOrange>Grátis</SpanPoppinsOrange>
          </SpanPoppinsBold>
          <Text>
            Através do nosso site, ofertamos várias opções para você, cliente,
            escolher os seus mimos de aniversário. Teste agora mesmo,{" "}
            <Span>clicando aqui!</Span>
          </Text>
        </Container>
      </Col>
      <Col md={6}></Col>
    </RowWithBg>
  );
};

export default Landing;
