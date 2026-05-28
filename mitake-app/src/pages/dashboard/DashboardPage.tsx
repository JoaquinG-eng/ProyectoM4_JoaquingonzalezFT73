// ============================================================
// ARCHIVO: src/pages/dashboard/DashboardPage.tsx
// ============================================================

import { useState } from "react";

import { useTasks } from "../../hooks/useTasks";
import { useAlert } from "../../hooks/useAlert";

import type { TareaNueva, EstadoTarea } from "../../types/task";

import Sidebar from "../../components/layout/Sidebar/Sidebar";
import Topbar from "../../components/layout/Topbar/Topbar";
import TaskForm from "../../components/tasks/TaskForm/TaskForm";
import KanbanBoard from "../../components/kanban/KanbanBoard/KanbanBoard";
import StatCard from "../../components/ui/StatCard/StatCard";
import ActivityFeed from "../../components/ui/ActivityFeed/ActivityFeed";
import AlertContainer from "../../components/ui/Alert/Alert";
import PapeleraPage from "../papelera/PapeleraPage";
import AboutPage from "../about/AboutPage";

import "./DashboardPage.css";

type SeccionActiva =
  | "dashboard"
  | "mis-tareas"
  | "tickets"
  | "papelera"
  | "about";

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

  const [seccionActiva, setSeccionActiva] =
    useState<SeccionActiva>("dashboard");
  const [sidebarAbierto, setSidebarAbierto] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  // Estados para filtros en "Mis Tareas"
  const [filtroTexto, setFiltroTexto] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<EstadoTarea | "todas">("todas");

  function manejarCreacionDeTarea(datos: TareaNueva): void {
    crearTarea(datos);
    alertaExito("Tarea creada correctamente", "¡Éxito!");
    setMostrarFormulario(false);
  }

  function manejarEditarTarea(id: string, datosEditados: TareaNueva) {
    editarTarea(id, datosEditados);
    alertaExito("Los cambios han sido guardados", "Tarea editada");
  }

  function manejarCambioEstado(id: string, nuevoEstado: EstadoTarea) {
    const tarea = tareasActivas.find(t => t.id === id);
    if (tarea?.estado === nuevoEstado) return;

    cambiarEstadoTarea(id, nuevoEstado);
    if (nuevoEstado === "completada") {
      alertaInfo(`Tarea movida a ${nuevoEstado}`, "Actualizado");
    }
  }

  function manejarMoverAPapelera(id: string) {
    moverAPapelera(id);
    alertaAdvertencia("Tarea enviada a la papelera", "Eliminada");
  }

  function manejarRestaurar(id: string) {
    restaurarDePapelera(id);
    alertaExito("Tarea restaurada con éxito", "Restaurada");
  }

  function manejarEliminarPermanente(id: string) {
    eliminarPermanentemente(id);
    alertaError("Tarea eliminada de forma permanente", "Eliminada");
  }

  function manejarVaciarPapelera() {
    vaciarPapelera();
    alertaError("Has vaciado la papelera", "Papelera vaciada");
  }

  // ---- Estadísticas ----
  const totalTareas = tareasActivas.length;
  const tareasCompletadas = tareasActivas.filter((t) => t.estado === "completada").length;
  const tareasEnProgreso = tareasActivas.filter((t) => t.estado === "en-progreso").length;
  const tareasPendientes = tareasActivas.filter((t) => t.estado === "pendiente").length;

  const tareasMisTareasFiltradas = tareasActivas.filter((t) => {
    const coincideTexto = t.titulo.toLowerCase().includes(filtroTexto.toLowerCase()) ||
      (t.descripcion && t.descripcion.toLowerCase().includes(filtroTexto.toLowerCase()));
    const coincideEstado = filtroEstado === "todas" || t.estado === filtroEstado;
    return coincideTexto && coincideEstado;
  });

  const configuracionTopbar: Record<
    SeccionActiva,
    { titulo: string; subtitulo: string }
  > = {
    dashboard: { titulo: "Dashboard", subtitulo: `${totalTareas} tarea${totalTareas !== 1 ? "s" : ""} en total` },
    "mis-tareas": { titulo: "Mis tareas", subtitulo: `${tareasPendientes} pendiente${tareasPendientes !== 1 ? "s" : ""}` },
    tickets: { titulo: "Tickets", subtitulo: "Próximamente" },
    papelera: { titulo: "Papelera", subtitulo: `${tareasEnPapelera.length} elemento${tareasEnPapelera.length !== 1 ? "s" : ""}` },
    about: { titulo: "Sobre Mitake", subtitulo: "Información del proyecto" },
  };

  const topbarActual = configuracionTopbar[seccionActiva];
  const mostrarBotonNueva =
    seccionActiva === "dashboard" || seccionActiva === "mis-tareas";

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
          tituloSeccion={topbarActual.titulo}
          subtituloSeccion={topbarActual.subtitulo}
          alAbrirSidebar={() => setSidebarAbierto(true)}
          botonPrimario={
            mostrarBotonNueva
              ? { etiqueta: "Nueva tarea", alHacerClick: () => setMostrarFormulario(true) }
              : undefined
          }
        />

        {/* ---- DASHBOARD ---- */}
        {seccionActiva === "dashboard" && (
          <div className="dashboard-layout__contenido">

            {/* Stat Cards */}
            <div className="dashboard-layout__estadisticas">
              <StatCard
                tituloEstadistica="Total"
                valorPrincipal={totalTareas}
                descripcionSecundaria="Tareas creadas"
                colorAcento="#8b5cf6"
                icono="📋"
              />
              <StatCard
                tituloEstadistica="Pendientes"
                valorPrincipal={tareasPendientes}
                descripcionSecundaria="Por comenzar"
                colorAcento="#3b82f6"
                icono="⏳"
              />
              <StatCard
                tituloEstadistica="En progreso"
                valorPrincipal={tareasEnProgreso}
                descripcionSecundaria="Trabajando"
                colorAcento="#f59e0b"
                icono="🔄"
              />
              <StatCard
                tituloEstadistica="Completadas"
                valorPrincipal={tareasCompletadas}
                descripcionSecundaria="Finalizadas"
                colorAcento="#10b981"
                icono="✅"
              />
            </div>

            {/* Kanban + Feed lado a lado en desktop, apilados en mobile */}
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

        {/* ---- MIS TAREAS ---- */}
        {seccionActiva === "mis-tareas" && (
          <div className="dashboard-layout__contenido">

            <div className="filtros-barra">
              <input
                type="text"
                placeholder="Buscar por título o descripción..."
                value={filtroTexto}
                onChange={(e) => setFiltroTexto(e.target.value)}
                className="filtros-barra__buscador"
              />
              <div className="filtros-barra__botones">
                <button
                  className={filtroEstado === "todas" ? "activo" : ""}
                  onClick={() => setFiltroEstado("todas")}
                >Todas</button>
                <button
                  className={filtroEstado === "pendiente" ? "activo" : ""}
                  onClick={() => setFiltroEstado("pendiente")}
                >Pendientes</button>
                <button
                  className={filtroEstado === "completada" ? "activo" : ""}
                  onClick={() => setFiltroEstado("completada")}
                >Completadas</button>
              </div>
            </div>

            <KanbanBoard
              tareas={tareasMisTareasFiltradas}
              alCambiarEstado={manejarCambioEstado}
              alActualizarProgreso={actualizarProgreso}
              alMoverAPapelera={manejarMoverAPapelera}
              alEditarTarea={manejarEditarTarea}
            />
          </div>
        )}

        {/* ---- TICKETS ---- */}
        {seccionActiva === "tickets" && (
          <div className="dashboard-layout__contenido">
            <div className="dashboard-layout__proximamente">
              <span className="dashboard-layout__proximamente-icono">◈</span>
              <h2>Tickets — Próximamente</h2>
              <p>El sistema de tickets está en desarrollo.</p>
            </div>
          </div>
        )}

        {/* ---- PAPELERA ---- */}
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

        {/* ---- ABOUT ---- */}
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