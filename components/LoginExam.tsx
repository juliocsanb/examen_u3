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

  async function procesarAcceso(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log("formulario enviado");

    // TODO: limpiar errores previos.
    setError("");

    // TODO: validar campos vacíos.
    if (correo === "" || contrasena === "") {
      setError("llena todos los campos");
      return;
    }

    // TODO: validar formato de correo.
    if (!esCorreoValido(correo)) {
      setError("formato del correo no válido");
      return;
    }

    // TODO: activar estado de carga.
    setCargando(true);

    try {
      // TODO: configurar persistencia según recordarme.
      await configurarPersistencia(recordarme);

      // TODO: autenticar usuario.
      const respuesta = await autenticarUsuario(correo, contrasena);

      // TODO: guardar usuario autenticado en estado.
      setUsuario({ email: respuesta.user.email ?? correo });
    } catch {
      // TODO: manejar errores y mostrarlos en pantalla.
      setError("no se pudo iniciar sesión");
    }

    // TODO: limpiar estado de carga.
    setCargando(false);
  }

  async function salir() {
    const logout = true;

    // TODO: cerrar sesión en Firebase.
    await cerrarSesionUsuario();

    // TODO: limpiar el usuario en estado.
    setUsuario(null);

    // TODO: limpiar formulario si se desea.
    setCorreo("");
    setContrasena("");
    setError("");

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

        {!usuario ? (
          <form onSubmit={procesarAcceso} className="space-y-5">
            <div>
              <label
                htmlFor="correo"
                className="block text-xs font-semibold uppercase tracking-widest text-zinc-400"
              >
                Correo electrónico
              </label>
              <input
                id="correo"
                type="email"
                value={correo}
                onChange={(event) => setCorreo(event.target.value)}
                placeholder="alumno@correo.com"
                className="mt-2 w-full border-b border-zinc-500 bg-transparent py-1 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-white"
              />
            </div>

            <div>
              <label
                htmlFor="contrasena"
                className="block text-xs font-semibold uppercase tracking-widest text-zinc-400"
              >
                Contraseña
              </label>
              <input
                id="contrasena"
                type="password"
                value={contrasena}
                onChange={(event) => setContrasena(event.target.value)}
                placeholder="******"
                className="mt-2 w-full border-b border-zinc-500 bg-transparent py-1 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-white"
              />
            </div>

            <label className="flex cursor-pointer items-center gap-2 text-xs text-zinc-400">
              <input
                type="checkbox"
                checked={recordarme}
                onChange={(event) => setRecordarme(event.target.checked)}
                className="h-3 w-3 accent-white"
              />
              Recordarme
            </label>

            {error ? (
              <div className="border-l-2 border-red-500 pl-3 text-xs text-red-400">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={cargando}
              className="w-full border border-white py-2 text-sm font-semibold text-white hover:bg-white hover:text-zinc-900"
            >
              {tituloBoton}
            </button>
          </form>
        ) : (
          <div>
            <p className="text-sm font-semibold text-green-400">
              Inicio de sesión correcto
            </p>
            <h2 className="mt-2 text-sm text-zinc-300">
              Bienvenido, {usuario.email}
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
