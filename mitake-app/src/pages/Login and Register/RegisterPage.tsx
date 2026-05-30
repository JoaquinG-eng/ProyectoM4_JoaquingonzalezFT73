// ============================================================
// ARCHIVO: src/pages/Login and Register/RegisterPage.tsx
// Cambios: agrega alertaRegistroExitoso antes del callback.
// Los errores por campo siguen siendo inline (mejor UX).
// Todo lo demás queda exactamente igual.
// ============================================================

import { useState } from "react";

import { alertaRegistroExitoso } from "../../utils/sweetAlerts";

import "./AuthPage.css";

type PropiedadesDeRegisterPage = {
  alRegistrarse: (email: string) => void;
  alIrALogin: () => void;
};

function RegisterPage({ alRegistrarse, alIrALogin }: PropiedadesDeRegisterPage) {
  const [nombre,    setNombre]    = useState("");
  const [email,     setEmail]     = useState("");
  const [password,  setPassword]  = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [verPass,   setVerPass]   = useState(false);
  const [cargando,  setCargando]  = useState(false);
  const [errores,   setErrores]   = useState<Record<string, string>>({});

  // ── La validación por campo sigue siendo inline (sin cambios) ──
  function validar(): boolean {
    const nuevosErrores: Record<string, string> = {};
    if (!nombre.trim())        nuevosErrores.nombre    = "El nombre es obligatorio.";
    if (!email.trim())         nuevosErrores.email     = "El email es obligatorio.";
    else if (!/\S+@\S+\.\S+/.test(email)) nuevosErrores.email = "El email no es válido.";
    if (password.length < 6)   nuevosErrores.password  = "Mínimo 6 caracteres.";
    if (password !== confirmar) nuevosErrores.confirmar = "Las contraseñas no coinciden.";
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  }

  async function manejarEnvio(e: React.FormEvent) {
    e.preventDefault();
    if (!validar()) return;

    setCargando(true);

    try {
      // ── AQUÍ irá: await authService.register(email, password, nombre)
      await new Promise((r) => setTimeout(r, 900));

      // Popup de éxito con SweetAlert2 antes de navegar
      await alertaRegistroExitoso(nombre);

      alRegistrarse(email);
    } catch (_error) {
      // Si hay un error de red/servidor lo mostramos inline en el futuro
      setErrores({ general: "No se pudo crear la cuenta. Intentá de nuevo." });
    } finally {
      setCargando(false);
    }
  }

  function fuerzaPassword(): { nivel: number; etiqueta: string; color: string } {
    if (password.length === 0) return { nivel: 0, etiqueta: "",       color: "transparent" };
    if (password.length < 6)   return { nivel: 1, etiqueta: "Débil",  color: "#ef4444" };
    if (password.length < 10)  return { nivel: 2, etiqueta: "Media",  color: "#f59e0b" };
    return                            { nivel: 3, etiqueta: "Fuerte", color: "#10b981" };
  }

  const fuerza = fuerzaPassword();

  return (
    <div className="auth-layout">

      {/* Panel izquierdo (sin cambios) */}
      <div className="auth-layout__panel">
        <div className="auth-layout__panel-logo">
          <div className="auth-layout__logo-icono">M</div>
          <span className="auth-layout__logo-texto">Mitake</span>
        </div>
        <div className="auth-layout__panel-tagline">
          <h1>Empezá a organizar<br />tu trabajo hoy.</h1>
          <p>Creá tu cuenta gratis y accedé a todas las funcionalidades de Mitake desde cualquier dispositivo.</p>
        </div>
        <div className="auth-layout__panel-features">
          {[
            "CRUD completo de tareas",
            "Tablero Kanban visual",
            "Progreso en tiempo real",
            "Notificaciones por email",
          ].map((caracteristica) => (
            <div key={caracteristica} className="auth-layout__feature">
              <span className="auth-layout__feature-check">✓</span>
              <span>{caracteristica}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Formulario */}
      <div className="auth-layout__form-wrap">
        <form className="auth-form" onSubmit={manejarEnvio} noValidate>

          <div className="auth-form__encabezado">
            <h2 className="auth-form__titulo">Crear cuenta</h2>
            <p className="auth-form__subtitulo">Completá tus datos para registrarte</p>
          </div>

          {/* Error general (red/servidor) */}
          {errores.general && (
            <div className="auth-form__error" role="alert">
              <span>⚠</span> {errores.general}
            </div>
          )}

          {/* Nombre */}
          <div className={`auth-campo ${errores.nombre ? "auth-campo--error" : ""}`}>
            <label className="auth-campo__etiqueta" htmlFor="reg-nombre">
              Nombre completo
            </label>
            <div className="auth-campo__input-wrap">
              <span className="auth-campo__icono">✦</span>
              <input
                id="reg-nombre"
                type="text"
                placeholder="Tu nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                autoFocus
              />
            </div>
            {errores.nombre && (
              <p className="auth-campo__error">{errores.nombre}</p>
            )}
          </div>

          {/* Email */}
          <div className={`auth-campo ${errores.email ? "auth-campo--error" : ""}`}>
            <label className="auth-campo__etiqueta" htmlFor="reg-email">
              Email
            </label>
            <div className="auth-campo__input-wrap">
              <input
                id="reg-email"
                type="email"
                placeholder="escribe tu correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {errores.email && (
              <p className="auth-campo__error">{errores.email}</p>
            )}
          </div>

          {/* Password con indicador de fuerza */}
          <div className={`auth-campo ${errores.password ? "auth-campo--error" : ""}`}>
            <label className="auth-campo__etiqueta" htmlFor="reg-password">
              Contraseña
            </label>
            <div className="auth-campo__input-wrap">
              <input
                id="reg-password"
                type={verPass ? "text" : "password"}
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="auth-campo__toggle-pass"
                onClick={() => setVerPass((v) => !v)}
                tabIndex={-1}
              >
                {verPass ? "🙈" : "👁"}
              </button>
            </div>
            {password.length > 0 && (
              <div className="auth-campo__fuerza">
                <div className="auth-campo__fuerza-barras">
                  {[1, 2, 3].map((numero) => (
                    <div
                      key={numero}
                      className="auth-campo__fuerza-barra"
                      style={{
                        background:
                          numero <= fuerza.nivel
                            ? fuerza.color
                            : "rgba(255,255,255,0.08)",
                      }}
                    />
                  ))}
                </div>
                <span style={{ color: fuerza.color }}>{fuerza.etiqueta}</span>
              </div>
            )}
            {errores.password && (
              <p className="auth-campo__error">{errores.password}</p>
            )}
          </div>

          {/* Confirmar password */}
          <div className={`auth-campo ${errores.confirmar ? "auth-campo--error" : ""}`}>
            <label className="auth-campo__etiqueta" htmlFor="reg-confirmar">
              Confirmar contraseña
            </label>
            <div className="auth-campo__input-wrap">
             
              <input
                id="reg-confirmar"
                type={verPass ? "text" : "password"}
                placeholder="Repetí la contraseña"
                value={confirmar}
                onChange={(e) => setConfirmar(e.target.value)}
              />
              {confirmar.length > 0 && (
                <span
                  className="auth-campo__check"
                  style={{ color: confirmar === password ? "#10b981" : "#ef4444" }}
                >
                  {confirmar === password ? "✓" : "✕"}
                </span>
              )}
            </div>
            {errores.confirmar && (
              <p className="auth-campo__error">{errores.confirmar}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className={`auth-form__btn-primario ${cargando ? "auth-form__btn-primario--cargando" : ""}`}
            disabled={cargando}
          >
            {cargando ? <span className="auth-form__spinner" /> : "Crear cuenta"}
          </button>

          {/* Link a login */}
          <p className="auth-form__footer">
            ¿Ya tenés cuenta?{" "}
            <button
              type="button"
              className="auth-form__link"
              onClick={alIrALogin}
            >
              Iniciá sesión
            </button>
          </p>

        </form>
      </div>

    </div>
  );
}

export default RegisterPage;