import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./client";

export function autenticarUsuario(correo: string, contrasena: string) {
  return signInWithEmailAndPassword(auth, correo, contrasena);
}
