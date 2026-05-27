import TaskCard from "../../tasks/TaskCard/TaskCard";

import type {
  EstadoTarea,
  Tarea,
} from "../../../types/task";

import "./KanbanBoard.css";

type KanbanBoardProps = {
  tareas: Tarea[];

  alCambiarEstado: (
    id: string,
    nuevoEstado: EstadoTarea,
  ) => void;

  alActualizarProgreso: (
    id: string,
    progresoNuevo: number,
  ) => void;

  alMoverAPapelera: (
    id: string,
  ) => void;
};

function KanbanBoard({
  tareas,
  alCambiarEstado,
  alActualizarProgreso,
  alMoverAPapelera,
}: KanbanBoardProps) {
  const columnas = [
    {
      titulo: "Pendientes",
      estado: "pendiente",
    },
    {
      titulo: "En progreso",
      estado: "en-progreso",
    },
    {
      titulo: "Completadas",
      estado: "completada",
    },
  ];

  return (
    <section className="kanban">
      <div className="kanban__grid">
        {columnas.map((columna) => (
          <div
            key={columna.estado}
            className="kanban__column"
          >
            <h3>
              {columna.titulo}

              <span>
                {
                  tareas.filter(
                    (tarea) =>
                      tarea.estado ===
                      columna.estado,
                  ).length
                }
              </span>
            </h3>

            <div className="kanban__tasks">
              {tareas
                .filter(
                  (tarea) =>
                    tarea.estado ===
                    columna.estado,
                )
                .map((tarea) => (
                  <TaskCard
                    key={tarea.id}
                    datosDeLaTarea={
                      tarea
                    }
                    alCambiarEstado={
                      alCambiarEstado
                    }
                    alActualizarProgreso={
                      alActualizarProgreso
                    }
                    alMoverAPapelera={
                      alMoverAPapelera
                    }
                  />
                ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default KanbanBoard;