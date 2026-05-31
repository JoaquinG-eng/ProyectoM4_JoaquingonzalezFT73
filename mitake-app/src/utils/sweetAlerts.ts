 import Swal from "sweetalert2";

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
     actions:       "swal-mitake__acciones",
  },
});

export async function alertaLoginExitoso(nombreDelUsuario: string): Promise<void> {
  await SwalMitake.fire({
    icon: "success",
    title: `¡Bienvenido, ${nombreDelUsuario}!`,
    text: "Sesión iniciada correctamente.",
    timer: 1800,
    timerProgressBar: true,
    showConfirmButton: false,
  });
}

export async function alertaRegistroExitoso(nombreDelUsuario: string): Promise<void> {
  await SwalMitake.fire({
    icon: "success",
    title: "¡Cuenta creada!",
    html: `Bienvenido a Mitake, <strong>${nombreDelUsuario}</strong>.`,
    confirmButtonText: "Ir al dashboard →",
  });
}

export async function alertaErrorDeAutenticacion(mensajeDeError: string): Promise<void> {
  await SwalMitake.fire({
    icon: "error",
    title: "Oops...",
    text: mensajeDeError,
    confirmButtonText: "Intentar de nuevo",
  });
}

export async function alertaCierreDeSesion(): Promise<boolean> {
  const resultado = await SwalMitake.fire({
    icon: "question",
    title: "¿Cerrar sesión?",
    text: "Podés volver a iniciar sesión cuando quieras.",
    showCancelButton: true,
    confirmButtonText: "Sí, salir",
    cancelButtonText: "Cancelar",
  });
  return resultado.isConfirmed;
}

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

export async function confirmarVaciarPapelera(cantidadDeElementos: number): Promise<boolean> {
  const resultado = await SwalMitake.fire({
    icon: "warning",
    title: "¿Vaciar la papelera?",
    html: `Se eliminarán <strong>${cantidadDeElementos} tarea${
      cantidadDeElementos !== 1 ? "s" : ""
    }</strong> permanentemente.`,
    showCancelButton: true,
    confirmButtonText: "Sí, vaciar todo",
    cancelButtonText: "Cancelar",
    focusCancel: true,
  });
   return resultado.isConfirmed;
}

export async function alertaRecuperacionEnviada(correoElectronico: string): Promise<void> {
  await SwalMitake.fire({
    icon: "success",
    title: "Email enviado",
    html: `Revisá tu bandeja en <strong>${correoElectronico}</strong>.<br/>
           <span style="font-size:12px;opacity:0.6">Si no aparece, revisá spam.</span>`,
    confirmButtonText: "Entendido",
  });
}

export async function alertaRecuperacionForm(): Promise<string | null> {
  const resultado = await SwalMitake.fire({
    icon: "info",
    title: "Recuperar contraseña",
    text: "Ingresá tu email y te enviamos un link para restablecer tu contraseña.",
    input: "email",
    inputPlaceholder: "tu@email.com",
    inputAttributes: { autocomplete: "email" },
    showCancelButton: true,
    confirmButtonText: "Enviar link",
    cancelButtonText: "Cancelar",
    inputValidator: (valor) => {
      if (!valor) return "Ingresá tu email.";
      if (!/\S+@\S+\.\S+/.test(valor)) return "El email no es válido.";
      return null;
    },
  });

  return resultado.isConfirmed ? resultado.value : null;
}