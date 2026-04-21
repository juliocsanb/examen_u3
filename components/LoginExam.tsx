"use client";

import { useEffect, useMemo, useState } from "react";
import type { User } from "firebase/auth";
import {
  autenticarUsuario,
  cerrarSesionUsuario,
  configurarPersistencia,
  mapAuthError,
  onAuthChanged,
} from "@/firebase/auth";

const STORAGE_KEY = "rememberedEmail";

function esCorreoValido(correo: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
}

export default function LoginExam() {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [recordarme, setRecordarme] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [usuario, setUsuario] = useState<User | null>(null);

  const tituloBoton = useMemo(() => {
    return cargando ? "Procesando..." : "Entrar";
  }, [cargando]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const guardado = window.localStorage.getItem(STORAGE_KEY);
    if (guardado) {
      setCorreo(guardado);
      setRecordarme(true);
    }
  }, []);

  useEffect(() => {
    const unsub = onAuthChanged((u) => setUsuario(u));
    return () => unsub();
  }, []);

  async function procesarAcceso(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!correo.trim() || !contrasena.trim()) {
      setError("Todos los campos son obligatorios");
      return;
    }

    if (!esCorreoValido(correo)) {
      setError("Correo inválido");
      return;
    }

    setCargando(true);
    try {
      await configurarPersistencia(recordarme);
      await autenticarUsuario(correo, contrasena);

      if (typeof window !== "undefined") {
        if (recordarme) {
          window.localStorage.setItem(STORAGE_KEY, correo);
        } else {
          window.localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code ?? "";
      setError(mapAuthError(code));
    } finally {
      setCargando(false);
    }
  }

  async function salir() {
    try {
      await cerrarSesionUsuario();
      setContrasena("");
      setError("");
    } catch {
      setError("No fue posible cerrar sesión");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <section className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-sm">
        <div className="mb-6 text-center">
          <h1 className="text-xl font-bold text-gray-900">Acceso escolar</h1>
          <p className="mt-1 text-sm text-gray-500">
            Completa la funcionalidad de inicio de sesión
          </p>
        </div>

        {usuario ? (
          <div className="space-y-4">
            <div className="rounded-md border border-green-200 bg-green-50 p-4 text-center">
              <p className="text-sm text-green-700">Inicio de sesión correcto</p>
              <p className="mt-1 font-bold text-gray-900">
                Bienvenido, {usuario.email}
              </p>
            </div>
            <button
              type="button"
              onClick={salir}
              className="w-full rounded-md bg-slate-900 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
            >
              Cerrar sesión
            </button>
          </div>
        ) : (
          <form onSubmit={procesarAcceso} className="space-y-4" noValidate>
            <div>
              <label
                htmlFor="correo"
                className="mb-1 block text-sm text-gray-700"
              >
                Correo electrónico
              </label>
              <input
                id="correo"
                type="text"
                value={correo}
                onChange={(event) => setCorreo(event.target.value)}
                placeholder="alumno@correo.com"
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                autoComplete="email"
              />
            </div>

            <div>
              <label
                htmlFor="contrasena"
                className="mb-1 block text-sm text-gray-700"
              >
                Contraseña
              </label>
              <input
                id="contrasena"
                type="password"
                value={contrasena}
                onChange={(event) => setContrasena(event.target.value)}
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                autoComplete="current-password"
              />
            </div>

            <label
              htmlFor="recordarme"
              className="flex items-center gap-2 text-sm text-gray-700"
            >
              <input
                id="recordarme"
                type="checkbox"
                checked={recordarme}
                onChange={(event) => setRecordarme(event.target.checked)}
                className="rounded border-gray-300"
              />
              Recordarme
            </label>

            {error ? (
              <div
                role="alert"
                className="rounded-md border border-red-200 bg-red-50 p-2 text-center text-sm text-red-700"
              >
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={cargando}
              className="w-full rounded-md bg-slate-900 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/10 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {tituloBoton}
            </button>
          </form>
        )}
      </section>
    </main>
  );
}