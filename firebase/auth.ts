import {
  browserLocalPersistence,
  browserSessionPersistence,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  type UserCredential,
} from "firebase/auth";
import { auth } from "./client";

export async function autenticarUsuario(
  correo: string,
  contrasena: string,
): Promise<UserCredential> {
  return signInWithEmailAndPassword(auth, correo, contrasena);
}
