"use client";

import { useMemo, useState } from "react";
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

  const tituloBoton = useMemo(() => {
    return cargando ? "Entrando..." : "Entrar";
  }, [cargando]);

  async function procesarAcceso(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const correoLimpio = correo.trim();
    const contrasenaLimpia = contrasena.trim();

    if (!correoLimpio || !contrasenaLimpia) {
      setError("Por favor completa todos los campos.");
      return;
    }

    if (!esCorreoValido(correoLimpio)) {
      setError("El correo electrónico no tiene un formato válido.");
      return;
    }

    setCargando(true);

    try {
      await configurarPersistencia(recordarme);
      const credencial = await autenticarUsuario(
        correoLimpio,
        contrasenaLimpia,
      );
      setUsuario({ email: credencial.user.email ?? correoLimpio });
      setContrasena("");
    } catch (err) {
      console.error(err);
      setError("No fue posible iniciar sesión.");
    } finally {
      setCargando(false);
    }
  }

  async function salir() {
    try {
      await cerrarSesionUsuario();
    } catch (err) {
      console.error(err);
    } finally {
      setUsuario(null);
      setCorreo("");
      setContrasena("");
      setRecordarme(false);
      setError("");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <section className="w-full max-w-md">
        <div className="rounded-2xl bg-white p-8 shadow-lg ring-1 ring-gray-200">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-gray-900">Acceso escolar</h1>
            <p className="mt-1 text-sm text-gray-500">
              Completa la funcionalidad de inicio de sesión.
            </p>
          </div>

          {!usuario ? (
            <form onSubmit={procesarAcceso} className="space-y-4" noValidate>
              <div>
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
                  autoComplete="email"
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/20"
                />
              </div>

              <div>
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
                  placeholder="******"
                  autoComplete="current-password"
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/20"
                />
              </div>

              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={recordarme}
                  onChange={(event) => setRecordarme(event.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                />
                Recordarme
              </label>

              {error ? (
                <div
                  role="alert"
                  className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
                >
                  {error}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={cargando}
                className="w-full rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900/30 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {tituloBoton}
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-center">
                <p className="text-sm text-emerald-700">
                  Inicio de sesión correcto
                </p>
                <h2 className="mt-1 text-base font-semibold text-emerald-900">
                  Bienvenido, {usuario.email}
                </h2>
              </div>

              <button
                type="button"
                onClick={salir}
                className="w-full rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900/30"
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
