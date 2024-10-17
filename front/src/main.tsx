import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { globalStyles as GlobalStyles } from "./styles/global.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {GlobalStyles()}
    <App />
  </StrictMode>
);
