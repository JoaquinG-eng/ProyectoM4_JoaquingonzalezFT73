// ============================================================
// ARCHIVO: src/utils/sweetAlerts.ts
// ¿Para qué sirve? Centraliza todas las llamadas a SweetAlert2
// con el tema oscuro de Mitake ya aplicado.
// ============================================================

import Swal from "sweetalert2";

// ------------------------------------------------------------
// BASE: instancia con el tema Mitake aplicado a todos los popups
// ------------------------------------------------------------
const SwalMitake = Swal.mixin({
  background: "#1a1726",
  color: "#ffffff",
  backdrop: "rgba(0, 0, 0, 0.65)",
  customClass: {
    popup:         "swal-mitake__popup",
    title:         "swal-mitake__titulo",
    htmlContainer: "swal-mitake__contenido",
    confirmButton: "swal-mitake__boton-confirmar",
    cancelButton:  "swal-mitake__boton-cancelar",
    icon:          "swal-mitake__icono",
    actions:       "swal-mitake__acciones",
  },
});

// ============================================================
// AUTENTICACIÓN
// ============================================================

// ------------------------------------------------------------
// Login exitoso — se llama ANTES del callback alIniciarSesion
// ------------------------------------------------------------
export async function alertaLoginExitoso(
  nombreDelUsuario: string
): Promise<void> {
  await SwalMitake.fire({
    icon: "success",
    title: `¡Bienvenido, ${nombreDelUsuario}!`,
    text: "Sesión iniciada correctamente.",
    timer: 1800,
    timerProgressBar: true,
    showConfirmButton: false,
  });
}

// ------------------------------------------------------------
// Registro exitoso — se llama ANTES del callback alRegistrarse
// ------------------------------------------------------------
export async function alertaRegistroExitoso(
  nombreDelUsuario: string
): Promise<void> {
  await SwalMitake.fire({
    icon: "success",
    title: "¡Cuenta creada!",
    html: `Bienvenido a Mitake, <strong>${nombreDelUsuario}</strong>.<br/>Tu cuenta fue creada correctamente.`,
    confirmButtonText: "Ir al dashboard →",
  });
}

// ------------------------------------------------------------
// Error de autenticación — reemplaza el setError inline
// ------------------------------------------------------------
export async function alertaErrorDeAutenticacion(
  mensajeDeError: string
): Promise<void> {
  await SwalMitake.fire({
    icon: "error",
    title: "Oops...",
    text: mensajeDeError,
    confirmButtonText: "Intentar de nuevo",
  });
}

// ============================================================
// ACCIONES DESTRUCTIVAS — devuelven boolean
// ============================================================

// ------------------------------------------------------------
// Confirmar antes de eliminar una tarea para siempre
// ------------------------------------------------------------
export async function confirmarEliminarPermanentemente(
  tituloDelElemento: string
): Promise<boolean> {
  const resultado = await SwalMitake.fire({
    icon: "warning",
    title: "¿Eliminar para siempre?",
    html: `La tarea <strong>"${tituloDelElemento}"</strong> se borrará definitivamente.<br/>Esta acción no se puede deshacer.`,
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
    focusCancel: true,
  });

  return resultado.isConfirmed;
}

// ------------------------------------------------------------
// Confirmar antes de vaciar toda la papelera
// ------------------------------------------------------------
export async function confirmarVaciarPapelera(
  cantidadDeElementos: number
): Promise<boolean> {
  const resultado = await SwalMitake.fire({
    icon: "warning",
    title: "¿Vaciar la papelera?",
    html: `Se eliminarán <strong>${cantidadDeElementos} tarea${
      cantidadDeElementos !== 1 ? "s" : ""
    }</strong> permanentemente.<br/>Esta acción no se puede deshacer.`,
    showCancelButton: true,
    confirmButtonText: "Sí, vaciar todo",
    cancelButtonText: "Cancelar",
    focusCancel: true,
  });

  return resultado.isConfirmed;
}