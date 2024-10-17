import { stitches } from "../../styles/stitches.config";

export const Container = stitches.styled("button", {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",

  appearance: "none",
  border: 0,
  cursor: "pointer",

  paddingX: "$28",
  paddingY: "$8",

  marginY: "$20",

  variants: {
    variant: {
      primary: {
        background: "$button-primary-bg",
        color: "$button-primary-text",
      },
      secondary: {
        background: "$button-secondary-bg",
        color: "$button-secondary-text",
        border: "1px solid",
        borderColor: "$gray900",
      },
    },
    pill: {
      true: {
        borderRadius: "$pill",
      },
    },
  },
  defaultVariants: {
    variant: "primary",
  },
});
