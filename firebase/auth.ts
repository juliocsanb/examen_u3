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
  const persistencia = recordarme ? browserLocalPersistence : browserSessionPersistence;

  try {
    await setPersistence(auth, persistencia);
  } catch (error) {
    console.error("Error al configurar la persistencia:", error);
    throw error;
  }
}

export async function autenticarUsuario(
  correo: string,
  contrasena: string,
): Promise<UserCredential> {
  // Inicio de sesión con Firebase Authentication
  try {
    const userCredential = await signInWithEmailAndPassword(auth, correo, contrasena);
    return userCredential;
  } catch (error) {
    // captura de error
    throw error;
  }
}

export async function cerrarSesionUsuario(): Promise<void> {
  // cierrre de sesion
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    throw error;
  }
}