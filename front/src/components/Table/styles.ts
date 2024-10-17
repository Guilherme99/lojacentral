import { stitches } from "../../styles/stitches.config";

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

  h3: {
    marginBottom: "20px", // Espaçamento inferior para o título
    color: "#333", // Cor do texto
  },

  // Estilos adicionais (opcional)
  "& > *": {
    width: "100%", // Todos os filhos ocupam 100% da largura
  },
});

export const ContainerHeader = stitches.styled("div", {
  display: "flex", // Flexbox para alinhar conteúdo
  flexDirection: "row", // Direção do flex
  justifyContent: "space-between",
  alignItems: "center", // Centraliza itens no eixo transversal

  h3: {
    margin: "auto 0",
  },
});
