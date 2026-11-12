// components/LoginExam.tsx
"use client";

import { useState, FormEvent } from "react";
import { loginWithEmail } from "@/firebase/auth";

export default function LoginExam() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const validarFormulario = (): boolean => {
    if (!email.trim() || !password.trim()) {
      setError("Por favor, completa todos los campos.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Ingresa un formato de correo electrónico válido.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!validarFormulario()) return;

    setLoading(true);
    try {
      const userCredential = await loginWithEmail(email, password);
      alert(`Bienvenido, ${userCredential.user.email}`);
    } catch (err: unknown) {
      const firebaseError = err as { code?: string; message?: string };
      console.error("Error de Firebase:", firebaseError);

      if (
        firebaseError.code === "auth/invalid-credential" ||
        firebaseError.code === "auth/user-not-found" ||
        firebaseError.code === "auth/wrong-password"
      ) {
        setError("Correo electrónico o contraseña incorrectos.");
      } else if (firebaseError.code === "auth/too-many-requests") {
        setError("Demasiados intentos fallidos. Intenta de nuevo más tarde.");
      } else {
        setError(`Error (${firebaseError.code || "desconocido"}): Verifica tus datos.`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
      <div className="text-center mb-8">
        <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider text-blue-700 uppercase bg-blue-100 rounded-full mb-3">
          Portal Académico
        </span>
        <h1 className="text-2xl font-bold text-slate-800">Iniciar Sesión</h1>
        <p className="text-sm text-slate-500 mt-1">
          Ingresa tus credenciales institucionales para continuar
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-6 p-3.5 rounded-lg bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-medium"
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-slate-700 mb-1.5"
          >
            Correo electrónico
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            placeholder="22280648@web218500.com"
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent disabled:bg-slate-100 transition"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-slate-700 mb-1.5"
          >
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            placeholder="••••••••"
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent disabled:bg-slate-100 transition"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-lg shadow-sm transition duration-150 disabled:opacity-60 disabled:cursor-not-allowed flex justify-center items-center"
        >
          {loading ? "Verificando..." : "Iniciar sesión"}
        </button>
      </form>
    </div>
  );
}