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

    if (!correo || !contrasena) {
      setError("Por favor, complete todos los campos.");
      return;
    }

    if (!esCorreoValido(correo)) {
      setError("Por favor, ingrese un correo electrónico válido.");
      return;
    }

    try {
      setCargando(true);

      if (configurarPersistencia) {
        await configurarPersistencia(recordarme);
      }

      const usuarioAutenticado = await autenticarUsuario(correo, contrasena);

      setUsuario({
        email: usuarioAutenticado?.user?.email || correo,
      });
    } catch (err: any) {
      setError(err?.message || "Ocurrió un error al intentar iniciar sesión.");
    } finally {
      setCargando(false);
    }
  }

  async function salir() {
    try {
      if (cerrarSesionUsuario) {
        await cerrarSesionUsuario();
      }
    } catch (err: any) {
      console.error("Error al cerrar sesión:", err);
    } finally {
      setUsuario(null);
      setCorreo("");
      setContrasena("");
      setRecordarme(false);
      setError("");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0b0f19] px-4 text-slate-100">
      <section className="w-full max-w-md rounded-xl border border-slate-800 bg-[#1E1E24] p-8 shadow-2xl">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Acceso escolar
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Completa la funcionalidad de inicio de sesión.
          </p>
        </div>

        {!usuario ? (
          <form onSubmit={procesarAcceso} className="space-y-5">
            <div>
              <label
                htmlFor="correo"
                className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-300"
              >
                Correo electrónico
              </label>
              <input
                id="correo"
                type="email"
                value={correo}
                onChange={(event) => setCorreo(event.target.value)}
                placeholder="alumno@correo.com"
                className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="contrasena"
                className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-300"
              >
                Contraseña
              </label>
              <input
                id="contrasena"
                type="password"
                value={contrasena}
                onChange={(event) => setContrasena(event.target.value)}
                placeholder="******"
                className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-slate-300">
                <input
                  type="checkbox"
                  checked={recordarme}
                  onChange={(event) => setRecordarme(event.target.checked)}
                  className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-900"
                />
                Recordarme
              </label>
            </div>

            {error && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={cargando}
              className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50"
            >
              {tituloBoton}
            </button>
          </form>
        ) : (
          <div className="space-y-6 text-center">
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                Inicio de sesión correcto
              </p>
              <h2 className="mt-2 text-lg font-semibold text-white">
                Bienvenido, {usuario.email}
              </h2>
            </div>

            <button
              type="button"
              onClick={salir}
              className="w-full rounded-lg border border-slate-700 bg-slate-800/60 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-slate-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-slate-500"
            >
              Cerrar sesión
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
