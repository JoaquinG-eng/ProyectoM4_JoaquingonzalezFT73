import type { Tarea } from "../types/task";

export const mockTasks: Tarea[] = [
  {
    id: crypto.randomUUID(),

    titulo: "Diseñar dashboard",

    descripcion:
      "Crear estructura visual principal",

    estado: "pendiente",

    prioridad: "alta",

    fechaCreacion:
      new Date().toISOString(),

    progreso: 0,

    estaEnPapelera: false,
  },

  {
    id: crypto.randomUUID(),

    titulo: "Crear Kanban",

    descripcion:
      "Separar tareas por estados",

    estado: "en-progreso",

    prioridad: "media",

    fechaCreacion:
      new Date().toISOString(),

    progreso: 40,

    estaEnPapelera: false,
  },

  {
    id: crypto.randomUUID(),

    titulo: "Agregar estadísticas",

    descripcion:
      "Cards dinámicas del dashboard",

    estado: "completada",

    prioridad: "alta",

    fechaCreacion:
      new Date().toISOString(),

    progreso: 100,

    estaEnPapelera: false,
  },
];