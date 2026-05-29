// ============================================================
// ARCHIVO: src/pages/dashboard/DashboardPage.tsx
// ============================================================

import { useState } from "react";

import { useTasks } from "../../hooks/useTasks";
import { useAlert } from "../../hooks/useAlert";

import type { TareaNueva, EstadoTarea, FiltrosDeBusqueda } from "../../types/task";
import { FILTROS_VACIOS } from "../../types/task";

import Sidebar        from "../../components/layout/Sidebar/Sidebar";
import Topbar         from "../../components/layout/Topbar/Topbar";
import TaskForm       from "../../components/tasks/TaskForm/TaskForm";
import KanbanBoard    from "../../components/kanban/KanbanBoard/KanbanBoard";
import StatCard       from "../../components/ui/StatCard/StatCard";
import ActivityFeed   from "../../components/ui/ActivityFeed/ActivityFeed";
import AlertContainer from "../../components/ui/Alert/Alert";
import PapeleraPage   from "../papelera/PapeleraPage";
import AboutPage      from "../about/AboutPage";

import "./DashboardPage.css";

type SeccionActiva = "dashboard" | "mis-tareas" | "tickets" | "papelera" | "about";

export default function DashboardPage() {
  const { alertaExito, alertaInfo, alertaAdvertencia, alertaError } = useAlert();
  const {
    tareasActivas,
    tareasEnPapelera,
    actividades,
    crearTarea,
    editarTarea,
    cambiarEstadoTarea,
    actualizarProgreso,
    moverAPapelera,
    restaurarDePapelera,
    eliminarPermanentemente,
    vaciarPapelera,
  } = useTasks();

  const [seccionActiva,     setSeccionActiva]     = useState<SeccionActiva>("dashboard");
  const [sidebarAbierto,    setSidebarAbierto]    = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  // Usamos el tipo FiltrosDeBusqueda completo desde task.ts
  const [filtros, setFiltros] = useState<FiltrosDeBusqueda>(FILTROS_VACIOS);

  // ---- Helpers de filtro ----
  function actualizarFiltro<K extends keyof FiltrosDeBusqueda>(
    campo: K,
    valor: FiltrosDeBusqueda[K]
  ) {
    setFiltros((anterior) => ({ ...anterior, [campo]: valor }));
  }

  function limpiarFiltros() {
    setFiltros(FILTROS_VACIOS);
  }

  const hayFiltrosActivos =
    filtros.textoDeBusqueda !== "" ||
    filtros.estadoFiltrado  !== "todas" ||
    filtros.asignadoA       !== "";

  // ---- Lógica de filtrado ----
  // Buscamos en: título, descripción, creadoPor Y asignadoA
  const tareasFiltradas = tareasActivas.filter((tarea) => {
    const texto = filtros.textoDeBusqueda.toLowerCase();

    const coincideTexto =
      texto === "" ||
      tarea.titulo.toLowerCase().includes(texto)           ||
      (tarea.descripcion ?? "").toLowerCase().includes(texto) ||
      (tarea.creadoPor   ?? "").toLowerCase().includes(texto) ||
      (tarea.asignadoA   ?? "").toLowerCase().includes(texto);

    const coincideEstado =
      filtros.estadoFiltrado === "todas" ||
      tarea.estado === filtros.estadoFiltrado;

    const coincideAsignado =
      filtros.asignadoA === "" ||
      (tarea.asignadoA ?? "").toLowerCase().includes(filtros.asignadoA.toLowerCase());

    return coincideTexto && coincideEstado && coincideAsignado;
  });

  // ---- Handlers ----
  function manejarCreacionDeTarea(datos: TareaNueva) {
    crearTarea(datos);
    alertaExito(`"${datos.titulo}" fue agregada.`, "Tarea creada");
    setMostrarFormulario(false);
  }

  function manejarEditarTarea(id: string, datosEditados: TareaNueva) {
    editarTarea(id, datosEditados);
    alertaExito("Los cambios fueron guardados.", "Tarea editada");
  }

  function manejarCambioEstado(id: string, nuevoEstado: EstadoTarea) {
    const tarea = tareasActivas.find((t) => t.id === id);
    if (tarea?.estado === nuevoEstado) return;
    cambiarEstadoTarea(id, nuevoEstado);
    if (nuevoEstado === "completada") alertaExito("¡Tarea completada!", "Completada");
    else alertaInfo(`Tarea → ${nuevoEstado}.`, "Estado actualizado");
  }

  function manejarMoverAPapelera(id: string) {
    const tarea = tareasActivas.find((t) => t.id === id);
    moverAPapelera(id);
    alertaAdvertencia(`"${tarea?.titulo ?? "Tarea"}" movida a la papelera.`, "Eliminada");
  }

  function manejarRestaurar(id: string) {
    const tarea = tareasEnPapelera.find((t) => t.id === id);
    restaurarDePapelera(id);
    alertaExito(`"${tarea?.titulo ?? "Tarea"}" restaurada.`, "Restaurada");
  }

  function manejarEliminarPermanente(id: string) {
    eliminarPermanentemente(id);
    alertaError("Tarea eliminada definitivamente.", "Eliminada");
  }

  function manejarVaciarPapelera() {
    vaciarPapelera();
    alertaError("Papelera vaciada.", "Vaciada");
  }

  // ---- Estadísticas ----
  const totalTareas       = tareasActivas.length;
  const tareasCompletadas = tareasActivas.filter((t) => t.estado === "completada").length;
  const tareasEnProgreso  = tareasActivas.filter((t) => t.estado === "en-progreso").length;
  const tareasPendientes  = tareasActivas.filter((t) => t.estado === "pendiente").length;

  // ---- Config topbar ----
  const configTopbar: Record<SeccionActiva, { titulo: string; subtitulo: string }> = {
    dashboard:    { titulo: "Dashboard",    subtitulo: `${totalTareas} tarea${totalTareas !== 1 ? "s" : ""} en total` },
    "mis-tareas": { titulo: "Mis tareas",   subtitulo: hayFiltrosActivos ? `${tareasFiltradas.length} resultado${tareasFiltradas.length !== 1 ? "s" : ""}` : `${tareasPendientes} pendiente${tareasPendientes !== 1 ? "s" : ""}` },
    tickets:      { titulo: "Tickets",      subtitulo: "Próximamente" },
    papelera:     { titulo: "Papelera",     subtitulo: `${tareasEnPapelera.length} elemento${tareasEnPapelera.length !== 1 ? "s" : ""}` },
    about:        { titulo: "Sobre Mitake", subtitulo: "Información del proyecto" },
  };

  const mostrarBotonNueva = seccionActiva === "dashboard" || seccionActiva === "mis-tareas";

  return (
    <div className="dashboard-layout">

      <Sidebar
        seccionActiva={seccionActiva}
        alCambiarSeccion={(s) => setSeccionActiva(s as SeccionActiva)}
        cantidadEnPapelera={tareasEnPapelera.length}
        estaAbierto={sidebarAbierto}
        alCerrar={() => setSidebarAbierto(false)}
      />

      <main className="dashboard-layout__main">

        <Topbar
          tituloSeccion={configTopbar[seccionActiva].titulo}
          subtituloSeccion={configTopbar[seccionActiva].subtitulo}
          alAbrirSidebar={() => setSidebarAbierto(true)}
          botonPrimario={
            mostrarBotonNueva
              ? { etiqueta: "Nueva tarea", alHacerClick: () => setMostrarFormulario(true) }
              : undefined
          }
        />

        {/* ================================================
            DASHBOARD
        ================================================ */}
        {seccionActiva === "dashboard" && (
          <div className="dashboard-layout__contenido">
            <div className="dashboard-layout__estadisticas">
              <StatCard tituloEstadistica="Total"       valorPrincipal={totalTareas}       descripcionSecundaria="Tareas creadas"  colorAcento="#8b5cf6" icono="📋" />
              <StatCard tituloEstadistica="Pendientes"  valorPrincipal={tareasPendientes}  descripcionSecundaria="Por comenzar"    colorAcento="#3b82f6" icono="⏳" />
              <StatCard tituloEstadistica="En progreso" valorPrincipal={tareasEnProgreso}  descripcionSecundaria="Trabajando"      colorAcento="#f59e0b" icono="🔄" />
              <StatCard tituloEstadistica="Completadas" valorPrincipal={tareasCompletadas} descripcionSecundaria="Finalizadas"     colorAcento="#10b981" icono="✅" />
            </div>

            <div className="dashboard-layout__doble-columna">
              <div className="dashboard-layout__kanban-wrap">
                <KanbanBoard
                  tareas={tareasActivas}
                  alCambiarEstado={manejarCambioEstado}
                  alActualizarProgreso={actualizarProgreso}
                  alMoverAPapelera={manejarMoverAPapelera}
                  alEditarTarea={manejarEditarTarea}
                />
              </div>
              <div className="dashboard-layout__feed-wrap">
                <ActivityFeed actividades={actividades} />
              </div>
            </div>
          </div>
        )}

        {/* ================================================
            MIS TAREAS — con buscador completo
        ================================================ */}
        {seccionActiva === "mis-tareas" && (
          <div className="dashboard-layout__contenido">

            {/* BARRA DE FILTROS */}
            <div className="filtros-barra">

              {/* Búsqueda general: título, descripción, creador, asignado */}
              <div className="filtros-barra__campo filtros-barra__campo--busqueda">
                <span className="filtros-barra__campo-icono">⌕</span>
                <input
                  type="text"
                  placeholder="Buscar por título, descripción o persona..."
                  value={filtros.textoDeBusqueda}
                  onChange={(e) => actualizarFiltro("textoDeBusqueda", e.target.value)}
                  className="filtros-barra__input"
                />
                {filtros.textoDeBusqueda && (
                  <button
                    className="filtros-barra__limpiar-input"
                    onClick={() => actualizarFiltro("textoDeBusqueda", "")}
                    title="Limpiar búsqueda"
                  >✕</button>
                )}
              </div>

              {/* Filtro por asignado específico */}
              <div className="filtros-barra__campo">
                <span className="filtros-barra__campo-icono">→</span>
                <input
                  type="text"
                  placeholder="Asignado a..."
                  value={filtros.asignadoA}
                  onChange={(e) => actualizarFiltro("asignadoA", e.target.value)}
                  className="filtros-barra__input"
                />
              </div>

              {/* Filtro por estado */}
              <div className="filtros-barra__botones">
                {(["todas", "pendiente", "en-progreso", "completada"] as const).map((estadoOpcion) => (
                  <button
                    key={estadoOpcion}
                    className={filtros.estadoFiltrado === estadoOpcion ? "activo" : ""}
                    onClick={() => actualizarFiltro("estadoFiltrado", estadoOpcion)}
                  >
                    {estadoOpcion === "todas"       ? "Todas"       :
                     estadoOpcion === "pendiente"   ? "Pendientes"  :
                     estadoOpcion === "en-progreso" ? "En progreso" : "Completadas"}
                  </button>
                ))}
              </div>

              {/* Botón limpiar — solo si hay filtros activos */}
              {hayFiltrosActivos && (
                <button className="filtros-barra__limpiar-todo" onClick={limpiarFiltros}>
                  Limpiar filtros
                </button>
              )}
            </div>

            {/* Resultado del filtro */}
            {hayFiltrosActivos && (
              <p className="filtros-barra__resultado">
                {tareasFiltradas.length === 0
                  ? "Ninguna tarea coincide con la búsqueda."
                  : `${tareasFiltradas.length} tarea${tareasFiltradas.length !== 1 ? "s" : ""} encontrada${tareasFiltradas.length !== 1 ? "s" : ""}`}
              </p>
            )}

            <KanbanBoard
              tareas={tareasFiltradas}
              alCambiarEstado={manejarCambioEstado}
              alActualizarProgreso={actualizarProgreso}
              alMoverAPapelera={manejarMoverAPapelera}
              alEditarTarea={manejarEditarTarea}
            />
          </div>
        )}

        {/* TICKETS */}
        {seccionActiva === "tickets" && (
          <div className="dashboard-layout__contenido">
            <div className="dashboard-layout__proximamente">
              <span className="dashboard-layout__proximamente-icono">◈</span>
              <h2>Tickets — Próximamente</h2>
              <p>El sistema de tickets está en desarrollo.</p>
            </div>
          </div>
        )}

        {/* PAPELERA */}
        {seccionActiva === "papelera" && (
          <div className="dashboard-layout__contenido">
            <PapeleraPage
              tareasEnPapelera={tareasEnPapelera}
              alRestaurar={manejarRestaurar}
              alEliminarPermanentemente={manejarEliminarPermanente}
              alVaciarPapelera={manejarVaciarPapelera}
            />
          </div>
        )}

        {/* ABOUT */}
        {seccionActiva === "about" && (
          <div className="dashboard-layout__contenido">
            <AboutPage />
          </div>
        )}

      </main>

      {mostrarFormulario && (
        <TaskForm
          alConfirmar={manejarCreacionDeTarea}
          alCancelar={() => setMostrarFormulario(false)}
        />
      )}

      <AlertContainer />
    </div>
  );
}