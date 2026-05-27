// ============================================================
// ARCHIVO: src/pages/papelera/PapeleraPage.tsx
// ¿Para qué sirve? Página de la papelera de reciclaje.
// Muestra las tareas eliminadas con opciones de restaurar
// o borrar permanentemente.
// ============================================================

import type { Tarea } from "../../types/task";
import "./PapeleraPage.css";

// ------------------------------------------------------------
// INTERFAZ: PropiedadesDePapeleraPage
// ------------------------------------------------------------
interface PropiedadesDePapeleraPage {
  tareasEnPapelera: Tarea[];
  alRestaurar: (identificador: string) => void;
  alEliminarPermanentemente: (identificador: string) => void;
  alVaciarPapelera: () => void;
}

const textosPorPrioridad: Record<string, string> = {
  baja: "Baja", media: "Media", alta: "Alta",
};

// ------------------------------------------------------------
// COMPONENTE: PapeleraPage
// ------------------------------------------------------------
function PapeleraPage({
  tareasEnPapelera,
  alRestaurar,
  alEliminarPermanentemente,
  alVaciarPapelera,
}: PropiedadesDePapeleraPage) {
  return (
    <div className="papelera">

      {/* Encabezado */}
      <div className="papelera__encabezado">
        <div className="papelera__encabezado-texto">
          <h2 className="papelera__titulo">Papelera de reciclaje</h2>
          <p className="papelera__subtitulo">
            {tareasEnPapelera.length === 0
              ? "La papelera está vacía"
              : `${tareasEnPapelera.length} elemento${tareasEnPapelera.length !== 1 ? "s" : ""} eliminado${tareasEnPapelera.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        {tareasEnPapelera.length > 0 && (
          <button
            className="papelera__boton-vaciar"
            onClick={alVaciarPapelera}
          >
            🗑 Vaciar papelera
          </button>
        )}
      </div>

      {/* Estado vacío */}
      {tareasEnPapelera.length === 0 && (
        <div className="papelera__vacia">
          <div className="papelera__vacia-icono">🗑</div>
          <p className="papelera__vacia-texto">No hay elementos en la papelera</p>
          <p className="papelera__vacia-descripcion">
            Las tareas eliminadas aparecerán acá. Podés restaurarlas o borrarlas
            definitivamente.
          </p>
        </div>
      )}

      {/* Lista de tareas eliminadas */}
      {tareasEnPapelera.length > 0 && (
        <div className="papelera__lista">
          {tareasEnPapelera.map((tareaEliminada) => (
            <div key={tareaEliminada.id} className="papelera__item">

              {/* Info de la tarea */}
              <div className="papelera__item-info">
                <div className="papelera__item-encabezado">
                  <span className={`papelera__item-prioridad papelera__item-prioridad--${tareaEliminada.prioridad}`}>
                    {textosPorPrioridad[tareaEliminada.prioridad]}
                  </span>
                  {tareaEliminada.fechaEliminacion && (
                    <span className="papelera__item-fecha">
                      Eliminada el {tareaEliminada.fechaEliminacion}
                    </span>
                  )}
                </div>
                <h3 className="papelera__item-titulo">{tareaEliminada.titulo}</h3>
                {tareaEliminada.descripcion && (
                  <p className="papelera__item-descripcion">
                    {tareaEliminada.descripcion}
                  </p>
                )}
              </div>

              {/* Acciones */}
              <div className="papelera__item-acciones">
                <button
                  className="papelera__boton-restaurar"
                  onClick={() => alRestaurar(tareaEliminada.id)}
                  title="Restaurar tarea"
                >
                  ↩ Restaurar
                </button>
                <button
                  className="papelera__boton-eliminar"
                  onClick={() => alEliminarPermanentemente(tareaEliminada.id)}
                  title="Eliminar para siempre"
                >
                  ✕ Eliminar
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PapeleraPage;