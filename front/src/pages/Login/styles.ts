import { stitches } from "../../styles/stitches.config";
import Form from "react-bootstrap/Form";

export const FormContainer = stitches.styled("div", {
  backgroundColor: "white",
  borderRadius: "8px",
  padding: "40px",
  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "500px",
  justifyContent: "center",
  margin: "15% auto",
});

export const SpanPoppinsBold = stitches.styled("span", {
  fontWeight: "bold",
  fontSize: "$6",
  color: "#364547",
});

export const Label = stitches.styled(Form.Label, {
  color: "$secondaryTextColor !important",
});
