import {
  browserLocalPersistence,
  browserSessionPersistence,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  type UserCredential,
} from "firebase/auth";
import { auth } from "./client";

//Configura la persistencia según el estado del checkbox 'Recordarme'.

export async function configurarPersistencia(
  recordarme: boolean,
): Promise<void> {
  // Si recordarme es true, la sesión persiste al cerrar el navegador
  const persistencia = recordarme
    ? browserLocalPersistence
    : browserSessionPersistence;
  await setPersistence(auth, persistencia);
}

//Realiza la autenticación con correo y contraseña.

export async function autenticarUsuario(
  correo: string,
  contrasena: string,
): Promise<UserCredential> {
  return await signInWithEmailAndPassword(auth, correo, contrasena);
}

//Finaliza la sesión del usuario actual.
export async function cerrarSesionUsuario(): Promise<void> {
  await signOut(auth);
}
