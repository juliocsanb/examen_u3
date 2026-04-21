import {
  browserLocalPersistence,
  browserSessionPersistence,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  type User,
  type UserCredential,
} from "firebase/auth";
import { auth } from "./client";

export async function configurarPersistencia(recordarme: boolean): Promise<void> {
  await setPersistence(
    auth,
    recordarme ? browserLocalPersistence : browserSessionPersistence,
  );
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

export function observarEstadoAuth(
  callback: (usuario: User | null) => void,
): () => void {
  return onAuthStateChanged(auth, callback);
}