export type EstadoTarea =
  | "pendiente"
  | "en-progreso"
  | "completada";

export type PrioridadTarea =
  | "alta"
  | "media"
  | "baja";

// ============================================================
// MODELO PRINCIPAL
// ============================================================

export interface Tarea {
  id: string;

  titulo: string;

  descripcion: string;

  estado: EstadoTarea;

  prioridad: PrioridadTarea;

  fechaCreacion: string;

  // ==========================================================
  // NUEVAS PROPIEDADES
  // ==========================================================

  fechaLimite?: string;

  progreso: number;

  estaEnPapelera: boolean;

  fechaEliminacion?: string;
}

// ============================================================
// TAREA NUEVA
// ============================================================

export type TareaNueva = {
  titulo: string;

  descripcion: string;

  estado: EstadoTarea;

  prioridad: PrioridadTarea;

  fechaLimite?: string;
};