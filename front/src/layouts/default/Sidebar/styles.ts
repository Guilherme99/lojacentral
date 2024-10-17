import { stitches } from "../../../styles/stitches.config";

export const Styles = stitches.styled("div", {
  gridArea: "side",
  background: "$backgroud",
  borderRadius: "8px",
  overflow: "hidden",
  minHeight: "Calc(100vh - 12vh)",
  width: "250px",
  "-webkit-box-shadow": "0px 0px 2px 2px purple",
  "-moz-box-shadow": "0px 0px 2px 2px purple",
  boxShadow: "0px 0px 2px 2px purple",

  ".cover": {
    width: "100%",
    height: "72px",
    objectFit: "cover",
  },

  ".profile": {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: "calc(0px - 1.5rem - 6px)",

    strong: {
      marginTop: "1rem",
      color: "$text",
      lineHeight: "1.6",
    },

    span: {
      fontSize: "0.875rem",
      color: "$gray400",
      lineHeight: "1.6",
    },
  },

  ".avatar": {
    width: "calc(3rem + 12px)",
    height: "calc(3rem + 12px)",
    borderRadius: "8px",
    border: "4px solid $gray800",
    outline: "2px solid $green500",
  },

  ".footer": {
    borderTop: "1px solid $gray600",
    marginTop: " 1.5rem",
    padding: "1.5rem 2rem 2rem",

    a: {
      width: "100%",
      backgroundColor: "transparent",
      color: "$green500",
      border: "1px solid $green500",
      borderRadius: "8px",
      height: "50px",
      padding: "0 1.5rem",
      fontWeight: "bold",
      display: "block",
      textDecoration: "none",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.5rem",
      transition: "color 0.1s, background 0.1s",

      "&:hover": {
        background: "$green500",
        color: "$white",
      },
    },
  },
});
