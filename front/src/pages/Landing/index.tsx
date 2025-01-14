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
          <SpanPoppins>Gerencie os seus</SpanPoppins>
          <SpanPoppinsBold>
            documentos com a
            <SpanPoppinsOrange> nossa plataforma</SpanPoppinsOrange>
          </SpanPoppinsBold>
          <Text>
            Através do nosso site, ofertamos o gerenciamento dos seus documentos
            e de seus cliente. Teste agora mesmo, <Span>clicando aqui!</Span>
          </Text>
        </Container>
      </Col>
      <Col md={6}></Col>
    </RowWithBg>
  );
};

export default Landing;
