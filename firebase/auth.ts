// firebase/auth.ts
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "./client";

export const auth = getAuth(app);

export const loginWithEmail = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};