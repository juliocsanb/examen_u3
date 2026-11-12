"use client";

import { useState } from "react";
import { autenticarUsuario } from "@/firebase/auth";

function esCorreoValido(correo: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
}

function mensajeDeError(error: unknown): string {
  const codigo = (error as { code?: string })?.code;

  switch (codigo) {
    case "auth/invalid-email":
      return "El formato del correo no es válido.";
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Correo o contraseña incorrectos.";
    case "auth/too-many-requests":
      return "Demasiados intentos. Intenta de nuevo más tarde.";
    default:
      return "No se pudo iniciar sesión. Intenta de nuevo.";
  }
}

export default function LoginExam() {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  async function procesarAcceso(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (cargando) {
      return;
    }

    setError("");

    if (!correo.trim() || !contrasena.trim()) {
      setError("Completa correo y contraseña.");
      return;
    }

    if (!esCorreoValido(correo)) {
      setError("Ingresa un correo electrónico válido.");
      return;
    }

    setCargando(true);

    try {
      await autenticarUsuario(correo.trim(), contrasena);
      window.alert(`Bienvenido, ${correo.trim()}`);
    } catch (errorAutenticacion) {
      setError(mensajeDeError(errorAutenticacion));
    } finally {
      setCargando(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-md">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-slate-900">Acceso escolar</h1>
          <p className="mt-1 text-sm text-slate-500">
            Ingresa tu correo y contraseña para continuar.
          </p>
        </div>

        <form onSubmit={procesarAcceso} className="space-y-4" noValidate>
          <div>
            <label htmlFor="correo" className="mb-1 block text-sm font-medium text-slate-700">
              Correo electrónico
            </label>
            <input
              id="correo"
              type="email"
              value={correo}
              onChange={(event) => setCorreo(event.target.value)}
              placeholder="alumno@correo.com"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="contrasena" className="mb-1 block text-sm font-medium text-slate-700">
              Contraseña
            </label>
            <input
              id="contrasena"
              type="password"
              value={contrasena}
              onChange={(event) => setContrasena(event.target.value)}
              placeholder="******"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {error ? (
            <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={cargando}
            className="w-full rounded-lg bg-blue-600 py-2 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {cargando ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </section>
    </main>
  );
}
