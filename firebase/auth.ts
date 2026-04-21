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

export function mapAuthError(code: string): string {
  const map: Record<string, string> = {
    "auth/invalid-email": "Correo inválido",
    "auth/missing-password": "La contraseña es requerida",
    "auth/user-not-found": "Usuario no encontrado",
    "auth/wrong-password": "Contraseña incorrecta",
    "auth/invalid-credential": "Credenciales inválidas",
    "auth/too-many-requests": "Demasiados intentos, espera un momento",
    "auth/network-request-failed": "Error de red, revisa tu conexión",
  };
  return map[code] ?? "No fue posible iniciar sesión";
}

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

export function onAuthChanged(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}