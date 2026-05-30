// ============================================================
// ARCHIVO: src/pages/Login and Register/LoginPage.tsx
// Cambios: reemplaza el setError inline por alertaErrorDeAutenticacion
// y agrega alertaLoginExitoso antes de llamar al callback.
// Todo lo demás queda exactamente igual.
// ============================================================

import { useState } from "react";

import {
  alertaLoginExitoso,
  alertaErrorDeAutenticacion,
} from "../../utils/sweetAlerts";

import "./AuthPage.css";

type PropiedadesDeLoginPage = {
  alIniciarSesion: (email: string) => void;
  alIrARegistro: () => void;
};

function LoginPage({ alIniciarSesion, alIrARegistro }: PropiedadesDeLoginPage) {
  const [email,       setEmail]       = useState("");
  const [password,    setPassword]    = useState("");
  const [verPassword, setVerPassword] = useState(false);
  const [cargando,    setCargando]    = useState(false);

  // ── Error eliminado: ahora lo muestra SweetAlert2 ──

  async function manejarEnvio(e: React.FormEvent) {
    e.preventDefault();

    // Validaciones locales — ahora van a SweetAlert2
    if (!email.trim()) {
      await alertaErrorDeAutenticacion("El email es obligatorio.");
      return;
    }
    if (!password.trim()) {
      await alertaErrorDeAutenticacion("La contraseña es obligatoria.");
      return;
    }

    setCargando(true);

    try {
      // ── AQUÍ irá: await authService.login(email, password)
      // Simulamos delay de red por ahora
      await new Promise((r) => setTimeout(r, 800));

      // Popup de bienvenida con SweetAlert2 antes de navegar
      await alertaLoginExitoso(email);

      alIniciarSesion(email);
    } catch (_error) {
      await alertaErrorDeAutenticacion(
        "No se pudo iniciar sesión. Verificá tus datos."
      );
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="auth-layout">

      {/* Panel izquierdo — decorativo (sin cambios) */}
      <div className="auth-layout__panel">
        <div className="auth-layout__panel-logo">
          <div className="auth-layout__logo-icono">M</div>
          <span className="auth-layout__logo-texto">Mitake</span>
        </div>
        <div className="auth-layout__panel-tagline">
          <h1>Organizá tu trabajo,<br />enfocate en lo que importa.</h1>
          <p>Gestión de tareas con Kanban, seguimiento de progreso y notificaciones en tiempo real.</p>
        </div>
        <div className="auth-layout__panel-dots">
          <div className="auth-layout__dot auth-layout__dot--purple" />
          <div className="auth-layout__dot auth-layout__dot--blue" />
          <div className="auth-layout__dot auth-layout__dot--green" />
        </div>
      </div>

      {/* Panel derecho — formulario */}
      <div className="auth-layout__form-wrap">
        <form className="auth-form" onSubmit={manejarEnvio} noValidate>

          <div className="auth-form__encabezado">
            <h2 className="auth-form__titulo">Bienvenido de vuelta</h2>
            <p className="auth-form__subtitulo">Ingresá a tu cuenta para continuar</p>
          </div>

          {/* Email */}
          <div className="auth-campo">
            <label className="auth-campo__etiqueta" htmlFor="login-email">Email</label>
            <div className="auth-campo__input-wrap">
              <input
                id="login-email"
                type="email"
                placeholder="escribe tu correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                autoFocus
              />
            </div>
          </div>

          {/* Password */}
          <div className="auth-campo">
            <div className="auth-campo__label-fila">
              <label className="auth-campo__etiqueta" htmlFor="login-password">
                Contraseña
              </label>
              <button type="button" className="auth-campo__link">
                ¿Olvidaste tu contraseña?
              </button>
            </div>
            <div className="auth-campo__input-wrap">
              <input
                id="login-password"
                type={verPassword ? "text" : "password"}
                placeholder="contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="auth-campo__toggle-pass"
                onClick={() => setVerPassword((v) => !v)}
                tabIndex={-1}
                aria-label={verPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {verPassword ? "👁" : "👁"}
              </button>
            </div>
          </div>

          {/* ── El bloque de error inline fue eliminado
               Ahora SweetAlert2 muestra los errores en popup ── */}

          {/* Submit */}
          <button
            type="submit"
            className={`auth-form__btn-primario ${cargando ? "auth-form__btn-primario--cargando" : ""}`}
            disabled={cargando}
          >
            {cargando ? <span className="auth-form__spinner" /> : "Ingresar"}
          </button>

          {/* Separador */}
          <div className="auth-form__separador">
            <span>o continuá con</span>
          </div>

          {/* Google — placeholder visual */}
          <button type="button" className="auth-form__btn-google">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
              <path d="M3.964 10.707A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.96L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            Continuar con Google
          </button>

          {/* Link a registro */}
          <p className="auth-form__footer">
            ¿No tenés cuenta?{" "}
            <button
              type="button"
              className="auth-form__link"
              onClick={alIrARegistro}
            >
              Registrate gratis
            </button>
          </p>

        </form>
      </div>

    </div>
  );
}

export default LoginPage;