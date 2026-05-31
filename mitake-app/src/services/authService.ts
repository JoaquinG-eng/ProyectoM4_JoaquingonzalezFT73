import {createUserWithEmailAndPassword,signInWithEmailAndPassword,signOut,onAuthStateChanged,updateProfile,GoogleAuthProvider,signInWithPopup,sendPasswordResetEmail,} from "firebase/auth";

import type { User } from "firebase/auth";

import { doc, setDoc, serverTimestamp } from "firebase/firestore";

import {
  servicioDeAutenticacion,
  servicioDeBaseDeDatos,
} from "../firebase/firebase";

async function guardarPerfilEnFirestore(
  usuarioDeFirebase: User,
  nombreCompleto?: string
): Promise<void> {
  const referenciaDelDocumento = doc(
    servicioDeBaseDeDatos,
    "usuarios",
    usuarioDeFirebase.uid
  );

  await setDoc(
    referenciaDelDocumento,
    {
      uid:              usuarioDeFirebase.uid,
      nombre:           nombreCompleto ?? usuarioDeFirebase.displayName ?? "Usuario",
      email:            usuarioDeFirebase.email,
      fotoDePerfil:     usuarioDeFirebase.photoURL ?? null,
      fechaDeCreacion:  serverTimestamp(),
      rol:              "usuario",
    },
    { merge: true } 
  );
}

// ------------------------------------------------------------
// FUNCIÓN: registrarUsuarioNuevo
// Crea la cuenta, guarda el nombre y persiste en Firestore.
// ------------------------------------------------------------
export async function registrarUsuarioNuevo(
  correoElectronico: string,
  contrasenia: string,
  nombreCompleto: string
): Promise<User> {
  const resultadoDelRegistro = await createUserWithEmailAndPassword(
    servicioDeAutenticacion,
    correoElectronico,
    contrasenia
  );

  await updateProfile(resultadoDelRegistro.user, {
    displayName: nombreCompleto,
  });

  await guardarPerfilEnFirestore(resultadoDelRegistro.user, nombreCompleto);

  return resultadoDelRegistro.user;
}

// ------------------------------------------------------------
// FUNCIÓN: iniciarSesionConEmail
// ------------------------------------------------------------
export async function iniciarSesionConEmail(
  correoElectronico: string,
  contrasenia: string
): Promise<User> {
  const resultadoDelLogin = await signInWithEmailAndPassword(
    servicioDeAutenticacion,
    correoElectronico,
    contrasenia
  );

  return resultadoDelLogin.user;
}

// ------------------------------------------------------------
// FUNCIÓN: iniciarSesionConGoogle
// Abre el popup de Google y si es la primera vez guarda
// el perfil en Firestore automáticamente.
// ------------------------------------------------------------
export async function iniciarSesionConGoogle(): Promise<User> {
  const proveedorDeGoogle = new GoogleAuthProvider();

  const resultadoDelLogin = await signInWithPopup(
    servicioDeAutenticacion,
    proveedorDeGoogle
  );

  await guardarPerfilEnFirestore(resultadoDelLogin.user);

  return resultadoDelLogin.user;
}

// ------------------------------------------------------------
// FUNCIÓN: enviarEmailDeRecuperacion
// Firebase envía el email automáticamente — no necesita AWS.
// ------------------------------------------------------------
export async function enviarEmailDeRecuperacion(
  correoElectronico: string
): Promise<void> {
  await sendPasswordResetEmail(servicioDeAutenticacion, correoElectronico);
}

// ------------------------------------------------------------
// FUNCIÓN: cerrarSesionDelUsuario
// ------------------------------------------------------------
export async function cerrarSesionDelUsuario(): Promise<void> {
  await signOut(servicioDeAutenticacion);
}

// ------------------------------------------------------------
// FUNCIÓN: escucharCambiosDeSesion
// ------------------------------------------------------------
export function escucharCambiosDeSesion(
  funcionAlCambiar: (usuarioActual: User | null) => void
): () => void {
  return onAuthStateChanged(servicioDeAutenticacion, funcionAlCambiar);
}

export function obtenerMensajeDeError(codigoDeError: string): string {
  const mensajes: Record<string, string> = {
    "auth/email-already-in-use":   "Este correo ya está registrado.",
    "auth/invalid-email":          "El correo electrónico no es válido.",
    "auth/weak-password":          "La contraseña debe tener al menos 6 caracteres.",
    "auth/user-not-found":         "No existe una cuenta con este correo.",
    "auth/wrong-password":         "La contraseña es incorrecta.",
    "auth/too-many-requests":      "Demasiados intentos. Esperá unos minutos.",
    "auth/network-request-failed": "Error de red. Verificá tu conexión.",
    "auth/invalid-credential":     "El correo o la contraseña son incorrectos.",
    "auth/popup-closed-by-user":   "Cerraste la ventana de Google antes de completar.",
    "auth/popup-blocked":          "El navegador bloqueó la ventana. Permití popups para este sitio.",
  };

  return mensajes[codigoDeError] ?? "Ocurrió un error inesperado.";
}