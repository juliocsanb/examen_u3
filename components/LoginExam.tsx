"use client";

import { useMemo, useState } from "react";
import {
  autenticarUsuario,
  cerrarSesionUsuario,
  configurarPersistencia,
} from "@/firebase/auth";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/client";
import { getDisplayName } from "next/dist/shared/lib/utils";

import { signInWithEmailAndPassword } from "firebase/auth";
type AuthUser = {
  email: string;
};

function esCorreoValido(correo: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
}

export default function LoginExam() {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [recordarme, setRecordarme] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [usuario, setUsuario] = useState<AuthUser | null>(null);

  const [mostrarCuadroBienvenida, setCuadroBienvenida] = useState(false);
  const tituloBoton = useMemo(() => {
    return cargando ? "Entrando..." : "Entrar";
  }, [cargando]);

  async function procesarAcceso(event: React.FormEvent<HTMLFormElement>) {
    setError("");
    event.preventDefault();
    try {
      const result = await signInWithEmailAndPassword(auth, correo, contrasena);
      setCuadroBienvenida(true);
      setUsuario({ email: "" }); // Solo activamos el estado
    } catch (error) {
      console.log("Error de firebase, contacta la administrador", error);
      setError("No se pudo crear la cuenta. Revisa tu correo y constraseña");
    }
  }

  async function salir() {
    // TODO: cerrar sesión en Firebase.
    // TODO: limpiar el usuario en estado.
    // TODO: limpiar formulario si se desea.
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-900">
      <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl ring-1 ring-gray-900/5 dark:bg-gray-800 dark:ring-white/10">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Acceso escolar
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Completa la funcionalidad de inicio de sesión.
          </p>
        </div>

        {!usuario ? (
          <form onSubmit={procesarAcceso} className="space-y-6">
            <div>
              <label
                htmlFor="correo"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Correo electrónico
              </label>
              <div className="mt-1">
                <input
                  id="correo"
                  type="email"
                  value={correo}
                  onChange={(event) => setCorreo(event.target.value)}
                  placeholder="alumno@correo.com"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder-gray-500"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="contrasena"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Contraseña
              </label>
              <div className="mt-1">
                <input
                  id="contrasena"
                  type="password"
                  value={contrasena}
                  onChange={(event) => setContrasena(event.target.value)}
                  placeholder="******"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder-gray-500"
                />
              </div>
            </div>

            <div className="flex items-center">
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer dark:text-gray-400">
                <input
                  type="checkbox"
                  checked={recordarme}
                  onChange={(event) => setRecordarme(event.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900"
                />
                Recordarme
              </label>
            </div>

            {error ? (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200 dark:bg-red-950/50 dark:border-red-900 dark:text-red-400">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={cargando}
              className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 transition"
            >
              {tituloBoton}
            </button>
          </form>
        ) : (
          <div className="space-y-6 text-center">
            <div className="rounded-lg bg-green-50 p-4 border border-green-200 dark:bg-green-950/30 dark:border-green-900">
              <p className="text-sm font-medium text-green-800 dark:text-green-400">
                Inicio de sesión correcto
              </p>
              <h2 className="mt-1 text-lg font-bold text-gray-900 dark:text-white">
                Bienvenido, {usuario.email}
              </h2>
            </div>

            <button
              type="button"
              onClick={salir}
              className="w-full rounded-lg border border-gray-300 bg-white py-2.5 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 transition"
            >
              Cerrar sesión
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
