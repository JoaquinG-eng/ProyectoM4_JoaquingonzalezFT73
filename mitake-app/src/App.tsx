 import { useState } from "react";
 import { AlertProvider } from "./context/AlertContext";

 import { useAuth } from "./hooks/useAuth";
 import { cerrarSesionDelUsuario } from "./services/authService";

 import LoginPage from "./pages/Login and Register/LoginPage";
 import RegisterPage  from "./pages/Login and Register/RegisterPage";
 import DashboardPage from "./pages/dashboard/DashboardPage";

 function App() {
  const { usuarioActual, estaVerificandoSesion } = useAuth();
  const [vistaDeAuth, setVistaDeAuth] = useState<"login" | "registro">("login");

  if (estaVerificandoSesion) {
    return (
      <div style={{
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        height: "100vh", backgroundColor: "#13111a",
        color: "rgba(255,255,255,0.4)", fontFamily: "sans-serif",
        gap: "16px",
      }}>
        <div style={{
          width: "36px", height: "36px",
          border: "3px solid rgba(124,90,246,0.3)",
          borderTop: "3px solid #7c5af6",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ margin: 0, fontSize: "14px" }}>Cargando...</p>
      </div>
    );
  }

  if (!usuarioActual) {
    return (
      <AlertProvider>
        {vistaDeAuth === "login" ? (
          <LoginPage
            alIniciarSesion={() => {}}
            alIrARegistro={() => setVistaDeAuth("registro")}
          />
        ) : (
          <RegisterPage
            alRegistrarse={() => {}}
            alIrALogin={() => setVistaDeAuth("login")}
          />
        )}
      </AlertProvider>
    );
  }


return (
  <AlertProvider>
    <DashboardPage
      alLogout={cerrarSesionDelUsuario}
      uid={usuarioActual.uid}  
    />
  </AlertProvider>
);
}
export default App;