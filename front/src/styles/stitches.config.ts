// stitches.config.ts
import { createStitches, ScaleValue } from "@stitches/react";

const convertToRem = (value: number) => `${value / 16}rem`;
const space = {
  4: convertToRem(4),
  8: convertToRem(8),
  12: convertToRem(12),
  16: convertToRem(16),
  20: convertToRem(20),
  24: convertToRem(24),
  28: convertToRem(28),
  32: convertToRem(32),
  36: convertToRem(36),
  40: convertToRem(40),
};

export const stitches = createStitches({
  prefix: "coders",
  theme: {
    colors: {
      white: "#fff",
      bg: "#FFFCF9",
      black: "#000",

      gray: "#f8f9fa",
      gray100: "#e1e1e6",
      gray300: "#c4c4cc",
      gray400: "#8d8d99",
      gray600: "#323238",
      gray700: "#29292e",
      gray800: "#202024",
      gray900: "#121214",

      green300: "#00b37e",
      green500: "#00875f",

      red900: "#f75a68",

      background: "$bg",
      text: "$black",
      secondaryTextColor: "$black",
      shape: "#181818",

      "text-default": "#ffffff",
      "text-highlight": "#ff2758",

      "button-primary-bg": "#5496FF",
      "button-primary-text": "#ffffff",
      "button-secondary-bg": "transparent",
      "button-secondary-text": "#ffffff",

      borderClr: "#EF8D21",
    },
    radii: {
      default: "0px",
      pill: "99999999px",
    },
    space,
    sizes: space,
    fontSizes: {
      1: "12px",
      2: "14px",
      3: "16px",
      4: "49px",
      5: "70px",
      6: "32px",
    },
  },
  media: {
    bp1: "(min-width: 480px)",
    bp2: "(min-width: 576px)",
    bp3: "(min-width: 768px)",
    bp4: "(min-width: 992px)",
    bp5: "(min-width: 1200px)",
    bp6: "(min-width: 1400px)",
    bp7: "(min-width: 2400px)",
  },
  utils: {
    marginX: (value: ScaleValue<"space">) => ({
      marginLeft: value,
      marginRight: value,
    }),
    marginY: (value: ScaleValue<"space">) => ({
      marginTop: value,
      marginBottom: value,
    }),
    paddingX: (value: ScaleValue<"space">) => ({
      paddingLeft: value,
      paddingRight: value,
    }),
    paddingY: (value: ScaleValue<"space">) => ({
      paddingTop: value,
      paddingBottom: value,
    }),
  },
});

export const darkTheme = stitches.createTheme({
  colors: {
    "button-primary-bg": "#333333",
    background: "$gray900",
    text: "$white",
    secondaryTextColor: "$black",
  },
});
