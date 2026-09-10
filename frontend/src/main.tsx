import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@flaticon/flaticon-uicons/css/all/all.css";
import "./styles.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
