"use client";

import { FirebaseError } from "firebase/app";
import { useRef, useState, type FormEvent } from "react";
import { autenticarUsuario } from "@/firebase/auth";

function mensajeDeAcceso(error: unknown): string {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case "auth/invalid-credential":
      case "auth/user-not-found":
      case "auth/wrong-password":
      case "auth/user-disabled":
        return "No pudimos iniciar sesión con ese correo y contraseña.";
      case "auth/network-request-failed":
        return "Revisa tu conexión a internet y vuelve a intentarlo.";
      case "auth/too-many-requests":
        return "Hubo demasiados intentos. Espera un momento y vuelve a intentarlo.";
    }
  }

  return "No se pudo iniciar sesión. Inténtalo de nuevo.";
}

const claseCampo =
  "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 outline-none placeholder:text-slate-500 focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20";

export default function LoginExam() {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const envioEnCurso = useRef(false);

  async function procesarAcceso(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (envioEnCurso.current) return;

    setError("");
    const correoLimpio = correo.trim();

    if (!correoLimpio || !contrasena.trim()) {
      setError("Escribe tu correo electrónico y contraseña.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correoLimpio)) {
      setError("Escribe un correo electrónico válido.");
      return;
    }

    envioEnCurso.current = true;
    setCargando(true);

    try {
      const { user } = await autenticarUsuario(correoLimpio, contrasena);
      setContrasena("");
      window.alert(`Bienvenido, ${user.email}`);
    } catch (error) {
      setError(mensajeDeAcceso(error));
    } finally {
      envioEnCurso.current = false;
      setCargando(false);
    }
  }

  return (
    <main className="grid min-h-dvh place-items-center bg-slate-100 px-4 py-8 text-slate-900 sm:px-8">
      <section
        aria-labelledby="titulo-acceso"
        className="grid w-full max-w-4xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10 md:grid-cols-[2fr_3fr]"
      >
        <header className="flex flex-col justify-center gap-6 bg-slate-950 px-6 py-8 text-white sm:px-10 md:min-h-[30rem]">
          <div aria-hidden="true" className="h-1 w-10 rounded-full bg-teal-400" />
          <div>
            <h2 className="max-w-xs text-2xl font-semibold tracking-tight sm:text-3xl">
              Instituto Tecnológico de Toluca
            </h2>
            <p className="mt-3 text-sm text-teal-200">Programación Web</p>
          </div>
        </header>

        <div className="px-6 py-8 sm:px-10 md:px-12 md:py-14">
          <h1 id="titulo-acceso" className="text-3xl font-semibold tracking-tight">
            Iniciar sesión
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Usa el correo y la contraseña que te proporcionó tu profesor.
          </p>

          <form noValidate onSubmit={procesarAcceso} className="mt-7 space-y-5">
            <div>
              <label htmlFor="correo" className="mb-2 block text-sm font-medium">
                Correo electrónico
              </label>
              <input
                id="correo"
                name="correo"
                type="email"
                autoComplete="username"
                required
                value={correo}
                onChange={(evento) => setCorreo(evento.target.value)}
                className={claseCampo}
              />
            </div>

            <div>
              <label htmlFor="contrasena" className="mb-2 block text-sm font-medium">
                Contraseña
              </label>
              <input
                id="contrasena"
                name="contrasena"
                type="password"
                autoComplete="current-password"
                required
                value={contrasena}
                onChange={(evento) => setContrasena(evento.target.value)}
                className={claseCampo}
              />
            </div>

            {error && (
              <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={cargando}
              className="w-full rounded-xl bg-teal-800 px-4 py-3 font-semibold text-white transition-colors enabled:cursor-pointer enabled:hover:bg-teal-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 disabled:cursor-wait disabled:opacity-60"
            >
              {cargando ? "Iniciando sesión…" : "Iniciar sesión"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
