"use client";

import { useState } from "react";
import {
  autenticarUsuario,
  cerrarSesionUsuario,
  configurarPersistencia,
} from "@/firebase/auth";

type DatosUsuario = {
  email: string;
};

function verificarCorreo(correo: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
}

export default function LoginExam() {
  const [email, setEmail] = useState("");
  const [clave, setClave] = useState("");
  const [mantenerSesion, setMantenerSesion] = useState(false);
  const [mensajeError, setMensajeError] = useState("");
  const [userActivo, setUserActivo] = useState<DatosUsuario | null>(null);

  async function enviarFormulario(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log("formulario enviado");

    // TODO: limpiar errores previos.
    setMensajeError("");

    // TODO: validar campos vacíos.
    if (email === "" || clave === "") {
      setMensajeError("llena todos los campos");
      return;
    }

    // TODO: validar formato de correo.
    if (!verificarCorreo(email)) {
      setMensajeError("formato del correo no válido");
      return;
    }

    // TODO: activar estado de carga.

    try {
      // TODO: configurar persistencia según recordarme.
      await configurarPersistencia(mantenerSesion);

      // TODO: autenticar usuario.
      const respuesta = await autenticarUsuario(email, clave);

      // TODO: guardar usuario autenticado en estado.
      setUserActivo({ email: respuesta.user.email ?? email });
    } catch {
      // TODO: manejar errores y mostrarlos en pantalla.
      setMensajeError("no se pudo iniciar sesión");
    }

    // TODO: limpiar estado de carga.
  }

  async function salir() {
    const logout = true;

    // TODO: cerrar sesión en Firebase.
    await cerrarSesionUsuario();

    // TODO: limpiar el usuario en estado.
    setUserActivo(null);

    // TODO: limpiar formulario si se desea.
    setEmail("");
    setClave("");
    setMensajeError("");

    console.log("sesion cerrada:", logout);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-900 px-4">
      <section className="w-full max-w-sm border border-zinc-700 bg-zinc-800 p-8">
        <div className="mb-8">
          <h1 className="text-xl font-bold text-white">Acceso escolar</h1>
          <p className="mt-1 text-xs text-zinc-400">
            Instituto Tecnológico de Toluca
          </p>
        </div>

        {!userActivo ? (
          <form onSubmit={enviarFormulario} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold uppercase tracking-widest text-zinc-400"
              >
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alumno@correo.com"
                className="mt-2 w-full border-b border-zinc-500 bg-transparent py-1 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-white"
              />
            </div>

            <div>
              <label
                htmlFor="clave"
                className="block text-xs font-semibold uppercase tracking-widest text-zinc-400"
              >
                Contraseña
              </label>
              <input
                id="clave"
                type="password"
                value={clave}
                onChange={(e) => setClave(e.target.value)}
                placeholder="******"
                className="mt-2 w-full border-b border-zinc-500 bg-transparent py-1 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-white"
              />
            </div>

            <label className="flex cursor-pointer items-center gap-2 text-xs text-zinc-400">
              <input
                type="checkbox"
                checked={mantenerSesion}
                onChange={(e) => setMantenerSesion(e.target.checked)}
                className="h-3 w-3 accent-white"
              />
              Recordarme
            </label>

            {mensajeError ? (
              <div className="border-l-2 border-red-500 pl-3 text-xs text-red-400">
                {mensajeError}
              </div>
            ) : null}

            <button
              type="submit"
              className="w-full border border-white py-2 text-sm font-semibold text-white hover:bg-white hover:text-zinc-900"
            >
              Ingresar
            </button>
          </form>
        ) : (
          <div>
            <p className="text-sm font-semibold text-green-400">
              Inicio de sesión correcto
            </p>
            <h2 className="mt-2 text-sm text-zinc-300">
              Bienvenido, {userActivo.email}
            </h2>

            <button
              type="button"
              onClick={salir}
              className="mt-6 w-full border border-zinc-600 py-2 text-sm text-zinc-400 hover:border-zinc-400 hover:text-white"
            >
              Cerrar sesión
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
