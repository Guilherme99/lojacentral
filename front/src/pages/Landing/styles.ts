import { stitches } from "../../styles/stitches.config";
import { Row } from "react-bootstrap";
import BgImage from "../../assets/images/bg.jpg";

export const RowWithBg = stitches.styled(Row, {
  // backgroundImage: `url(${BgImage})`, // Make sure to provide the correct path to your image
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  width: "100vw",
  height: "90vh",
  // backgroundPositionY: "140px",
  backgroundSize: "cover",
  // paddingLeft: "130px",
  margin: 0,
});

export const Container = stitches.styled("div", {
  display: "flex",
  flexDirection: "column",
  lineHeight: "70px",
});

export const SpanPoppins = stitches.styled("span", {
  color: "#364547",
  fontSize: "$4",
});

export const Text = stitches.styled("p", {
  marginY: "$28",
  color: "#364547",
  lineHeight: "30px",
  fontSize: "$3",
});

export const SpanPoppinsBold = stitches.styled("span", {
  fontWeight: "bold",
  fontSize: "$4",
  color: "#364547",
});

export const SpanPoppinsOrange = stitches.styled("span", {
  fontSize: "$4",
  color: "$borderClr",
  fontWeight: "bold",
});

export const Span = stitches.styled("span", {
  color: "$borderClr",
  fontWeight: "bold",
});
