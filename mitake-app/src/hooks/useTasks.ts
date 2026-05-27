// ============================================================
// ARCHIVO: src/hooks/useTasks.ts
// ¿Para qué sirve? Maneja toda la lógica de tareas con
// persistencia en localStorage. Ahora incluye papelera
// de reciclaje y actualización de porcentaje de progreso.
// ============================================================

import { useState, useEffect } from "react";
import type { Tarea, TareaNueva, EstadoTarea } from "../types/task";

// Clave que usamos para guardar en localStorage
const CLAVE_LOCAL_STORAGE = "mitake-tareas";

// ------------------------------------------------------------
// FUNCIÓN DE AYUDA: cargarTareasDesdeStorage
// Lee las tareas guardadas en localStorage.
// Si no hay nada guardado, devuelve un array vacío.
// ------------------------------------------------------------
function cargarTareasDesdeStorage(): Tarea[] {
  try {
    const datosGuardados = localStorage.getItem(CLAVE_LOCAL_STORAGE);
    if (!datosGuardados) return [];
    return JSON.parse(datosGuardados) as Tarea[];
  } catch (_error) {
    return [];
  }
}

// ------------------------------------------------------------
// FUNCIÓN DE AYUDA: guardarTareasEnStorage
// Serializa y guarda el array de tareas en localStorage.
// ------------------------------------------------------------
function guardarTareasEnStorage(listaDeTareas: Tarea[]): void {
  localStorage.setItem(CLAVE_LOCAL_STORAGE, JSON.stringify(listaDeTareas));
}

// ------------------------------------------------------------
// FUNCIÓN DE AYUDA: generarIdUnico
// Genera un ID único basado en la fecha actual.
// ------------------------------------------------------------
function generarIdUnico(): string {
  return `tarea-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

// ------------------------------------------------------------
// HOOK: useTasks
// Expone todas las operaciones sobre tareas.
// ------------------------------------------------------------
export function useTasks() {
  const [listaDeTareas, setListaDeTareas] = useState<Tarea[]>(
    cargarTareasDesdeStorage
  );

  // Cada vez que cambia la lista, la guardamos en localStorage
  useEffect(() => {
    guardarTareasEnStorage(listaDeTareas);
  }, [listaDeTareas]);

  // --------------------------------------------------------
  // Tareas activas (no están en la papelera)
  // --------------------------------------------------------
  const tareasActivas = listaDeTareas.filter(
    (tarea) => !tarea.estaEnPapelera
  );

  // --------------------------------------------------------
  // Tareas en la papelera
  // --------------------------------------------------------
  const tareasEnPapelera = listaDeTareas.filter(
    (tarea) => tarea.estaEnPapelera
  );

  // --------------------------------------------------------
  // FUNCIÓN: crearTarea
  // Agrega una tarea nueva al inicio de la lista.
  // --------------------------------------------------------
  function crearTarea(datosNuevos: TareaNueva): void {
    const tareaCompleta: Tarea = {
      id: generarIdUnico(),
      titulo: datosNuevos.titulo,
      descripcion: datosNuevos.descripcion,
      estado: datosNuevos.estado,
      prioridad: datosNuevos.prioridad,
      fechaCreacion: new Date().toLocaleDateString("es-AR"),
      fechaLimite: datosNuevos.fechaLimite,
      progreso: datosNuevos.estado === "completada" ? 100 : 0,
      estaEnPapelera: false,
    };

    setListaDeTareas((anterior) => [tareaCompleta, ...anterior]);
  }

  // --------------------------------------------------------
  // FUNCIÓN: cambiarEstadoTarea
  // Cambia el estado y ajusta el progreso automáticamente.
  // --------------------------------------------------------
  function cambiarEstadoTarea(
    identificador: string,
    nuevoEstado: EstadoTarea
  ): void {
    setListaDeTareas((anterior) =>
      anterior.map((tarea) => {
        if (tarea.id !== identificador) return tarea;

        // Ajuste automático de progreso según el estado
        let progresoNuevo = tarea.progreso;
        if (nuevoEstado === "completada")        progresoNuevo = 100;
        if (nuevoEstado === "pendiente")        progresoNuevo = 0;
        if (nuevoEstado === "en-progreso" && tarea.progreso === 0) {
          progresoNuevo = 10; // Inicia con 10% al pasar a en progreso
        }

        return { ...tarea, estado: nuevoEstado, progreso: progresoNuevo };
      })
    );
  }

  // --------------------------------------------------------
  // FUNCIÓN: actualizarProgreso
  // Actualiza el porcentaje de avance de una tarea.
  // Si llega a 100, cambia el estado a "done" automáticamente.
  // --------------------------------------------------------
  function actualizarProgreso(
    identificador: string,
    porcentajeNuevo: number
  ): void {
    setListaDeTareas((anterior) =>
      anterior.map((tarea) => {
        if (tarea.id !== identificador) return tarea;

        const progresoFinal = Math.min(100, Math.max(0, porcentajeNuevo));
        const estadoFinal: EstadoTarea =
          progresoFinal === 100
            ? "completada"
            : progresoFinal > 0
            ? "en-progreso"
            : "pendiente";

        return { ...tarea, progreso: progresoFinal, estado: estadoFinal };
      })
    );
  }

  // --------------------------------------------------------
  // FUNCIÓN: moverAPapelera
  // Mueve una tarea a la papelera sin borrarla definitivamente.
  // --------------------------------------------------------
  function moverAPapelera(identificador: string): void {
    setListaDeTareas((anterior) =>
      anterior.map((tarea) =>
        tarea.id === identificador
          ? {
              ...tarea,
              estaEnPapelera: true,
              fechaEliminacion: new Date().toLocaleDateString("es-AR"),
            }
          : tarea
      )
    );
  }

  // --------------------------------------------------------
  // FUNCIÓN: restaurarDePapelera
  // Devuelve una tarea de la papelera a la lista activa.
  // --------------------------------------------------------
  function restaurarDePapelera(identificador: string): void {
    setListaDeTareas((anterior) =>
      anterior.map((tarea) =>
        tarea.id === identificador
          ? { ...tarea, estaEnPapelera: false, fechaEliminacion: undefined }
          : tarea
      )
    );
  }

  // --------------------------------------------------------
  // FUNCIÓN: eliminarPermanentemente
  // Borra una tarea de forma definitiva (solo desde papelera).
  // --------------------------------------------------------
  function eliminarPermanentemente(identificador: string): void {
    setListaDeTareas((anterior) =>
      anterior.filter((tarea) => tarea.id !== identificador)
    );
  }

  // --------------------------------------------------------
  // FUNCIÓN: vaciarPapelera
  // Elimina todas las tareas que están en la papelera.
  // --------------------------------------------------------
  function vaciarPapelera(): void {
    setListaDeTareas((anterior) =>
      anterior.filter((tarea) => !tarea.estaEnPapelera)
    );
  }

  return {
    listaDeTareas,
    tareasActivas,
    tareasEnPapelera,
    crearTarea,
    cambiarEstadoTarea,
    actualizarProgreso,
    moverAPapelera,
    restaurarDePapelera,
    eliminarPermanentemente,
    vaciarPapelera,
  };
}