import { stitches } from "../../../styles/stitches.config";
import { Image } from "react-bootstrap";

export const Span = stitches.styled("span", {
  fontSize: "1rem",
  paddingBottom: "6px",
  marginX: "$32",
  color: "$text",
});

export const SpanLogin = stitches.styled("span", {
  fontSize: "1rem",
  paddingX: "$8",
  fontWeight: "bold",
  textTransform: "uppercase",
  marginRight: "$32",
});

export const ImageWithBorder = stitches.styled(Image, {
  border: "1px solid $borderClr",
});
