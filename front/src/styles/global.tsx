import { stitches } from "./stitches.config";

export const globalStyles = stitches.globalCss({
  "@import": [
    "url('https://fonts.googleapis.com/css2?family=Roboto:wght@300&display=swap')",
  ],
  "*": {
    margin: 0,
    padding: 0,
    outline: 0,
    boxSizing: "border-box",
    fontFamily: "'Roboto', sans-serif", // Adicione a fonte aqui
  },
  body: {
    background: "$background",
    color: "$text",
  },
  ".modal-dialog": {
    maxWidth: "90vw",
  },
});
