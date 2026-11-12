// firebase/client.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { firebaseConfig } from "./config";

export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();