// ============================================================
// ARCHIVO: src/components/layout/Sidebar/Sidebar.tsx
// ¿Para qué sirve? Menú lateral con navegación completa.
// Ahora incluye ítems de Papelera y About.
// ============================================================

import "./Sidebar.css";

// ------------------------------------------------------------
// INTERFAZ: PropiedadesDeSidebar
// ------------------------------------------------------------
interface PropiedadesDeSidebar {
  seccionActiva: string;
  alCambiarSeccion: (seccion: string) => void;
  cantidadEnPapelera?: number; // Para mostrar el badge con la cantidad
}

// ------------------------------------------------------------
// CONFIGURACIÓN: ítems del menú principal
// ------------------------------------------------------------
const itemsDelMenuPrincipal = [
  { identificador: "dashboard",    etiqueta: "Dashboard",    icono: "⊞" },
  { identificador: "mis-tareas",   etiqueta: "Mis tareas",   icono: "✓" },
  { identificador: "tickets",      etiqueta: "Tickets",      icono: "◈" },
  { identificador: "estadisticas", etiqueta: "Estadísticas", icono: "↗" },
  { identificador: "calendario",   etiqueta: "Calendario",   icono: "▦" },
];

// ------------------------------------------------------------
// COMPONENTE: Sidebar
// ------------------------------------------------------------
function Sidebar({
  seccionActiva,
  alCambiarSeccion,
  cantidadEnPapelera = 0,
}: PropiedadesDeSidebar) {
  return (
    <aside className="sidebar">

      {/* Logo */}
      <div className="sidebar__logo">
        <div className="sidebar__logo-icono">M</div>
        <div className="sidebar__logo-texto-grupo">
          <span className="sidebar__logo-nombre">Mitake</span>
          <span className="sidebar__logo-version">v1.0</span>
        </div>
      </div>

      {/* Menú principal */}
      <nav className="sidebar__navegacion">
        <p className="sidebar__seccion-titulo">Menú principal</p>
        {itemsDelMenuPrincipal.map((itemActual) => (
          <button
            key={itemActual.identificador}
            className={`sidebar__item ${
              seccionActiva === itemActual.identificador
                ? "sidebar__item--activo"
                : ""
            }`}
            onClick={() => alCambiarSeccion(itemActual.identificador)}
          >
            <span className="sidebar__item-icono">{itemActual.icono}</span>
            <span className="sidebar__item-etiqueta">{itemActual.etiqueta}</span>
            {seccionActiva === itemActual.identificador && (
              <span className="sidebar__item-indicador"></span>
            )}
          </button>
        ))}
      </nav>

      {/* Sección inferior */}
      <div className="sidebar__navegacion sidebar__navegacion--inferior">
        <p className="sidebar__seccion-titulo">Sistema</p>

        {/* Papelera con badge de cantidad */}
        <button
          className={`sidebar__item ${
            seccionActiva === "papelera" ? "sidebar__item--activo" : ""
          }`}
          onClick={() => alCambiarSeccion("papelera")}
        >
          <span className="sidebar__item-icono">🗑</span>
          <span className="sidebar__item-etiqueta">Papelera</span>
          {cantidadEnPapelera > 0 && (
            <span className="sidebar__badge">{cantidadEnPapelera}</span>
          )}
        </button>

        {/* About */}
        <button
          className={`sidebar__item ${
            seccionActiva === "about" ? "sidebar__item--activo" : ""
          }`}
          onClick={() => alCambiarSeccion("about")}
        >
          <span className="sidebar__item-icono">◎</span>
          <span className="sidebar__item-etiqueta">Sobre Mitake</span>
        </button>
      </div>

      {/* Pie con info del usuario */}
      <div className="sidebar__pie">
        <div className="sidebar__usuario">
          <div className="sidebar__usuario-avatar">U</div>
          <div className="sidebar__usuario-info">
            <span className="sidebar__usuario-nombre">Usuario</span>
            <span className="sidebar__usuario-rol">Desarrollador</span>
          </div>
        </div>
      </div>

    </aside>
  );
}

export default Sidebar;