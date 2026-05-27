// ============================================================
// ARCHIVO: src/pages/dashboard/DashboardPage.tsx
// ¿Para qué sirve? Página principal del dashboard.
// Orquesta todos los componentes y maneja la navegación
// entre secciones: Dashboard, Papelera y About.
// ============================================================

import { useState } from "react";

import { useTasks } from "../../hooks/useTasks";

import Sidebar from "../../components/layout/Sidebar/Sidebar";
import Topbar from "../../components/layout/Topbar/Topbar";
import StatCard from "../../components/ui/StatCard/StatCard";
import TaskCard from "../../components/tasks/TaskCard/TaskCard";
import TaskForm from "../../components/tasks/TaskForm/TaskForm";
import KanbanBoard from "../../components/kanban/KanbanBoard/KanbanBoard";
import PapeleraPage from "../papelera/PapeleraPage";
import AboutPage from "../about/AboutPage";

import "./DashboardPage.css";

import type { TareaNueva } from "../../types/task";

// ------------------------------------------------------------
// COMPONENTE: DashboardPage
// ------------------------------------------------------------
function DashboardPage() {
  const {
    tareasActivas,
    tareasEnPapelera,
    crearTarea,
    cambiarEstadoTarea,
    actualizarProgreso,
    moverAPapelera,
    restaurarDePapelera,
    eliminarPermanentemente,
    vaciarPapelera,
  } = useTasks();

  const [seccionActiva, setSeccionActiva] = useState<string>("dashboard");
  const [formularioEstaVisible, setFormularioEstaVisible] = useState<boolean>(false);

  // --------------------------------------------------------
  // FUNCIÓN: manejarCreacionDeTarea
  // --------------------------------------------------------
  function manejarCreacionDeTarea(datosNuevos: TareaNueva): void {
    crearTarea(datosNuevos);
    setFormularioEstaVisible(false);
  }

  // --------------------------------------------------------
  // ESTADÍSTICAS calculadas desde las tareas activas
  // --------------------------------------------------------
  const tareasCompletadas = tareasActivas.filter(
    (tarea) => tarea.estado === "completada"
  ).length;

  const tareasEnProgreso = tareasActivas.filter(
    (tarea) => tarea.estado === "en-progreso"
  ).length;

  const tareasPendientes = tareasActivas.filter(
    (tarea) => tarea.estado === "pendiente"
  ).length;

  const progresoPromedio =
    tareasActivas.length > 0
      ? Math.round(
          tareasActivas.reduce((suma, tarea) => suma + tarea.progreso, 0) /
            tareasActivas.length
        )
      : 0;

  // --------------------------------------------------------
  // RENDER según la sección activa
  // --------------------------------------------------------

  // Papelera
  if (seccionActiva === "papelera") {
    return (
      <div className="contenedor-dashboard">
        <Sidebar
          seccionActiva={seccionActiva}
          alCambiarSeccion={setSeccionActiva}
          cantidadEnPapelera={tareasEnPapelera.length}
        />
        <div className="contenido-principal">
          <Topbar
            tituloSeccion="Papelera"
            subtituloSeccion="Tareas eliminadas"
          />
          <main className="area-scroll">
            <PapeleraPage
              tareasEnPapelera={tareasEnPapelera}
              alRestaurar={restaurarDePapelera}
              alEliminarPermanentemente={eliminarPermanentemente}
              alVaciarPapelera={vaciarPapelera}
            />
          </main>
        </div>
      </div>
    );
  }

  // About
  if (seccionActiva === "about") {
    return (
      <div className="contenedor-dashboard">
        <Sidebar
          seccionActiva={seccionActiva}
          alCambiarSeccion={setSeccionActiva}
          cantidadEnPapelera={tareasEnPapelera.length}
        />
        <div className="contenido-principal">
          <Topbar
            tituloSeccion="Sobre Mitake"
            subtituloSeccion="Conocé el proyecto"
          />
          <main className="area-scroll">
            <AboutPage />
          </main>
        </div>
      </div>
    );
  }

  // Dashboard principal
  return (
    <div className="contenedor-dashboard">

      <Sidebar
        seccionActiva={seccionActiva}
        alCambiarSeccion={setSeccionActiva}
        cantidadEnPapelera={tareasEnPapelera.length}
      />

      <div className="contenido-principal">

        <Topbar
          tituloSeccion="Dashboard"
          subtituloSeccion="Gestioná tus tareas y tickets."
          botonPrimario={{
            etiqueta: "Nueva tarea",
            alHacerClick: () => setFormularioEstaVisible(true),
          }}
        />

        <main className="area-scroll">

          {/* Stat Cards */}
          <section className="seccion-stats">
            <StatCard
              tituloEstadistica="Tareas completadas"
              valorPrincipal={tareasCompletadas}
              descripcionSecundaria="Tareas finalizadas"
              colorDeFondo="linear-gradient(135deg, #7c5af6, #5a3dd4)"
              icono="✓"
            />
            <StatCard
              tituloEstadistica="En progreso"
              valorPrincipal={tareasEnProgreso}
              descripcionSecundaria="Tareas activas"
              colorDeFondo="linear-gradient(135deg, #e89d2a, #c47d18)"
              icono="⟳"
            />
            <StatCard
              tituloEstadistica="Pendientes"
              valorPrincipal={tareasPendientes}
              descripcionSecundaria="Tareas por realizar"
              colorDeFondo="linear-gradient(135deg, #1d9e75, #157a5a)"
              icono="○"
            />
            <StatCard
              tituloEstadistica="Progreso global"
              valorPrincipal={`${progresoPromedio}%`}
              descripcionSecundaria="Promedio de avance"
              colorDeFondo="linear-gradient(135deg, #3b9eed, #2478c7)"
              icono="↑"
            />
          </section>

          {/* Tareas recientes */}
          <section className="seccion-tareas">
            <div className="seccion-encabezado">
              <div className="seccion-encabezado__texto">
                <h2 className="seccion-titulo">Tareas recientes</h2>
                <p className="seccion-subtitulo">
                  {tareasActivas.length} tarea
                  {tareasActivas.length !== 1 ? "s" : ""} activa
                  {tareasActivas.length !== 1 ? "s" : ""}
                </p>
              </div>
              <button
                className="boton-ver-todas"
                onClick={() => setSeccionActiva("mis-tareas")}
              >
                Ver todas →
              </button>
            </div>

            {tareasActivas.length === 0 ? (
              <div className="estado-vacio">
                <div className="estado-vacio__icono">📋</div>
                <p className="estado-vacio__texto">No tenés tareas todavía</p>
                <button
                  className="estado-vacio__boton"
                  onClick={() => setFormularioEstaVisible(true)}
                >
                  Crear primera tarea
                </button>
              </div>
            ) : (
              <div className="grid-tareas">
                {tareasActivas.slice(0, 6).map((tareaActual) => (
                  <TaskCard
                    key={tareaActual.id}
                    datosDeLaTarea={tareaActual}
                    alCambiarEstado={cambiarEstadoTarea}
                    alActualizarProgreso={actualizarProgreso}
                    alMoverAPapelera={moverAPapelera}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Kanban */}
          <KanbanBoard
            tareas={tareasActivas}
            alCambiarEstado={cambiarEstadoTarea}
            alActualizarProgreso={actualizarProgreso}
            alMoverAPapelera={moverAPapelera}
          />

        </main>
      </div>

      {/* Modal de nueva tarea */}
      {formularioEstaVisible && (
        <TaskForm
          alConfirmar={manejarCreacionDeTarea}
          alCancelar={() => setFormularioEstaVisible(false)}
        />
      )}

    </div>
  );
}

export default DashboardPage;