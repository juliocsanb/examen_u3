"use client";

import { useMemo, useState } from "react";
import { FirebaseError } from "firebase/app";
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
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [recordarme, setRecordarme] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [usuario, setUsuario] = useState<AuthUser | null>(null);

  const labelClass = "block text-sm font-medium text-slate-700";
  const inputClass =
    "w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 disabled:cursor-not-allowed disabled:bg-slate-100";

  const tituloBoton = useMemo(() => {
    return cargando ? "Entrando..." : "Entrar";
  }, [cargando]);

  async function procesarAcceso(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (cargando) return;
    setError("");

    const correoLimpio = correo.trim();

    if (!correoLimpio || !contrasena.trim()) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    if (!esCorreoValido(correoLimpio)) {
      setError("Por favor, ingresa un correo electrónico válido.");
      return;
    }

    setCargando(true);

    try {
      await configurarPersistencia(recordarme);

      const credencial = await autenticarUsuario(correoLimpio, contrasena);
      const emailAutenticado = credencial.user.email ?? correoLimpio;

      setUsuario({ email: emailAutenticado });
      alert(`Bienvenido, ${emailAutenticado}`);
    } catch (err) {
      if (err instanceof FirebaseError) {
        switch (err.code) {
          case "auth/invalid-credential":
          case "auth/user-not-found":
          case "auth/wrong-password":
            setError("Correo electrónico o contraseña incorrectos.");
            break;
          case "auth/too-many-requests":
            setError("Demasiados intentos fallidos. Intenta más tarde.");
            break;
          case "auth/network-request-failed":
            setError("Error de conexión. Verifica tu acceso a internet.");
            break;
          default:
            setError("No se pudo iniciar sesión. Verifica tus credenciales.");
            break;
        }
      } else {
        setError("Ocurrió un error inesperado al iniciar sesión.");
      }
    } finally {
      setCargando(false);
    }
  }

  async function salir() {
    setError("");
    setCargando(true);
    try {
      await cerrarSesionUsuario();
      setUsuario(null);
      setCorreo("");
      setContrasena("");
      setRecordarme(false);
      setMostrarContrasena(false);
    } catch {
      setError("No se pudo cerrar la sesión. Intenta nuevamente.");
    } finally {
      setCargando(false);
    }
  }

  return (
    <main className="flex w-full items-center justify-center px-4 py-12">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-7 text-center">
          <h1 className="text-center text-2xl font-bold tracking-tight text-slate-900">
            Inicio de sesión
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Ingresa tus credenciales para iniciar sesión
          </p>
        </div>

        {!usuario ? (
          <form onSubmit={procesarAcceso} noValidate className="space-y-4">
            <div className="space-y-1.5">
              <label className={labelClass} htmlFor="correo">
                Correo Electrónico
              </label>
              <div className="relative rounded-lg">
                <input
                  className={inputClass}
                  id="correo"
                  name="correo"
                  placeholder="alumno@correo.com"
                  type="email"
                  value={correo}
                  disabled={cargando}
                  onChange={(e) => {
                    setCorreo(e.target.value);
                    if (error) setError("");
                  }}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className={labelClass} htmlFor="contrasena">
                Contraseña
              </label>
              <div className="relative rounded-lg">
                <input
                  className={`${inputClass} pr-16`}
                  id="contrasena"
                  name="contrasena"
                  placeholder="••••••"
                  type={mostrarContrasena ? "text" : "password"}
                  value={contrasena}
                  disabled={cargando}
                  onChange={(e) => {
                    setContrasena(e.target.value);
                    if (error) setError("");
                  }}
                />
                <button
                  type="button"
                  onClick={() => setMostrarContrasena((prev) => !prev)}
                  disabled={cargando}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-xs font-medium text-slate-500 hover:text-slate-800"
                >
                  {mostrarContrasena ? "Ocultar" : "Mostrar"}
                </button>
              </div>
            </div>

            <label className="flex cursor-pointer items-center gap-2 pt-1 text-sm text-slate-600 select-none">
              <input
                type="checkbox"
                checked={recordarme}
                onChange={(e) => setRecordarme(e.target.checked)}
                disabled={cargando}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 disabled:cursor-not-allowed"
              />
              Recordarme
            </label>

            {error ? (
              <div
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700"
              >
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={cargando}
              className="mt-2 w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {tituloBoton}
            </button>
          </form>
        ) : (
          <div className="space-y-5">
            <div className="rounded-lg border border-emerald-200 bg-emerald-50/70 p-4">
              <p className="text-xs font-semibold text-emerald-700">
                Inicio de sesión correcto
              </p>
              <h2 className="mt-1 break-all text-base font-bold text-slate-900">
                Bienvenido, {usuario.email}
              </h2>
            </div>

            <button
              type="button"
              onClick={salir}
              disabled={cargando}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cerrar sesión
            </button>
          </div>
        )}
      </section>
    </main>
  );
}