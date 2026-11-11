import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { firebaseConfig } from "./config";
console.log("Validando API KEY:", process.env.NEXT_PUBLIC_API_KEY);
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);