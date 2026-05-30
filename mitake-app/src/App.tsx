// ============================================================
// ARCHIVO: src/App.tsx
//
// Manejo de rutas con estado local mientras no hay Firebase.
// Cuando conectes Firebase:
//   1. Reemplazá `usuarioActual` con el hook useAuth()
//   2. Reemplazá las funciones de callback con authService
//   3. El ProtectedRoute ya está preparado en src/routes/
// ============================================================

import { useState } from "react";
import { AlertProvider } from "./context/AlertContext";

import LoginPage    from "./pages/Login and Register/LoginPage";
import RegisterPage from "./pages/Login and Register/RegisterPage";
import DashboardPage from "./pages/dashboard/DashboardPage";

// Tres pantallas posibles
type Vista = "login" | "registro" | "dashboard";

function App() {
  const [vista,          setVista]          = useState<Vista>("login");
  const [usuarioActual,  setUsuarioActual]  = useState<string | null>(null);

  function manejarLogin(email: string) {
    setUsuarioActual(email);
    setVista("dashboard");
  }

  function manejarRegistro(email: string) {
    setUsuarioActual(email);
    setVista("dashboard");
  }

  function manejarLogout() {
    setUsuarioActual(null);
    setVista("login");
  }

  return (
    <AlertProvider>
      {vista === "login" && (
        <LoginPage
          alIniciarSesion={manejarLogin}
          alIrARegistro={() => setVista("registro")}
        />
      )}

      {vista === "registro" && (
        <RegisterPage
          alRegistrarse={manejarRegistro}
          alIrALogin={() => setVista("login")}
        />
      )}

      {vista === "dashboard" && usuarioActual && (
        // TODO: pasar alLogout al Sidebar/Topbar cuando conectes Firebase
        <DashboardPage />
      )}
    </AlertProvider>
  );
}

export default App;