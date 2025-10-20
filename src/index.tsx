// src/index.tsx
import React from "react";
import { createRoot } from "react-dom/client";
import SympaLanding from "./App"; // ton export default

const container = document.getElementById("root");
if (!container) {
  throw new Error("Element #root introuvable dans public/index.html");
}

createRoot(container).render(
  <React.StrictMode>
    <SympaLanding />
  </React.StrictMode>
);
