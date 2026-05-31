import { useState, useEffect } from "react";
import type { User }           from "firebase/auth";
import { escucharCambiosDeSesion } from "../services/authService";

interface ResultadoDeUseAuth {
  usuarioActual:         User | null;
  estaVerificandoSesion: boolean;  
}

export function useAuth(): ResultadoDeUseAuth {
  const [usuarioActual,         setUsuarioActual]         = useState<User | null>(null);
  const [estaVerificandoSesion, setEstaVerificandoSesion] = useState<boolean>(true);

  useEffect(() => {
    const cancelarEscucha = escucharCambiosDeSesion((usuarioDeFirebase) => {
      setUsuarioActual(usuarioDeFirebase);
      setEstaVerificandoSesion(false);
    });
    return () => cancelarEscucha();
  }, []);

  return { usuarioActual, estaVerificandoSesion };
}