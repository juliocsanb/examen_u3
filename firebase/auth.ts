import {
  browserLocalPersistence,
  browserSessionPersistence,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  type UserCredential,
} from "firebase/auth";
import { auth } from "./client";

export async function configurarPersistencia(
  recordarme: boolean,
): Promise<void> {}

export async function autenticarUsuario(
  correo: string,
  contrasena: string,
): Promise<UserCredential> {
  throw new Error(
    "Función no implementada. Debes implementar la autenticación de usuario.",
  );
}

export async function cerrarSesionUsuario(): Promise<void> {
  // TODO: implementar cierre de sesión.
}
