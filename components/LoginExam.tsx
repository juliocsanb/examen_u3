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

    // TODO: limpiar errores previos.
    setError("");

    // TODO: validar campos vacíos.
    if (!correo.trim() || !contrasena.trim()) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    // TODO: validar formato de correo.
    if (!esCorreoValido(correo)) {
      setError("El formato del correo electrónico no es válido.");
      return;
    }

    // TODO: activar estado de carga.
    setCargando(true);

    try {
      // TODO: configurar persistencia según recordarme.
      await configurarPersistencia(recordarme);

      // TODO: autenticar usuario.
      const res = await autenticarUsuario(correo, contrasena);

      // TODO: guardar usuario autenticado en estado.
      setUsuario({ email: res.user.email || "" });
    } catch (err: unknown) {
      // TODO: manejar errores y mostrarlos en pantalla.
      setError("Acceso denegado. Revisa tus credenciales.");
      console.error(err);
    } finally {
      // TODO: limpiar estado de carga.
      setCargando(false);
    }
  }

  async function salir() {
    try {
      // TODO: cerrar sesión en Firebase.
      await cerrarSesionUsuario();

      // TODO: limpiar el usuario en estado.
      setUsuario(null);

      // TODO: limpiar formulario si se desea.
      setCorreo("");
      setContrasena("");
      setRecordarme(false);
    } catch (err) {
      console.error("Error al cerrar sesión", err);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12">
      <section className="w-full max-w-md bg-slate-900 p-8 rounded-2xl shadow-2xl border border-slate-800">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Acceso examen
          </h1>
          <p className="text-slate-400 mt-2 text-sm">
            Examen inicio de sesión - Unidad 3 - Gerardo Pérez
          </p>
        </div>

        {!usuario ? (
          <form onSubmit={procesarAcceso} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5 text-left">
              <label
                htmlFor="correo"
                className="text-sm font-semibold text-slate-300"
              >
                Correo electrónico
              </label>
              <input
                id="correo"
                type="email"
                className="w-full p-3 bg-slate-950 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-600 text-white"
                value={correo}
                onChange={(event) => setCorreo(event.target.value)}
                placeholder="alumno@web218500.com"
              />
            </div>

            <div className="flex flex-col gap-1.5 text-left">
              <label
                htmlFor="contrasena"
                className="text-sm font-semibold text-slate-300"
              >
                Contraseña
              </label>
              <input
                id="contrasena"
                type="password"
                className="w-full p-3 bg-slate-950 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-600 text-white"
                value={contrasena}
                onChange={(event) => setContrasena(event.target.value)}
                placeholder="******"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                id="recordarme"
                type="checkbox"
                className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-indigo-500 focus:ring-indigo-600 cursor-pointer"
                checked={recordarme}
                onChange={(event) => setRecordarme(event.target.checked)}
              />
              <label
                htmlFor="recordarme"
                className="text-sm text-slate-400 cursor-pointer select-none"
              >
                Recordarme
              </label>
            </div>

            {error && (
              <div className="p-3 bg-red-900/20 border border-red-900/50 text-red-400 text-xs rounded-lg border-l-4 border-l-red-500">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={cargando}
              className="w-full py-3 px-4 bg-white hover:bg-slate-200 disabled:bg-slate-700 disabled:text-slate-500 text-slate-950 font-bold rounded-lg shadow-sm transition-all active:scale-[0.98]"
            >
              {tituloBoton}
            </button>
          </form>
        ) : (
          <div className="flex flex-col gap-6 text-center py-4">
            <div className="p-5 bg-emerald-900/20 border border-emerald-900/50 rounded-xl">
              <p className="text-emerald-400 text-sm font-medium mb-1">
                Inicio de sesión correcto
              </p>
              <h2 className="text-xl font-bold text-white break-words">
                Bienvenido, {usuario.email}
              </h2>
            </div>

            <button
              type="button"
              onClick={salir}
              className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg transition-all shadow-md active:scale-[0.98] border border-slate-700"
            >
              Cerrar sesión
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
