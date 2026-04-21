import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA8IY_Wbh33pdqaaY2kKO54CGifi-fEdPs",
  authDomain: "web-218500.firebaseapp.com",
  projectId: "web-218500",
  appId: "1:539802319607:web:dc04682efd3ffa857531f2",
};

const app: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth: Auth = getAuth(app);
export { app };