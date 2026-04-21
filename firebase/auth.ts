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
  if (recordarme === true) {
    await setPersistence(auth, browserLocalPersistence);
  } else {
    await setPersistence(auth, browserSessionPersistence);
  }
}

export async function autenticarUsuario(
  correo: string,
  contrasena: string,
): Promise<UserCredential> {
  return signInWithEmailAndPassword(auth, correo, contrasena);
}

export async function cerrarSesionUsuario(): Promise<void> {
  await signOut(auth);
}
