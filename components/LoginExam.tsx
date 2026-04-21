"use client";

import { useEffect, useMemo, useState } from "react";
import {
  autenticarUsuario,
  cerrarSesionUsuario,
  configurarPersistencia,
  observarEstadoAuth,
} from "@/firebase/auth";

type AuthUser = {
  email: string;
};

function esCorreoValido(correo: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
}

function obtenerMensajeError(error: unknown): string {
  const code =
    typeof error === "object" && error && "code" in error
      ? String((error as { code?: unknown }).code)
      : "";

  switch (code) {
    case "auth/invalid-email":
      return "El correo no tiene un formato valido.";
    case "auth/invalid-credential":
      return "Correo o contrasena incorrectos.";
    case "auth/user-not-found":
      return "No existe una cuenta con ese correo.";
    case "auth/wrong-password":
      return "La contrasena no es correcta.";
    case "auth/too-many-requests":
      return "Demasiados intentos. Intenta de nuevo mas tarde.";
    case "auth/network-request-failed":
      return "No hay conexion. Revisa tu internet e intenta otra vez.";
    default:
      return "No se pudo iniciar sesion. Intenta nuevamente.";
  }
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

  useEffect(() => {
    const desuscribir = observarEstadoAuth((authUser) => {
      if (authUser?.email) {
        setUsuario({ email: authUser.email });
        return;
      }

      setUsuario(null);
    });

    return () => desuscribir();
  }, []);

  async function procesarAcceso(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const correoNormalizado = correo.trim().toLowerCase();

    if (!correoNormalizado || !contrasena.trim()) {
      setError("Completa correo y contrasena.");
      return;
    }

    if (!esCorreoValido(correoNormalizado)) {
      setError("Ingresa un correo electronico valido.");
      return;
    }

    setCargando(true);

    try {
      await configurarPersistencia(recordarme);
      const credential = await autenticarUsuario(correoNormalizado, contrasena);
      setUsuario({ email: credential.user.email ?? correoNormalizado });
    } catch (error) {
      setError(obtenerMensajeError(error));
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
      setContrasena("");
    } catch {
      setError("No se pudo cerrar sesion. Intenta nuevamente.");
    } finally {
      setCargando(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_10%_10%,#1d4ed8_0%,#0a1022_45%,#05070f_100%)] px-4 py-10">
      <div className="pointer-events-none absolute -left-24 top-8 h-56 w-56 rounded-full bg-orange-500/25 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-8 h-64 w-64 rounded-full bg-blue-400/20 blur-3xl" />

      <section className="relative w-full max-w-md rounded-2xl border border-white/20 bg-white/95 p-6 shadow-2xl backdrop-blur sm:p-8">
        <div className="mb-7 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
            Portal escolar
          </p>
          <h1 className="text-2xl font-extrabold text-slate-950 sm:text-3xl">
            Inicio de sesion
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Ingresa con tu cuenta para acceder al panel.
          </p>
        </div>

        {!usuario ? (
          <form onSubmit={procesarAcceso} className="space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor="correo"
                className="text-sm font-semibold text-slate-900"
              >
                Correo electronico
              </label>
              <input
                id="correo"
                type="email"
                value={correo}
                onChange={(event) => setCorreo(event.target.value)}
                placeholder="alumno@correo.com"
                disabled={cargando}
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-700/20 disabled:cursor-not-allowed disabled:bg-slate-100"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="contrasena"
                className="text-sm font-semibold text-slate-900"
              >
                Contrasena
              </label>
              <input
                id="contrasena"
                type="password"
                value={contrasena}
                onChange={(event) => setContrasena(event.target.value)}
                placeholder="******"
                disabled={cargando}
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-700/20 disabled:cursor-not-allowed disabled:bg-slate-100"
              />
            </div>

            <label className="mt-1 flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={recordarme}
                onChange={(event) => setRecordarme(event.target.checked)}
                disabled={cargando}
                className="h-4 w-4 accent-blue-700"
              />
              Recordarme
            </label>

            {error ? (
              <div className="rounded-lg border border-orange-300 bg-orange-50 px-3 py-2 text-sm text-orange-800">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={cargando}
              className="mt-2 w-full rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {tituloBoton}
            </button>
          </form>
        ) : (
          <div className="space-y-5">
            <div className="rounded-xl border border-blue-100 bg-blue-50/80 p-4">
              <p className="text-sm font-semibold text-blue-700">
                Inicio de sesion correcto
              </p>
              <h2 className="mt-1 text-xl font-bold text-slate-950">
                Bienvenido, {usuario.email}
              </h2>
              <p className="mt-2 text-sm text-slate-700">
                Tu acceso fue validado correctamente.
              </p>
            </div>

            {error ? (
              <div className="rounded-lg border border-orange-300 bg-orange-50 px-3 py-2 text-sm text-orange-800">
                {error}
              </div>
            ) : null}

            <button
              type="button"
              onClick={salir}
              disabled={cargando}
              className="w-full rounded-xl bg-black px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cerrar sesión
            </button>
          </div>
        )}
      </section>
    </main>
  );
}