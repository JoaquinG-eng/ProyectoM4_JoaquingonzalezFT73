import type {
  EstadoTarea,
  Tarea,
} from "../../../types/task";

 import "./TaskCard.css";
type TaskCardProps = {
  datosDeLaTarea: Tarea;

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

function TaskCard({
  datosDeLaTarea,
  alCambiarEstado,
  alActualizarProgreso,
  alMoverAPapelera,
}: TaskCardProps) {
  return (
    <article className="task-card">
      <div className="task-card__top">
        <h3>
          {
            datosDeLaTarea.titulo
          }
        </h3>

        <span className={`task-card__priority task-card__priority--${datosDeLaTarea.prioridad}`}>
          {
            datosDeLaTarea.prioridad
          }
        </span>
      </div>

      <p className="task-card__description">
        {
          datosDeLaTarea.descripcion
        }
      </p>

      <div className="task-card__bottom">
        <small className={`task-card__status task-card__status--${datosDeLaTarea.estado}`}>
          Estado: {datosDeLaTarea.estado === "en-progreso" ? "En progreso" : datosDeLaTarea.estado === "pendiente" ? "Pendiente" : "Completada"}
        </small>

        <small className="task-card__progress">
          Progreso: {datosDeLaTarea.progreso}%
        </small>
      </div>

      <div className="task-card__actions">
        <button
          onClick={() =>
            alCambiarEstado(
              datosDeLaTarea.id,
              "completada",
            )
          }
        >
          Completar
        </button>

        <button
          onClick={() =>
            alActualizarProgreso(
              datosDeLaTarea.id,
              datosDeLaTarea.progreso +
                10,
            )
          }
        >
          +10%
        </button>

        <button
          onClick={() =>
            alMoverAPapelera(
              datosDeLaTarea.id,
            )
          }
        >
          Eliminar
        </button>
      </div>
    </article>
  );
}

export default TaskCard;