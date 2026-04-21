import {
  browserLocalPersistence,
  browserSessionPersistence,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  type UserCredential,
} from "firebase/auth";
import { auth } from "./client";

export async function configurarPersistencia(recordarme: boolean): Promise<void> {
  // TODO: implementar persistencia según el valor de recordarme.
  // Si recordarme es true, usar browserLocalPersistence.
  // Si recordarme es false, usar browserSessionPersistence.
}

export async function autenticarUsuario(
  correo: string,
  contrasena: string,
): Promise<UserCredential> {
  return await signInWithEmailAndPassword(auth, correo, contrasena);
}


export async function cerrarSesionUsuario(): Promise<void> {
   await signOut(auth);
  // TODO: implementar cierre de sesión.
}