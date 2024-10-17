import { stitches } from "../../styles/stitches.config";
import Form from "react-bootstrap/Form";

export const FormContainer = stitches.styled("div", {
  width: "80%", // Largura máxima
  margin: "5% auto", // Centraliza o container
  height: "100%", // Centraliza o container
  padding: "20px", // Espaçamento interno
  border: "1px solid #ddd", // Borda
  borderRadius: "8px", // Cantos arredondados
  backgroundColor: "#f9f9f9", // Cor de fundo
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)", // Sombra
  display: "flex", // Flexbox para alinhar conteúdo
  flexDirection: "column", // Direção do flex
  alignItems: "center", // Centraliza itens no eixo transversal
});

export const Label = stitches.styled(Form.Label, {
  color: "$secondaryTextColor !important",
});

export const Menu = stitches.styled("div", {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "calc(52.5vh - 120px)",
});

export const MenuItem = stitches.styled("div", {
  width: "150px",
  height: "150px",
  margin: "0 10px",
  padding: "15px 12px 5px",
  textAlign: "center",
  borderRadius: "10px",
  backgroundColor: "$bg",
  border: "2px solid $borderClr",
  transition: "all 200ms ease-in-out",

  a: {
    display: "block",
    width: "100%",
    height: "100%",
    textDecoration: "none",

    ".icon": {
      margin: "10px auto",
      fontSize: "4em",
      color: "$borderClr",
    },

    span: {
      display: "block",
      fontSize: "16px",
      fontWeight: 900,
      lineHeight: "20px",
      color: "$text",
      transition: "all 200ms ease-in-out",
      marginLeft: 0, // O "!important" não é suportado, mas você pode ajustar o estilo aqui
    },

    p: {
      display: "block",
      fontSize: "16px",
      fontWeight: 900,
      lineHeight: "20px",
      color: "$text",
      transition: "all 200ms ease-in-out",
      marginLeft: 0,
    },
  },

  // Estilo para hover
  "&:hover": {
    backgroundColor: "$borderClr",

    span: {
      color: "#fff",
    },
    p: {
      color: "#fff",
    },
    a: {
      // Estilos que se aplicam ao link quando o item é hover
      ".icon": {
        color: "#fff", // Muda a cor da icon para branco
      },
    },
  },
});
