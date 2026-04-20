import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { firebaseConfig } from "./config";

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
getApps()[0];

export const auth = getAuth(app);