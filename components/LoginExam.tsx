"use client";

import { useEffect, useMemo, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/client";
import {
  autenticarUsuario,
  cerrarSesionUsuario,
  configurarPersistencia,
} from "@/firebase/auth";

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
  const [iniciando, setIniciando] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUsuario(firebaseUser?.email ? { email: firebaseUser.email } : null);
      setIniciando(false);
    });
    return () => unsubscribe();
  }, []);

  const tituloBoton = useMemo(() => {
    return cargando ? "Entrando..." : "Entrar";
  }, [cargando]);

  async function procesarAcceso(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (!correo || !contrasena) {
      setError("Por favor completa todos los campos.");
      return;
    }

    if (!esCorreoValido(correo)) {
      setError("El formato del correo electrónico no es válido.");
      return;
    }

    setCargando(true);

    try {
      await configurarPersistencia(recordarme);
      await autenticarUsuario(correo, contrasena);
      // onAuthStateChanged updates `usuario` automatically
    } catch {
      setError("No fue posible iniciar sesión.");
    } finally {
      setCargando(false);
    }
  }

  async function salir() {
    await cerrarSesionUsuario();
    // onAuthStateChanged sets usuario to null automatically
    setCorreo("");
    setContrasena("");
    setRecordarme(false);
  }

  if (iniciando) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
        <span className="text-sm text-gray-400">Cargando...</span>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <section className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-md">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Acceso escolar</h1>
        </div>

        {!usuario ? (
          <form onSubmit={procesarAcceso} noValidate>
            <div className="mb-4">
              <label
                htmlFor="correo"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Correo electrónico
              </label>
              <input
                id="correo"
                type="email"
                value={correo}
                onChange={(event) => setCorreo(event.target.value)}
                placeholder="alumno@correo.com"
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="contrasena"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Contraseña
              </label>
              <input
                id="contrasena"
                type="password"
                value={contrasena}
                onChange={(event) => setContrasena(event.target.value)}
                placeholder="••••"
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400"
              />
            </div>

            <label className="mb-4 flex cursor-pointer items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={recordarme}
                onChange={(event) => setRecordarme(event.target.checked)}
                className="h-4 w-4 rounded border-gray-300 accent-gray-900"
              />
              Recordarme
            </label>

            {error ? (
              <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={cargando}
              className="w-full rounded-md bg-gray-900 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {tituloBoton}
            </button>
          </form>
        ) : (
          <div>
            <div className="mb-6 rounded-lg bg-green-50 px-4 py-5 text-center">
              <p className="mb-1 text-sm text-blue-600">
                Inicio de sesión correcto
              </p>
              <h2 className="text-base font-bold text-gray-900">
                Bienvenido, {usuario.email}
              </h2>
            </div>

            <button
              type="button"
              onClick={salir}
              className="w-full rounded-md bg-gray-900 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700"
            >
              Cerrar sesión
            </button>
          </div>
        )}
      </section>
    </main>
  );
}