// ============================================================
// ARCHIVO: src/main.tsx
// ¿Para qué sirve? Punto de entrada de la aplicación.
// AlertProvider vive en App.tsx — acá solo importamos estilos.
// ============================================================

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// SweetAlert2: CSS base + tema Mitake personalizado
import "sweetalert2/dist/sweetalert2.min.css";
import "./styles/sweetalert-mitake.css";

import "./index.css";
import App from "./App.tsx";

// AlertProvider NO va acá — ya está en App.tsx
// Tenerlo en los dos lugares crea dos contextos separados
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);