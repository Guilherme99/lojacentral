import { stitches } from "../../styles/stitches.config";

export const Styles = stitches.styled("div", {
  display: "grid",
  gridTemplateAreas: `
     "nav nav"
     "main main"
     `,
  gridTemplateColumns: "auto 1fr",
  gridTemplateRows: "auto 1fr",
  height: "100%",

  main: {
    gridArea: "main",
    display: "flex",
    flexDirection: "row",
    flexWrap: "inherit",
    width: "100%",
    height: "100%",
    margin: "0 auto",

    "@bp6": {
      maxWidth: "1320px",
    },
  },
});
