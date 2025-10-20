import React from "react";
import { createRoot } from "react-dom/client";
import SympaLanding from "./App"; // ton composant export default

const container = document.getElementById("root");
if (!container) {
  throw new Error('Element #root introuvable dans public/index.html');
}

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <SympaLanding />
  </React.StrictMode>
);
