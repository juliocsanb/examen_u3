const apiKey =
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? process.env.FIREBASE_API_KEY;
const authDomain =
  process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ??
  process.env.FIREBASE_AUTH_DOMAIN;
const projectId =
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? process.env.FIREBASE_PROJECT_ID;
const appId =
  process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? process.env.FIREBASE_APP_ID;

export const firebaseConfig = {
  apiKey: apiKey ?? "",
  authDomain: authDomain ?? "",
  projectId: projectId ?? "",
  appId: appId ?? "",
};