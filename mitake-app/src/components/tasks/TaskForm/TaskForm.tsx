import { useState } from "react";

import type {
  EstadoTarea,
  PrioridadTarea,
  TareaNueva,
} from "../../../types/task";

import "./TaskForm.css";

type TaskFormProps = {
  alConfirmar: (datos: TareaNueva) => void;
  alCancelar: () => void;
};

function TaskForm({
  alConfirmar,
  alCancelar,
}: TaskFormProps) {
  const [titulo, setTitulo] =
    useState("");

  const [
    descripcion,
    setDescripcion,
  ] = useState("");

  const [estado, setEstado] =
    useState<EstadoTarea>(
      "pendiente",
    );

  const [prioridad, setPrioridad] =
    useState<PrioridadTarea>(
      "media",
    );

  function handleSubmit(
    e: React.FormEvent,
  ) {
    e.preventDefault();

    if (!titulo.trim()) return;

    alConfirmar({
      titulo,
      descripcion,
      estado,
      prioridad,
    });

    setTitulo("");

    setDescripcion("");

    setEstado("pendiente");

    setPrioridad("media");
  }

  return (
    <div className="modal-overlay">
      <form
        className="task-form"
        onSubmit={handleSubmit}
      >
        <h2>Nueva tarea</h2>

        <input
          type="text"
          placeholder="Título"
          value={titulo}
          onChange={(e) =>
            setTitulo(
              e.target.value,
            )
          }
        />

        <textarea
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) =>
            setDescripcion(
              e.target.value,
            )
          }
        />

        <select
          value={estado}
          onChange={(e) =>
            setEstado(
              e.target
                .value as EstadoTarea,
            )
          }
        >
          <option value="pendiente">
            Pendiente
          </option>

          <option value="en-progreso">
            En progreso
          </option>

          <option value="completada">
            Completada
          </option>
        </select>

        <select
          value={prioridad}
          onChange={(e) =>
            setPrioridad(
              e.target
                .value as PrioridadTarea,
            )
          }
        >
          <option value="alta">
            Alta
          </option>

          <option value="media">
            Media
          </option>

          <option value="baja">
            Baja
          </option>
        </select>

        <div className="task-form__actions">
          <button type="submit">
            Crear tarea
          </button>

          <button
            type="button"
            onClick={alCancelar}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default TaskForm;